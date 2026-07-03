import { toast } from "sonner"
import * as XLSX from "xlsx"
import { ExtractedVisitor, parsePDFText, isAlaValida } from "@/lib/pdf-parser"
import { saveVisitasAction } from "@/app/actions/visitas"

interface PDFTextItem { str: string }
interface PDFTextContent { items: PDFTextItem[] }
interface PDFPage { getTextContent: () => Promise<PDFTextContent> }
interface PDFDocument { numPages: number; getPage: (n: number) => Promise<PDFPage> }
interface PDFJSStatic {
  GlobalWorkerOptions: { workerSrc: string }
  getDocument: (src: Uint8Array) => { promise: Promise<PDFDocument> }
}
interface CustomWindow extends Window { pdfjsLib?: PDFJSStatic }

interface ProcessFileArgs {
  file: File
  pdfjsLoaded: boolean
  setData: (data: ExtractedVisitor[]) => void
  setTotalVisits: (total: number) => void
}

export const processExcelFile = ({ file, setData, setTotalVisits }: ProcessFileArgs) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const result = e.target?.result
      if (!result) return
      const arrayData = new Uint8Array(result as ArrayBuffer)
      const workbook = XLSX.read(arrayData, { type: "array" })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(worksheet)

      setTotalVisits(jsonData.length)

      const extracted: ExtractedVisitor[] = []
      let rejected = 0

      jsonData.forEach((row) => {
        const situacao = String(row["Situação Visita"] || row["Situacao Visita"] || "Agendada").trim()
        if (/Cancelada/i.test(situacao)) return

        const prontuarioRaw = row["Prontuário"] || row["Prontuario"]
        const prontuario = prontuarioRaw ? parseInt(String(prontuarioRaw), 10) : 0
        const senha = parseInt(String(row["Senha Visita"] || row["Senha"] || 0), 10)
        const custodiado = String(row["Nome Custodiado"] || row["Custodiado"] || "").trim()

        let localizacao = String(
          row["Localização ATUAL(BLOCO - ALA - CELA)"] ||
          row["Localização AGENDAMENTO(BLOCO - ALA - CELA)"] ||
          row["Localizacao"] ||
          ""
        ).trim()

        if (!localizacao) {
          const blocoCol = String(row["Localização Atual(BLOCO)"] || row["Localização Agendamento(BLOCO)"] || "").trim()
          const alaCol = String(row["Localização Atual(ALA)"] || row["Localização Agendamento(ALA)"] || "").trim()
          const celaCol = String(row["Localização Atual(CELA)"] || row["Localização Agendamento(CELA)"] || "").trim()
          if (blocoCol || alaCol || celaCol) {
            localizacao = `Bloco ${blocoCol || "00"} - Ala ${alaCol || "X"} - Cela ${celaCol || "00"}`
          }
        }

        const cpfVisitante = String(row["CPF Visitante"] || "").trim()
        const nomeVisitante = String(row["Nome Visitante"] || "").trim()
        const relacao = String(row["Relação"] || row["Relacao"] || "").trim()

        const prioridadeRaw = row["Priorid. Visita"] || row["Prioridade Visita"] || row["Prioridade"] || ""
        const prioridade = String(prioridadeRaw).trim().toLowerCase() === "sim" ? "sim" : "não"

        if (!custodiado || !localizacao) return

        const match = String(localizacao).match(/Ala[:\s]+(.+?)\s*-\s*Cela\s+([A-Z0-9]+)/i)
        let alaStr = match ? match[1].trim() : ""
        let celaFormatted = ""
        if (match) {
          const celaRaw = match[2].trim()
          if (/SEGURAN[CÇ]A/i.test(alaStr)) {
            celaFormatted = `SEG-${celaRaw}`
          } else {
            celaFormatted = `${alaStr.trim().charAt(0).toUpperCase()}-${celaRaw}`
          }
        } else {
          const alaCol = String(row["Localização Atual(ALA)"] || row["Localização Agendamento(ALA)"] || "").trim()
          const celaCol = String(row["Localização Atual(CELA)"] || row["Localização Agendamento(CELA)"] || "").trim()
          alaStr = alaCol
          if (alaCol && celaCol) {
            if (/SEGURAN[CÇ]A/i.test(alaCol)) {
              celaFormatted = `SEG-${celaCol}`
            } else {
              celaFormatted = `${alaCol.trim().charAt(0).toUpperCase()}-${celaCol}`
            }
          }
        }

        if (!isAlaValida(alaStr)) {
          rejected++
          return
        }

        extracted.push({
          prontuario,
          senha,
          custodiado,
          localizacao,
          ala: alaStr.toUpperCase(),
          prioridade,
          cela: celaFormatted,
          cpfVisitante,
          nomeVisitante,
          relacao,
          situacao,
          visitantes: [],
        })
      })

      const loadId = toast.loading("Gravando dados no banco de dados...")
      saveVisitasAction(extracted).then((res) => {
        toast.dismiss(loadId)
        if (res.success) {
          setData(extracted)
          setTotalVisits(extracted.length)
          toast.success("Planilha importada com sucesso!", {
            description: `${extracted.length} visitas válidas salvas no banco. ${rejected} rejeitadas por ala inválida.`,
          })
        } else {
          toast.error(res.error || "Erro ao salvar visitas no banco de dados.")
        }
      }).catch((err) => {
        toast.dismiss(loadId)
        console.error(err)
        toast.error("Erro de conexão ao salvar.")
      })
    } catch (err) {
      console.error(err)
      toast.error("Erro ao ler a planilha.")
    }
  }
  reader.readAsArrayBuffer(file)
}

export const processPDFFile = ({ file, pdfjsLoaded, setData, setTotalVisits }: ProcessFileArgs) => {
  if (!pdfjsLoaded) {
    toast.error("Biblioteca PDF.js ainda está carregando. Tente novamente.")
    return
  }
  const w = window as unknown as CustomWindow
  const pdfjsLib = w.pdfjsLib
  if (!pdfjsLib) { toast.error("Erro ao inicializar PDF.js."); return }

  const reader = new FileReader()
  reader.onload = function () {
    const typedarray = new Uint8Array(this.result as ArrayBuffer)
    pdfjsLib.getDocument(typedarray).promise.then((pdf) => {
      const pages: Promise<PDFTextContent>[] = []
      for (let i = 1; i <= pdf.numPages; i++) {
        pages.push(pdf.getPage(i).then((p) => p.getTextContent()))
      }
      Promise.all(pages).then((contents) => {
        let textContent = ""
        contents.forEach((c) => { textContent += c.items.map((i) => i.str).join(" ") + " " })
        const { tempData, rejected } = parsePDFText(textContent)
        const loadId = toast.loading("Gravando dados no banco de dados...")
        saveVisitasAction(tempData).then((res) => {
          toast.dismiss(loadId)
          if (res.success) {
            setData(tempData)
            setTotalVisits(tempData.length)
            toast.success("PDF processado!", { description: `${tempData.length} visitas salvas no banco. ${rejected} rejeitadas.` })
          } else {
            toast.error(res.error || "Erro ao salvar visitas no banco.")
          }
        }).catch((err) => {
          toast.dismiss(loadId)
          console.error(err)
          toast.error("Erro de conexão ao salvar.")
        })
      }).catch((err) => { console.error(err); toast.error("Erro ao ler PDF.") })
    }).catch((err) => { console.error(err); toast.error("Erro ao decodificar PDF.") })
  }
  reader.readAsArrayBuffer(file)
}

export function useVisitasFileProcessor({ pdfjsLoaded, setData, setTotalVisits }: Omit<ProcessFileArgs, "file">) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileInputRef: React.RefObject<HTMLInputElement | null>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const name = file.name.toLowerCase()
    
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      processExcelFile({ file, pdfjsLoaded, setData, setTotalVisits })
    } else if (name.endsWith(".pdf")) {
      processPDFFile({ file, pdfjsLoaded, setData, setTotalVisits })
    } else {
      toast.error("Formato não suportado. Envie .xlsx, .xls ou .pdf")
    }
    
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return { handleFileChange }
}

"use client"

import { useState, useEffect, useRef } from "react"
import { Download, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import { UploadArea } from "@/components/sistema/UploadArea"
import { VisitasSidebar } from "@/components/sistema/VisitasSidebar"
import { VisitasTable } from "@/components/sistema/VisitasTable"
import { ExtractedVisitor, parsePDFText, isAlaValida } from "@/lib/pdf-parser"

interface PDFTextItem {
  str: string
}

interface PDFTextContent {
  items: PDFTextItem[]
}

interface PDFPage {
  getTextContent: () => Promise<PDFTextContent>
}

interface PDFDocument {
  numPages: number
  getPage: (pageNumber: number) => Promise<PDFPage>
}

interface PDFJSStatic {
  GlobalWorkerOptions: {
    workerSrc: string
  }
  getDocument: (source: Uint8Array) => {
    promise: Promise<PDFDocument>
  }
}

interface CustomWindow extends Window {
  pdfjsLib?: PDFJSStatic
}

export default function VisitasPage() {
  const [data, setData] = useState<ExtractedVisitor[]>([])
  const [search, setSearch] = useState("")
  const [sortOption, setSortOption] = useState<"senha" | "custodiado" | "localizacao">("senha")
  const [selectedAla, setSelectedAla] = useState<string>("Todos")
  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dynamically load pdf.js on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
    script.async = true
    script.onload = () => {
      // Set worker
      const customWindow = window as unknown as CustomWindow
      if (customWindow.pdfjsLib) {
        customWindow.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"
        setPdfjsLoaded(true)
      }
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Parse Excel
  const processExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const bstr = e.target?.result
        const workbook = XLSX.read(bstr, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json<Record<string, string | number | undefined>>(worksheet)

        const extracted: ExtractedVisitor[] = []
        const seen = new Set<string>()
        let rejected = 0

        jsonData.forEach((row) => {
          const senha = row["Senha Visita"] || row["Senha"] || 0
          const custodiado = row["Nome Custodiado"] || row["Custodiado"] || row["Nome"]
          const localizacao = row["Localização ATUAL(BLOCO - ALA - CELA)"] || row["Localizacao"] || row["Cela"]

          if (custodiado && localizacao && row["Situação Visita"] !== "Cancelada" && row["Situacao"] !== "Cancelada") {
            if (!isAlaValida(String(localizacao))) {
              rejected++
              return
            }

            const key = custodiado.toString().toUpperCase().trim()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")

            if (!seen.has(key)) {
              seen.add(key)
              extracted.push({
                senha: parseInt(String(senha), 10) || 0,
                custodiado: custodiado.toString().trim(),
                localizacao: localizacao.toString().trim(),
              })
            }
          }
        })

        setData(extracted)
        toast.success("Excel importado com sucesso!", {
          description: `Total de ${extracted.length} registros extraídos. ${rejected} rejeitados por ala inválida.`,
        })
      } catch (err) {
        console.error(err)
        toast.error("Erro ao ler planilha Excel.")
      }
    }
    reader.readAsBinaryString(file)
  }

  // Parse PDF
  const processPDFFile = (file: File) => {
    if (!pdfjsLoaded) {
      toast.error("Biblioteca PDF.js ainda está carregando. Tente novamente.")
      return
    }

    const customWindow = window as unknown as CustomWindow
    const pdfjsLib = customWindow.pdfjsLib

    if (!pdfjsLib) {
      toast.error("Erro ao inicializar biblioteca PDF.js.")
      return
    }

    const reader = new FileReader()
    reader.onload = function () {
      const typedarray = new Uint8Array(this.result as ArrayBuffer)
      pdfjsLib.getDocument(typedarray).promise.then((pdf) => {
        let textContent = ""
        const pages: Promise<PDFTextContent>[] = []
        
        for (let i = 1; i <= pdf.numPages; i++) {
          pages.push(pdf.getPage(i).then((page) => page.getTextContent()))
        }

        Promise.all(pages).then((contents) => {
          contents.forEach((content) => {
            textContent += content.items.map((item) => item.str).join(" ") + " "
          })
          const { tempData, rejected } = parsePDFText(textContent)
          setData(tempData)
          toast.success("PDF processado com sucesso!", {
            description: `Extraídas ${tempData.length} visitas válidas. ${rejected} rejeitadas por ala inválida.`,
          })
        }).catch((err) => {
          console.error(err)
          toast.error("Erro ao ler conteúdo das páginas do PDF.")
        })
      }).catch((err) => {
        console.error(err)
        toast.error("Erro ao decodificar arquivo PDF.")
      })
    }
    reader.readAsArrayBuffer(file)
  }

  // Handle File Upload Event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const name = file.name.toLowerCase()
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
      processExcelFile(file)
    } else if (name.endsWith(".pdf")) {
      processPDFFile(file)
    } else {
      toast.error("Formato não suportado. Envie um arquivo .xlsx, .xls ou .pdf")
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Export Extract data to Excel
  const handleExportExcel = () => {
    if (data.length === 0) return
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Visitas Extraídas")
    XLSX.writeFile(wb, "Visitas_Extraidas_UPI4.xlsx")
    toast.success("Excel gerado com sucesso!")
  }

  // Sort and Filter Data
  const sortedAndFiltered = data
    .filter((item) => {
      const matchesSearch = item.custodiado.toLowerCase().includes(search.toLowerCase()) || 
                            item.localizacao.toLowerCase().includes(search.toLowerCase())
      
      if (selectedAla === "Todos") return matchesSearch

      // Check if location contains "Ala X"
      const alaMatch = item.localizacao.match(/Ala[:\s]+(.+?)\s*-\s*Cela/i)
      const itemAla = alaMatch ? alaMatch[1].trim().toUpperCase() : ""
      return matchesSearch && itemAla === selectedAla.toUpperCase()
    })
    .sort((a, b) => {
      if (sortOption === "senha") return a.senha - b.senha
      if (sortOption === "custodiado") return a.custodiado.localeCompare(b.custodiado)
      return a.localizacao.localeCompare(b.localizacao)
    })

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-2xl font-bold tracking-tight">Sistema de Extração e Consulta de Visitas</h1>
          </div>
          <p className="text-white/80 text-sm mt-1">
            Faça upload do relatório de visitas em PDF ou planilha Excel para organizar os dados por senha, ala e internos.
          </p>
        </div>

        {data.length > 0 && (
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-purple-700 hover:bg-slate-100 rounded-xl shadow-sm transition"
          >
            <Download size={14} /> Exportar Excel
          </button>
        )}
      </div>

      {/* Upload Drag & Drop Area */}
      {data.length === 0 ? (
        <UploadArea onFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls / Filter Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <VisitasSidebar
              data={data}
              sortOption={sortOption}
              onSortOptionChange={setSortOption}
              selectedAla={selectedAla}
              onSelectedAlaChange={setSelectedAla}
              onReset={() => setData([])}
            />
          </div>

          {/* Table Container Column */}
          <div className="lg:col-span-3">
            <VisitasTable
              sortedAndFiltered={sortedAndFiltered}
              totalCount={data.length}
              search={search}
              onSearchChange={setSearch}
            />
          </div>
        </div>
      )}

      {/* Dynamic alert worker status */}
      {!pdfjsLoaded && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>Carregando módulo PDF.js no navegador para processamento local...</span>
        </div>
      )}
    </div>
  )
}

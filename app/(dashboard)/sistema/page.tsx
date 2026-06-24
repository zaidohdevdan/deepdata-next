"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Download, AlertCircle, RefreshCw, Search, FileText } from "lucide-react"
import { toast } from "sonner"
import * as XLSX from "xlsx"

import { UploadArea } from "@/components/sistema/UploadArea"
import { VisitasSidebar } from "@/components/sistema/VisitasSidebar"
import { VisitasTable } from "@/components/sistema/VisitasTable"
import { ExtractedVisitor, parsePDFText, isAlaValida, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"

interface PDFTextItem { str: string }
interface PDFTextContent { items: PDFTextItem[] }
interface PDFPage { getTextContent: () => Promise<PDFTextContent> }
interface PDFDocument { numPages: number; getPage: (n: number) => Promise<PDFPage> }
interface PDFJSStatic {
  GlobalWorkerOptions: { workerSrc: string }
  getDocument: (src: Uint8Array) => { promise: Promise<PDFDocument> }
}
interface CustomWindow extends Window { pdfjsLib?: PDFJSStatic }

export default function VisitasPage() {
  const [data, setData] = useState<ExtractedVisitor[]>([])
  const [totalVisits, setTotalVisits] = useState(0)

  // Filtros
  const [searchInterno, setSearchInterno] = useState("")
  const [searchVisitante, setSearchVisitante] = useState("")
  const [selectedAla, setSelectedAla] = useState("Todos")
  const [selectedCela, setSelectedCela] = useState("Todas")
  const [selectedPrioridade, setSelectedPrioridade] = useState("Todas")
  const [sortOption, setSortOption] = useState<"senha" | "custodiado" | "localizacao">("senha")
  const [viewMode, setViewMode] = useState<"visitas" | "internos">("visitas")
  const [selectedParidadeCela, setSelectedParidadeCela] = useState("Todas")

  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar dados salvos no localStorage ao montar a página
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("sistema_visitas_data")
      const storedTotal = localStorage.getItem("sistema_visitas_total")
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setData(parsed)
            if (storedTotal) {
              setTotalVisits(parseInt(storedTotal, 10))
            } else {
              setTotalVisits(parsed.length)
            }
          }
        } catch (e) {
          console.error("Erro ao carregar visitas salvas", e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  // Sincronizar dados com o localStorage ao alterar
  useEffect(() => {
    if (typeof window !== "undefined" && isLoaded) {
      if (data.length > 0) {
        localStorage.setItem("sistema_visitas_data", JSON.stringify(data))
        localStorage.setItem("sistema_visitas_total", String(totalVisits))
      } else {
        localStorage.removeItem("sistema_visitas_data")
        localStorage.removeItem("sistema_visitas_total")
      }
    }
  }, [data, totalVisits, isLoaded])

  // Load pdf.js
  useEffect(() => {
    if (typeof window === "undefined") return
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
    script.async = true
    script.onload = () => {
      const w = window as unknown as CustomWindow
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"
        setPdfjsLoaded(true)
      }
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Parse Excel — lê TODAS as linhas, sem deduplicação
  const processExcelFile = (file: File) => {
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

          // Fallbacks para a string de localização
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

          // Dados do visitante
          const cpfVisitante = String(row["CPF Visitante"] || "").trim()
          const nomeVisitante = String(row["Nome Visitante"] || "").trim()
          const relacao = String(row["Relação"] || row["Relacao"] || "").trim()

          const prioridadeRaw = row["Priorid. Visita"] || row["Prioridade Visita"] || row["Prioridade"] || ""
          const prioridade = String(prioridadeRaw).trim().toLowerCase() === "sim" ? "sim" : "não"

          if (!custodiado || !localizacao) return

          // Extrair Ala e Cela da string de localização
          let match = String(localizacao).match(/Ala[:\s]+(.+?)\s*-\s*Cela\s+([A-Z0-9]+)/i)
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
            // Se falhar o regex, tenta obter das colunas individuais
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

        setData(extracted)
        toast.success("Planilha importada com sucesso!", {
          description: `${extracted.length} visitas válidas. ${rejected} rejeitadas por ala inválida.`,
        })
      } catch (err) {
        console.error(err)
        toast.error("Erro ao ler a planilha.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  // Parse PDF
  const processPDFFile = (file: File) => {
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
          setData(tempData)
          setTotalVisits(tempData.length)
          toast.success("PDF processado!", { description: `${tempData.length} visitas. ${rejected} rejeitadas.` })
        }).catch((err) => { console.error(err); toast.error("Erro ao ler PDF.") })
      }).catch((err) => { console.error(err); toast.error("Erro ao decodificar PDF.") })
    }
    reader.readAsArrayBuffer(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const name = file.name.toLowerCase()
    if (name.endsWith(".xlsx") || name.endsWith(".xls")) processExcelFile(file)
    else if (name.endsWith(".pdf")) processPDFFile(file)
    else toast.error("Formato não suportado. Envie .xlsx, .xls ou .pdf")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Celas disponíveis para o dropdown (baseado nos dados filtrados por Ala)
  const celasDisponiveis = Array.from(
    new Set(
      data
        .filter((d) => selectedAla === "Todos" || d.ala === selectedAla)
        .map((d) => d.cela)
        .filter(Boolean)
    )
  ).sort()

  // Filtros + ordenação
  const sortedAndFiltered = data
    .filter((item) => {
      const matchInterno = item.custodiado.toLowerCase().includes(searchInterno.toLowerCase()) ||
        String(item.prontuario).includes(searchInterno)
      const matchVisitante = item.nomeVisitante.toLowerCase().includes(searchVisitante.toLowerCase()) ||
        item.cpfVisitante.includes(searchVisitante)
      const matchAla = selectedAla === "Todos" || item.ala.toUpperCase() === selectedAla.toUpperCase()
      const matchCela = selectedCela === "Todas" || item.cela === selectedCela
      const matchPrioridade = selectedPrioridade === "Todas" || item.prioridade === selectedPrioridade

      const matchParidadeCela = (() => {
        if (selectedParidadeCela === "Todas") return true
        if (!item.cela) return false
        const cellNumMatch = item.cela.match(/\d+$/)
        if (!cellNumMatch) return false
        const num = parseInt(cellNumMatch[0], 10)
        return selectedParidadeCela === "pares" ? num % 2 === 0 : num % 2 !== 0
      })()

      return matchInterno && matchVisitante && matchAla && matchCela && matchPrioridade && matchParidadeCela
    })
    .sort((a, b) => {
      if (sortOption === "senha") return a.senha - b.senha
      if (sortOption === "custodiado") return a.custodiado.localeCompare(b.custodiado)
      return a.localizacao.localeCompare(b.localizacao)
    })

  // Agrupamento das linhas para exibição (Visitas vs Internos)
  const displayRows = (() => {
    if (viewMode === "visitas") {
      return sortedAndFiltered.map((item) => ({
        senhaDisplay: String(item.senha),
        custodiado: item.custodiado,
        prontuario: item.prontuario,
        cela: item.cela,
        ala: item.ala,
        nomeVisitante: item.nomeVisitante,
        cpfVisitante: item.cpfVisitante,
        relacao: item.relacao,
        prioridade: item.prioridade,
        situacao: item.situacao,
      }))
    } else {
      const groups = new Map<string, ExtractedVisitor[]>()
      sortedAndFiltered.forEach((item) => {
        const key = item.prontuario > 0 ? String(item.prontuario) : item.custodiado.toUpperCase()
        if (!groups.has(key)) {
          groups.set(key, [])
        }
        groups.get(key)!.push(item)
      })

      return Array.from(groups.values()).map((items) => {
        const sortedItems = [...items].sort((a, b) => a.senha - b.senha)
        const senhas = sortedItems.map((i) => i.senha).join(", ")
        const nomes = Array.from(new Set(sortedItems.map((i) => i.nomeVisitante).filter(Boolean))).join(", ")
        const cpfs = Array.from(new Set(sortedItems.map((i) => i.cpfVisitante).filter(Boolean))).join(", ")
        const relacoes = Array.from(new Set(sortedItems.map((i) => i.relacao).filter(Boolean))).join(", ")
        const situacoes = Array.from(new Set(sortedItems.map((i) => i.situacao).filter(Boolean))).join(", ")
        const prioridades = sortedItems.some((i) => i.prioridade === "sim") ? "sim" : "não"
        const first = sortedItems[0]

        return {
          senhaDisplay: senhas || "—",
          custodiado: first.custodiado,
          prontuario: first.prontuario,
          cela: first.cela,
          ala: first.ala,
          nomeVisitante: nomes || "—",
          cpfVisitante: cpfs || "—",
          relacao: relacoes || "—",
          prioridade: prioridades,
          situacao: situacoes || "—",
        }
      })
    }
  })()

  const uniqueInternos = new Set(data.filter((d) => d.prontuario > 0).map((d) => d.prontuario)).size

  const handleExportExcel = () => {
    if (displayRows.length === 0) return
    const exportData = displayRows.map((r, idx) => {
      if (viewMode === "visitas") {
        return {
          Ordem: idx + 1,
          Senha: r.senhaDisplay,
          "Nome Visitante": r.nomeVisitante,
          "CPF Visitante": r.cpfVisitante,
          Relação: r.relacao,
          Situação: r.situacao,
          Prontuário: r.prontuario,
          Custodiado: r.custodiado,
          Ala: r.ala,
          Cela: r.cela,
          Prioridade: r.prioridade,
        }
      } else {
        return {
          Ordem: idx + 1,
          Prontuário: r.prontuario,
          Custodiado: r.custodiado,
          Ala: r.ala,
          Cela: r.cela,
        }
      }
    })
    const ws = XLSX.utils.json_to_sheet(exportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, viewMode === "visitas" ? "Visitas" : "Internos")
    XLSX.writeFile(wb, viewMode === "visitas" ? "Visitas_UPI4.xlsx" : "Internos_UPI4.xlsx")
    toast.success("Planilha gerada com sucesso!")
  }

  // Gerar PDF da tabela filtrada
  const handleGeneratePDF = useCallback(() => {
    if (displayRows.length === 0) return

    let headers = ""
    let rows = ""

    if (viewMode === "visitas") {
      headers = `
        <th>Nº</th>
        <th>Senha</th>
        <th>Visitante</th>
        <th>Relação</th>
        <th>Interno</th>
        <th>Ala/Cela</th>
        <th>Prior.</th>`
      rows = displayRows
        .map(
          (r, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${r.senhaDisplay}</td>
            <td>${r.nomeVisitante || "—"}</td>
            <td>${r.relacao || "—"}</td>
            <td>${r.custodiado}<br/><small>#${r.prontuario}</small></td>
            <td>${r.cela || r.ala}</td>
            <td>${r.prioridade === "sim" ? "✓ SIM" : "NÃO"}</td>
          </tr>`
        )
        .join("")
    } else {
      headers = `
        <th>Nº</th>
        <th>Prontuário</th>
        <th>Interno</th>
        <th>Ala/Cela</th>`
      rows = displayRows
        .map(
          (r, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td>${r.prontuario > 0 ? r.prontuario : "—"}</td>
            <td>${r.custodiado}</td>
            <td>${r.cela || r.ala}</td>
          </tr>`
        )
        .join("")
    }

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>${viewMode === "visitas" ? "Visitas" : "Internos"} UPI-4</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 10px; margin: 20px; }
  h1 { font-size: 14px; margin-bottom: 4px; }
  p { font-size: 9px; color: #666; margin-bottom: 12px; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #5b21b6; color: white; padding: 5px 6px; text-align: left; font-size: 9px; text-transform: uppercase; }
  td { padding: 4px 6px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
  tr:nth-child(even) td { background: #f8f7ff; }
  small { color: #888; font-size: 8px; }
  @page { margin: 15mm; }
</style></head><body>
<h1>Sistema de ${viewMode === "visitas" ? "Visitas" : "Internos"} UPI-4</h1>
<p>Gerado em ${new Date().toLocaleDateString("pt-BR")} — Total: ${displayRows.length} ${viewMode === "visitas" ? "visitas" : "internos"} exibidos</p>
<table>
<thead><tr>${headers}</tr></thead>
<tbody>${rows}</tbody>
</table>
</body></html>`

    const win = window.open("", "_blank")
    if (!win) { toast.error("Pop-up bloqueado. Permita pop-ups e tente novamente."); return }
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 400)
  }, [displayRows, viewMode])

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 rounded-2xl border border-slate-100 p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-purple-600" size={32} />
          <span className="text-sm font-semibold text-slate-500 tracking-wide animate-pulse">Carregando painel de visitas...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-2xl font-bold tracking-tight">Sistema de Visitas UPI-4</h1>
          </div>
          <p className="text-white/80 text-sm">
            Importe o relatório de visitas (.xlsx ou .pdf) para consultar, filtrar e exportar os dados completos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.length > 0 && (
            <>
              <button
                onClick={handleExportExcel}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-purple-700 hover:bg-slate-100 rounded-xl shadow-sm transition"
              >
                <Download size={14} /> Exportar Planilha
              </button>
              <button
                onClick={handleGeneratePDF}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-900/60 hover:bg-purple-900/80 text-white rounded-xl border border-purple-400/40 shadow-sm transition"
              >
                <FileText size={14} /> Gerar PDF
              </button>
              <button
                onClick={() => { setData([]); setTotalVisits(0) }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-800/60 hover:bg-purple-800/80 text-white rounded-xl border border-purple-400/30 shadow-sm transition"
              >
                <RefreshCw size={14} /> Importar Outro
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload ou Conteúdo */}
      {data.length === 0 ? (
        <UploadArea onFileChange={handleFileChange} fileInputRef={fileInputRef} />
      ) : (
        <div className="space-y-4">

          {/* ── Barra de Ferramentas Horizontal (padrão Escalas) ── */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-4 lg:grid-cols-10 gap-4">

            {/* Busca interno */}
            <div className="space-y-1 lg:col-span-2 md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Buscar Interno</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchInterno}
                  onChange={(e) => setSearchInterno(e.target.value)}
                  placeholder="Nome do custodiado ou prontuário..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg outline-none font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Busca visitante */}
            <div className="space-y-1 lg:col-span-2 md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Buscar Visitante</label>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchVisitante}
                  onChange={(e) => setSearchVisitante(e.target.value)}
                  placeholder="Nome do visitante ou CPF..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:border-purple-400 focus:ring-1 focus:ring-purple-400 rounded-lg outline-none font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Filtro Ala */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ala</label>
              <select
                value={selectedAla}
                onChange={(e) => { setSelectedAla(e.target.value); setSelectedCela("Todas") }}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
              >
                <option value="Todos">Todas as Alas</option>
                {ALAS_VALIDAS_UPI4.map((ala) => (
                  <option key={ala} value={ala}>{ala}</option>
                ))}
              </select>
            </div>

            {/* Filtro Cela */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Cela</label>
              <select
                value={selectedCela}
                onChange={(e) => setSelectedCela(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
              >
                <option value="Todas">Todas as Celas</option>
                {celasDisponiveis.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Filtro Celas Par/Ímpar */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Celas (Par/Ímpar)</label>
              <select
                value={selectedParidadeCela}
                onChange={(e) => setSelectedParidadeCela(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
              >
                <option value="Todas">Todas</option>
                <option value="pares">Pares</option>
                <option value="impares">Ímpares</option>
              </select>
            </div>

            {/* Filtro Prioridade */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prioridade</label>
              <select
                value={selectedPrioridade}
                onChange={(e) => setSelectedPrioridade(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
              >
                <option value="Todas">Todas</option>
                <option value="sim">Prioritárias</option>
                <option value="não">Normais</option>
              </select>
            </div>

            {/* Ordenar */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ordenar por</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as "senha" | "custodiado" | "localizacao")}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
              >
                <option value="senha">Senha</option>
                <option value="custodiado">Nome do Interno</option>
                <option value="localizacao">Localização</option>
              </select>
            </div>

            {/* Totais (Seletores de Visualização) */}
            <div className="space-y-1 md:col-span-2 lg:col-span-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Exibição / Totais</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("visitas")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-center transition border shadow-sm outline-none cursor-pointer duration-200 select-none ${
                    viewMode === "visitas"
                      ? "bg-purple-600 border-purple-700 text-white shadow-md ring-2 ring-purple-300 scale-[1.03]"
                      : "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100/50 opacity-60 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <span className={`block text-[9px] font-bold uppercase ${viewMode === "visitas" ? "text-purple-100" : "text-purple-500"}`}>Visitas</span>
                  <span className="block text-sm font-black">{totalVisits}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("internos")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-center transition border shadow-sm outline-none cursor-pointer duration-200 select-none ${
                    viewMode === "internos"
                      ? "bg-indigo-600 border-indigo-700 text-white shadow-md ring-2 ring-indigo-300 scale-[1.03]"
                      : "bg-indigo-50 border-indigo-100 text-indigo-700 hover:bg-indigo-100/50 opacity-60 hover:opacity-100 hover:scale-[1.01]"
                  }`}
                >
                  <span className={`block text-[9px] font-bold uppercase ${viewMode === "internos" ? "text-indigo-100" : "text-indigo-500"}`}>Internos</span>
                  <span className="block text-sm font-black">{uniqueInternos}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Estatísticas por Ala */}
          <VisitasSidebar data={data} totalVisits={totalVisits} />

          {/* Tabela — largura total */}
          <VisitasTable
            displayRows={displayRows}
            totalCount={viewMode === "visitas" ? data.length : uniqueInternos}
            viewMode={viewMode}
          />
        </div>
      )}

      {/* Aviso PDF.js */}
      {!pdfjsLoaded && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>Carregando módulo PDF.js no navegador para processamento local...</span>
        </div>
      )}
    </div>
  )
}

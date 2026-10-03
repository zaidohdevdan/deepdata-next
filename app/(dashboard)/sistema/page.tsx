"use client"

import { useState, useEffect, useRef } from "react"
import { Download, AlertCircle, RefreshCw, Search, Printer } from "lucide-react"
import { toast } from "sonner"

import { UploadArea } from "@/components/sistema/UploadArea"
import { VisitasSidebar } from "@/components/sistema/VisitasSidebar"
import { VisitasTable } from "@/components/sistema/VisitasTable"
import { ExtractedVisitor, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"
import { getVisitasAction, clearVisitasAction } from "@/app/actions/visitas"

import { handleExportExcel, handleGeneratePDF } from "@/components/sistema/utils/export-visitas"
import { useVisitasFileProcessor } from "@/components/sistema/hooks/useVisitasFileProcessor"
import { useVisitasFiltros } from "@/components/sistema/hooks/useVisitasFiltros"
import { detectVisitorGender } from "@/lib/gender-detector"

export default function VisitasPage() {
  const [data, setData] = useState<ExtractedVisitor[]>([])
  const [totalVisits, setTotalVisits] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const [pdfjsLoaded, setPdfjsLoaded] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load from DB on mount
  useEffect(() => {
    getVisitasAction()
      .then((dbData) => {
        if (dbData && dbData.length > 0) {
          const mapped = dbData.map((d) => ({
            prontuario: d.prontuario,
            senha: d.senha,
            custodiado: d.custodiado,
            localizacao: d.localizacao,
            ala: d.ala,
            prioridade: d.prioridade,
            cela: d.cela,
            cpfVisitante: d.cpfVisitante,
            nomeVisitante: d.nomeVisitante,
            relacao: d.relacao,
            situacao: d.situacao,
            visitantes: []
          }))
          setData(mapped)
          setTotalVisits(mapped.length)
        }
      })
      .catch((err) => console.error("Error loading visits from db:", err))
  }, [])

  // Mark as loaded after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Load pdf.js
  useEffect(() => {
    if (typeof window === "undefined") return
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"
    script.async = true
    script.onload = () => {
      interface PdfjsWindow extends Window {
        pdfjsLib?: {
          GlobalWorkerOptions: { workerSrc: string }
        }
      }
      const w = window as PdfjsWindow
      if (w.pdfjsLib) {
        w.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js"
        setPdfjsLoaded(true)
      }
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  // Processor Hook
  const { handleFileChange } = useVisitasFileProcessor({ pdfjsLoaded, setData, setTotalVisits })

  // Filters Hook
  const {
    searchInterno, setSearchInterno,
    searchVisitante, setSearchVisitante,
    selectedAla, setSelectedAla,
    selectedCela, setSelectedCela,
    selectedPrioridade, setSelectedPrioridade,
    sortOption, setSortOption,
    viewMode, setViewMode,
    selectedParidadeCela, setSelectedParidadeCela,
    celasDisponiveis,
    displayRows,
    allDisplayRows,
    currentPage,
    setCurrentPage,
    totalPages
  } = useVisitasFiltros(data)

  const uniqueInternos = new Set(data.filter((d) => d.prontuario > 0).map((d) => d.prontuario)).size

  const generateReport = () => {
    const isFilteringAla = selectedAla && selectedAla !== "Todos"
    const targetData = isFilteringAla
      ? data.filter(d => d.ala && d.ala.toUpperCase() === selectedAla.toUpperCase())
      : data

    const wings = isFilteringAla
      ? [selectedAla.toUpperCase()]
      : Array.from(new Set(data.map(d => d.ala.toUpperCase()))).sort()

    let reportText = "RELATÓRIO DE CONTROLE DE VISITAS - UPI-4\n"
    if (isFilteringAla) {
      reportText += `ALA SELECIONADA: ${selectedAla.toUpperCase()}\n`
    }
    reportText += "========================================\n\n"

    let totalGeralVisitantes = 0
    let totalGeralHomens = 0
    let totalGeralMulheres = 0
    const totalGeralInternosSet = new Set<number>()

    wings.forEach(wingName => {
      const wingData = targetData.filter(d => d.ala && d.ala.toUpperCase() === wingName)
      const comPrioridade = wingData.filter(d => d.prioridade === "sim").length
      const semPrioridade = wingData.filter(d => d.prioridade === "não").length
      const totalVisitantes = wingData.length
      const internos = new Set(wingData.filter(d => d.prontuario > 0).map(d => d.prontuario))

      let homens = 0
      let mulheres = 0
      wingData.forEach(d => {
        const gender = detectVisitorGender(d.relacao, d.nomeVisitante)
        if (gender === "M") {
          homens++
        } else {
          mulheres++
        }
      })

      totalGeralVisitantes += totalVisitantes
      totalGeralHomens += homens
      totalGeralMulheres += mulheres
      wingData.forEach(d => {
        if (d.prontuario > 0) totalGeralInternosSet.add(d.prontuario)
      })

      reportText += `${wingName}:\n`
      reportText += `  - HOMENS: ${homens}\n`
      reportText += `  - MULHERES: ${mulheres}\n`
      reportText += `  - COM PRIORIDADE: ${comPrioridade}\n`
      reportText += `  - SEM PRIORIDADE: ${semPrioridade}\n`
      reportText += `  - QUANTIDADE DE INTERNOS: ${internos.size}\n`
      reportText += `  - TOTAL DE VISITANTES: ${totalVisitantes}\n`
      reportText += `  - SÍNTESE: ${wingName}: HOMENS: ${homens}, MULHERES: ${mulheres}, COM PRIORIDADE: ${comPrioridade}, SEM PRIORIDADE: ${semPrioridade}, TOTAL: ${totalVisitantes}\n\n`
    })

    reportText += "========================================\n"
    reportText += `${isFilteringAla ? `TOTAL (${selectedAla.toUpperCase()}) DE HOMENS` : "TOTAL GERAL DE HOMENS"}: ${totalGeralHomens}\n`
    reportText += `${isFilteringAla ? `TOTAL (${selectedAla.toUpperCase()}) DE MULHERES` : "TOTAL GERAL DE MULHERES"}: ${totalGeralMulheres}\n`
    reportText += `${isFilteringAla ? `TOTAL (${selectedAla.toUpperCase()}) DE VISITANTES` : "TOTAL GERAL DE VISITANTES"}: ${totalGeralVisitantes}\n`
    reportText += `${isFilteringAla ? `TOTAL (${selectedAla.toUpperCase()}) DE INTERNOS VISITADOS` : "TOTAL GERAL DE INTERNOS VISITADOS"}: ${totalGeralInternosSet.size}\n`
    return reportText
  }

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
    <>
      <div className="space-y-5 print:hidden">
      {/* Header Banner estilo Enterprise Hero */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SISTEMA ADMINISTRATIVO • UPI-4</span>
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Controle de Visitas Comuns
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">
            Importe o relatório de visitas (.xlsx ou .pdf) para consultar, filtrar por ala/cela e exportar os dados completos da unidade.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {data.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => handleExportExcel(allDisplayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
                title="Exportar todos os registros filtrados para Excel"
              >
                <Download size={14} />
                <span>Exportar Planilha ({allDisplayRows.length})</span>
              </button>
              <button
                type="button"
                onClick={() => handleGeneratePDF(allDisplayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200/80 shadow-2xs transition cursor-pointer"
                title="Imprimir ou gerar PDF de todos os registros filtrados"
              >
                <Printer size={14} />
                <span>Imprimir / PDF</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const loadId = toast.loading("Limpando dados no banco...")
                  try {
                    const res = await clearVisitasAction()
                    toast.dismiss(loadId)
                    if (res.success) {
                      setData([])
                      setTotalVisits(0)
                      toast.success("Todas as visitas foram limpas com sucesso.")
                    } else {
                      toast.error(res.error || "Erro ao limpar visitas no banco.")
                    }
                  } catch {
                    toast.dismiss(loadId)
                    toast.error("Erro de conexão ao limpar visitas.")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full border border-rose-200/80 shadow-2xs transition cursor-pointer"
              >
                <RefreshCw size={13} />
                <span>Limpar / Outro</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload ou Conteúdo */}
      {data.length === 0 ? (
        <UploadArea onFileChange={(e) => handleFileChange(e, fileInputRef)} fileInputRef={fileInputRef} />
      ) : (
        <div className="space-y-5">
          {/* ── Barra de Ferramentas estilo Enterprise Hero (Customers / Contacts) ── */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-4">
            {/* Linha Superior: Abas no estilo exato do screenshot (Customers / Contacts) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode("visitas")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    viewMode === "visitas"
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
                      : "bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200/60"
                  }`}
                >
                  <span className="text-sm">👥</span>
                  <span>Visitantes</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white border border-slate-200/80 text-slate-700 font-bold">
                    {totalVisits}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("internos")}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    viewMode === "internos"
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
                      : "bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-200/60"
                  }`}
                >
                  <span className="text-sm">📇</span>
                  <span>Custodiados</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-white border border-slate-200/80 text-slate-700 font-bold">
                    {uniqueInternos}
                  </span>
                </button>
              </div>

              {/* Botão para alternar Estatísticas & Relatório */}
              <button
                type="button"
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition cursor-pointer self-start sm:self-auto"
              >
                <span>📊</span>
                <span>{showStats ? "Ocultar Estatísticas" : "Ver Estatísticas por Ala"}</span>
              </button>
            </div>

            {/* Linha Inferior: Filtros estilo Enterprise Hero com pílulas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
              {/* Busca interno */}
              <div className="space-y-1 lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Buscar Custodiado
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchInterno}
                    onChange={(e) => setSearchInterno(e.target.value)}
                    placeholder="Nome ou prontuário..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
                  />
                </div>
              </div>

              {/* Busca visitante */}
              <div className="space-y-1 lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Buscar Visitante
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchVisitante}
                    onChange={(e) => setSearchVisitante(e.target.value)}
                    placeholder="Nome do visitante ou CPF..."
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
                  />
                </div>
              </div>

              {/* Filtro Ala */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Ala
                </label>
                <select
                  value={selectedAla}
                  onChange={(e) => {
                    setSelectedAla(e.target.value)
                    setSelectedCela("Todas")
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
                >
                  <option value="Todos">Todas as Alas</option>
                  {ALAS_VALIDAS_UPI4.map((ala) => (
                    <option key={ala} value={ala}>
                      {ala}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Cela */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Cela
                </label>
                <select
                  value={selectedCela}
                  onChange={(e) => setSelectedCela(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
                >
                  <option value="Todas">Todas as Celas</option>
                  {celasDisponiveis.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sub-filtros extras */}
            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Celas:</span>
                <select
                  value={selectedParidadeCela}
                  onChange={(e) => setSelectedParidadeCela(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-200/80 rounded-full bg-slate-50 text-slate-700 font-semibold outline-none"
                >
                  <option value="Todas">Pares & Ímpares</option>
                  <option value="pares">Apenas Pares</option>
                  <option value="impares">Apenas Ímpares</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Prioridade:</span>
                <select
                  value={selectedPrioridade}
                  onChange={(e) => setSelectedPrioridade(e.target.value)}
                  className="px-2.5 py-1 text-xs border border-slate-200/80 rounded-full bg-slate-50 text-slate-700 font-semibold outline-none"
                >
                  <option value="Todas">Todas</option>
                  <option value="sim">Prioritárias</option>
                  <option value="não">Normais</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Ordenar:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as "senha" | "custodiado" | "localizacao")}
                  className="px-2.5 py-1 text-xs border border-slate-200/80 rounded-full bg-slate-50 text-slate-700 font-semibold outline-none"
                >
                  <option value="senha">Por Senha</option>
                  <option value="custodiado">Por Nome do Interno</option>
                  <option value="localizacao">Por Ala / Cela</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchInterno("")
                  setSearchVisitante("")
                  setSelectedAla("Todos")
                  setSelectedCela("Todas")
                  setSelectedParidadeCela("Todas")
                  setSelectedPrioridade("Todas")
                  setSortOption("senha")
                }}
                className="ml-auto text-[11px] font-bold text-blue-600 hover:text-blue-800 transition cursor-pointer"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          </div>

          {/* Estatísticas e Relatório por Ala (Card Colapsável) */}
          {showStats && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">📊</span>
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Estatísticas Consolidadas da Visita por Ala
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStats(false)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-2">
                  <VisitasSidebar data={data} totalVisits={totalVisits} />
                </div>

                <div className="space-y-3 bg-slate-50/70 border border-slate-200/60 rounded-2xl p-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      📄 Relatório {selectedAla !== "Todos" ? `• Ala ${selectedAla}` : "• Geral"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const report = generateReport()
                        navigator.clipboard.writeText(report)
                        toast.success("Relatório copiado para a área de transferência!")
                      }}
                      className="px-3 py-1 text-[10px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    >
                      Copiar Relatório
                    </button>
                  </div>
                  <textarea
                    readOnly
                    className="flex-1 w-full min-h-[280px] bg-white border border-slate-200/80 rounded-xl p-3 text-[11px] font-mono text-slate-700 outline-none resize-none leading-relaxed"
                    value={generateReport()}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tabela — largura total */}
          <VisitasTable
            displayRows={displayRows}
            totalCount={viewMode === "visitas" ? data.length : uniqueInternos}
            viewMode={viewMode}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            filteredCount={allDisplayRows.length}
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

      {/* Container de Impressão Oficial Completo (Ctrl + P) */}
      {data.length > 0 && (
        <div className="hidden print:block text-black bg-white w-full">
          <style dangerouslySetInnerHTML={{ __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 8mm 10mm 10mm 10mm;
              }
              body {
                background: #ffffff !important;
                color: #000000 !important;
              }
              [data-sonner-toaster], [data-sonner-toast], section[aria-label*="Notification" i], section[aria-label*="Notificação" i], [role="alert"], [role="status"] {
                display: none !important;
              }
              .print-visitas-table {
                width: 100% !important;
                border-collapse: collapse !important;
                border: 1px solid #000000 !important;
                font-size: 9.5px !important;
              }
              .print-visitas-table thead {
                display: table-header-group !important;
              }
              .print-visitas-table tr {
                page-break-inside: avoid !important;
              }
              .print-visitas-table th, .print-visitas-table td {
                border: 1px solid #475569 !important;
                padding: 4px 6px !important;
                vertical-align: middle !important;
              }
              .print-visitas-table th {
                background-color: #f1f5f9 !important;
                font-weight: 800 !important;
                text-transform: uppercase !important;
              }
            }
          ` }} />

          <div className="border-b-2 border-slate-900 pb-2 mb-3">
            <div className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wide">
              Secretaria da Administração Penitenciária • UPI-4
            </div>
            <div className="text-base font-black uppercase text-slate-950">
              {viewMode === "visitas" ? "Relatório Oficial de Visitas" : "Relação Oficial de Custodiados"}
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 font-semibold mt-1">
              <span>Emissão: {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              <span>Total de Registros: {allDisplayRows.length}</span>
              <span>Documento de Controle Interno</span>
            </div>
          </div>

          <table className="print-visitas-table">
            <thead>
              {viewMode === "visitas" ? (
                <tr>
                  <th style={{ width: "32px", textAlign: "center" }}>Nº</th>
                  <th style={{ width: "55px", textAlign: "center" }}>Senha</th>
                  <th>Visitante</th>
                  <th style={{ width: "90px", textAlign: "center" }}>Parentesco</th>
                  <th style={{ width: "80px", textAlign: "center" }}>Situação</th>
                  <th>Custodiado Vinculado / Prontuário</th>
                  <th style={{ width: "75px", textAlign: "center" }}>Ala / Cela</th>
                  <th style={{ width: "55px", textAlign: "center" }}>Prioritário</th>
                </tr>
              ) : (
                <tr>
                  <th style={{ width: "45px", textAlign: "center" }}>QTD</th>
                  <th style={{ width: "100px", textAlign: "center" }}>Prontuário</th>
                  <th>Nome do Interno</th>
                  <th style={{ width: "130px", textAlign: "center" }}>Ala / Cela</th>
                </tr>
              )}
            </thead>
            <tbody>
              {allDisplayRows.map((r, idx) => (
                <tr key={idx}>
                  {viewMode === "visitas" ? (
                    <>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>{idx + 1}</td>
                      <td style={{ textAlign: "center", fontWeight: "bold", fontFamily: "monospace" }}>{r.senhaDisplay}</td>
                      <td>
                        <div style={{ fontWeight: 700, textTransform: "uppercase" }}>{r.nomeVisitante || "—"}</div>
                      </td>
                      <td style={{ textAlign: "center", fontSize: "9.5px" }}>{r.relacao || "—"}</td>
                      <td style={{ textAlign: "center", fontSize: "9px", fontWeight: 600 }}>{r.situacao || "—"}</td>
                      <td>
                        <div style={{ fontWeight: "bold", textTransform: "uppercase" }}>{r.custodiado}</div>
                        {r.prontuario > 0 && <div style={{ fontSize: "8.5px", color: "#475569", fontFamily: "monospace" }}>Pront: #{r.prontuario}</div>}
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>{r.cela || r.ala}</td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>
                        {r.prioridade === "sim" ? "SIM" : "NÃO"}
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>{idx + 1}</td>
                      <td style={{ textAlign: "center", fontFamily: "monospace", fontWeight: "bold", fontSize: "11px" }}>
                        {r.prontuario > 0 ? r.prontuario : "—"}
                      </td>
                      <td style={{ fontWeight: "bold", textTransform: "uppercase" }}>{r.custodiado}</td>
                      <td style={{ textAlign: "center", fontWeight: "bold" }}>{r.cela || r.ala}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-8 flex justify-between pt-4 page-break-inside-avoid">
            <div className="w-[45%] border-t border-slate-900 text-center text-[9px] pt-1 font-semibold text-slate-800">
              Responsável pela Emissão / Conferência
            </div>
            <div className="w-[45%] border-t border-slate-900 text-center text-[9px] pt-1 font-semibold text-slate-800">
              Chefe de Equipe / Plantão Operacional
            </div>
          </div>
        </div>
      )}
    </>
  )
}


"use client"

import { useState, useEffect, useRef } from "react"
import { Download, AlertCircle, RefreshCw, Search, FileText } from "lucide-react"
import { toast } from "sonner"

import { UploadArea } from "@/components/sistema/UploadArea"
import { VisitasSidebar } from "@/components/sistema/VisitasSidebar"
import { VisitasTable } from "@/components/sistema/VisitasTable"
import { ExtractedVisitor, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"
import { getVisitasAction, clearVisitasAction } from "@/app/actions/visitas"

import { handleExportExcel, handleGeneratePDF } from "@/components/sistema/utils/export-visitas"
import { useVisitasFileProcessor } from "@/components/sistema/hooks/useVisitasFileProcessor"
import { useVisitasFiltros } from "@/components/sistema/hooks/useVisitasFiltros"

export default function VisitasPage() {
  const [data, setData] = useState<ExtractedVisitor[]>([])
  const [totalVisits, setTotalVisits] = useState<number>(0)
  const [isLoadingVisits, setIsLoadingVisits] = useState(true)
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
      .finally(() => setIsLoadingVisits(false))
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
      const w = window as any
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
    const wings = Array.from(new Set(data.map(d => d.ala.toUpperCase()))).sort()
    let reportText = "RELATÓRIO DE CONTROLE DE VISITAS - UPI-4\n"
    reportText += "========================================\n\n"

    let totalGeralVisitantes = 0
    const totalGeralInternosSet = new Set<number>()

    wings.forEach(wingName => {
      const wingData = data.filter(d => d.ala.toUpperCase() === wingName)
      const comPrioridade = wingData.filter(d => d.prioridade === "sim").length
      const semPrioridade = wingData.filter(d => d.prioridade === "não").length
      const totalVisitantes = wingData.length
      const internos = new Set(wingData.map(d => d.prontuario))

      totalGeralVisitantes += totalVisitantes
      wingData.forEach(d => totalGeralInternosSet.add(d.prontuario))

      reportText += `${wingName}:\n`
      reportText += `  - COM PRIORIDADE: ${comPrioridade}\n`
      reportText += `  - SEM PRIORIDADE: ${semPrioridade}\n`
      reportText += `  - QUANTIDADE DE INTERNOS: ${internos.size}\n`
      reportText += `  - TOTAL DE VISITANTES: ${totalVisitantes}\n`
      reportText += `  - SÍNTESE: ${wingName}: COM PRIORIDADE: ${comPrioridade}, SEM PRIORIDADE: ${semPrioridade}, TOTAL: ${totalVisitantes}\n\n`
    })

    reportText += "========================================\n"
    reportText += `TOTAL GERAL DE VISITANTES: ${totalGeralVisitantes}\n`
    reportText += `TOTAL GERAL DE INTERNOS VISITADOS: ${totalGeralInternosSet.size}\n`
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
                onClick={() => handleExportExcel(displayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-purple-700 hover:bg-slate-100 rounded-xl shadow-sm transition"
              >
                <Download size={14} /> Exportar Planilha
              </button>
              <button
                onClick={() => handleGeneratePDF(displayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-900/60 hover:bg-purple-900/80 text-white rounded-xl border border-purple-400/40 shadow-sm transition"
              >
                <FileText size={14} /> Gerar PDF
              </button>
              <button
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
                  } catch (error) {
                    toast.dismiss(loadId)
                    toast.error("Erro de conexão ao limpar visitas.")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-purple-800/60 hover:bg-purple-800/80 text-white rounded-xl border border-purple-400/30 shadow-sm transition cursor-pointer"
              >
                <RefreshCw size={14} /> Importar Outro
              </button>
            </>
          )}
        </div>
      </div>

      {/* Upload ou Conteúdo */}
      {data.length === 0 ? (
        <UploadArea onFileChange={(e) => handleFileChange(e, fileInputRef)} fileInputRef={fileInputRef} />
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

          {/* Estatísticas e Relatório por Ala (Card Colapsável) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <button
              type="button"
              onClick={() => setShowStats(!showStats)}
              className="w-full flex items-center justify-between font-extrabold text-slate-800 text-sm focus:outline-none select-none cursor-pointer"
            >
              <span className="flex items-center gap-2">
                📊 Estatísticas e Relatório por Ala {showStats ? "(Clique para recolher)" : "(Clique para expandir)"}
              </span>
              <span className="text-lg transition-transform duration-200">
                {showStats ? "▲" : "▼"}
              </span>
            </button>

            {showStats && (
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Painel visual de estatísticas */}
                <div className="lg:col-span-2">
                  <VisitasSidebar data={data} totalVisits={totalVisits} />
                </div>

                {/* Relatório de controle textual */}
                <div className="space-y-3 bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      📄 Relatório de Controle
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const report = generateReport()
                        navigator.clipboard.writeText(report)
                        toast.success("Relatório copiado para a área de transferência!")
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer flex items-center gap-1"
                    >
                      Copiar Relatório
                    </button>
                  </div>
                  <textarea
                    readOnly
                    className="flex-1 w-full min-h-[300px] bg-slate-100/50 border border-slate-200 rounded-lg p-2.5 text-[10.5px] font-mono text-slate-750 outline-none"
                    value={generateReport()}
                  />
                </div>
              </div>
            )}
          </div>

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
  )
}

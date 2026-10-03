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
      <div className="space-y-4 print:hidden">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-2xl font-black tracking-widest uppercase">Sistema de Visitas</h1>
          </div>
          <p className="text-white/80 text-xs font-sans font-medium">
            Importe o relatório de visitas (.xlsx ou .pdf) para consultar, filtrar e exportar os dados completos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 font-sans">
          {data.length > 0 && (
            <>
              <button
                onClick={() => handleExportExcel(allDisplayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-emerald-800 hover:bg-slate-100 rounded-xl shadow-sm transition cursor-pointer"
                title="Exportar todos os registros filtrados para Excel"
              >
                <Download size={14} /> Exportar Planilha ({allDisplayRows.length})
              </button>
              <button
                onClick={() => handleGeneratePDF(allDisplayRows, viewMode)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-950/80 text-white rounded-xl border border-emerald-400/40 shadow-sm transition cursor-pointer"
                title="Imprimir ou gerar PDF de todos os registros filtrados (todas as páginas)"
              >
                <Printer size={14} /> Imprimir / PDF ({allDisplayRows.length})
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
                  } catch {
                    toast.dismiss(loadId)
                    toast.error("Erro de conexão ao limpar visitas.")
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-900/60 hover:bg-emerald-900/80 text-white rounded-xl border border-emerald-400/30 shadow-sm transition cursor-pointer"
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
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700"
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
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700"
                />
              </div>
            </div>

            {/* Filtro Ala */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ala</label>
              <select
                value={selectedAla}
                onChange={(e) => { setSelectedAla(e.target.value); setSelectedCela("Todas") }}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
                  className={`flex-1 rounded-lg px-2 py-1.5 text-center transition border shadow-sm outline-none cursor-pointer duration-200 select-none ${viewMode === "visitas"
                      ? "bg-emerald-600 border-emerald-700 text-slate-950 shadow-md ring-2 ring-emerald-300 scale-[1.03]"
                      : "bg-emerald-50 border-emerald-100 text-emerald-800 hover:bg-emerald-100/50 opacity-60 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                >
                  <span className={`block text-[9px] font-bold uppercase ${viewMode === "visitas" ? "text-emerald-800" : "text-emerald-600"}`}>Visitas</span>
                  <span className="block text-sm font-black">{totalVisits}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("internos")}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-center transition border shadow-sm outline-none cursor-pointer duration-200 select-none ${viewMode === "internos"
                      ? "bg-teal-600 border-teal-700 text-slate-950 shadow-md ring-2 ring-teal-300 scale-[1.03]"
                      : "bg-teal-50 border-teal-100 text-teal-800 hover:bg-teal-100/50 opacity-60 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                >
                  <span className={`block text-[9px] font-bold uppercase ${viewMode === "internos" ? "text-teal-800" : "text-teal-600"}`}>Internos</span>
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
                      📄 Relatório de Controle {selectedAla !== "Todos" ? `• Ala ${selectedAla}` : "• Geral"}
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


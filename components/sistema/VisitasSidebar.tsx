import { RefreshCw } from "lucide-react"
import { ExtractedVisitor, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"

interface VisitasSidebarProps {
  data: ExtractedVisitor[]
  sortOption: "senha" | "custodiado" | "localizacao"
  onSortOptionChange: (val: "senha" | "custodiado" | "localizacao") => void
  selectedAla: string
  onSelectedAlaChange: (val: string) => void
  onReset: () => void
}

export function VisitasSidebar({
  data,
  sortOption,
  onSortOptionChange,
  selectedAla,
  onSelectedAlaChange,
  onReset,
}: VisitasSidebarProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Filtros e Controles</h3>

      {/* Reset database data trigger */}
      <button
        onClick={onReset}
        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
      >
        <RefreshCw size={14} /> Importar Outro Arquivo
      </button>

      {/* Sort selector */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Ordenar por
        </label>
        <select
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value as "senha" | "custodiado" | "localizacao")}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
        >
          <option value="senha">Senha</option>
          <option value="custodiado">Nome do Custodiado</option>
          <option value="localizacao">Localização</option>
        </select>
      </div>

      {/* Filter by Ala */}
      <div className="space-y-1.5">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Filtrar por Ala
        </label>
        <select
          value={selectedAla}
          onChange={(e) => onSelectedAlaChange(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
        >
          <option value="Todos">Todos</option>
          {ALAS_VALIDAS_UPI4.map((ala) => (
            <option key={ala} value={ala}>
              {ala}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Card */}
      <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-4 space-y-3">
        <h4 className="text-[11px] font-bold text-purple-700 uppercase tracking-wide">
          Estatísticas Extraídas
        </h4>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white p-2.5 rounded-lg border border-purple-100/50">
            <span className="block text-lg font-black text-purple-900 font-mono">
              {data.length}
            </span>
            <span className="text-[9px] font-medium text-slate-500">Total Visitas</span>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-purple-100/50">
            <span className="block text-lg font-black text-purple-900 font-mono">
              {data.filter((d) => d.localizacao.includes("Enfermaria")).length}
            </span>
            <span className="text-[9px] font-medium text-slate-500">Enfermaria</span>
          </div>
        </div>
      </div>
    </div>
  )
}

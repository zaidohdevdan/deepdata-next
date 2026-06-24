import { User, UserCheck } from "lucide-react"
import { ExtractedVisitor, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"

// Cor distinta por Ala
const ALA_COLOR_MAP: Record<string, string> = {
  A: "#7c3aed",
  B: "#ec4899",
  C: "#f59e0b",
  D: "#14b8a6",
  E: "#84cc16",
  F: "#06b6d4",
  "SEGURANÇA A": "#f97316",
  "SEGURANÇA B": "#ef4444",
}

interface VisitasSidebarProps {
  data: ExtractedVisitor[]      // todos os dados (não filtrados, para stats gerais)
  totalVisits: number           // contagem real de linhas do arquivo
}

export function VisitasSidebar({ data, totalVisits }: VisitasSidebarProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        Estatísticas por Ala
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Visitas por Ala */}
        <div className="bg-purple-50/40 border border-purple-200 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <User size={12} className="text-purple-600" />
            <h5 className="text-[10px] font-bold text-purple-800 uppercase tracking-wide">Visitas por Ala</h5>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {ALAS_VALIDAS_UPI4.map((ala) => {
              const count = data.filter(
                (d) => d.ala && d.ala.toUpperCase() === ala.toUpperCase()
              ).length
              const color = ALA_COLOR_MAP[ala] || "#7c3aed"
              return (
                <div 
                  key={ala} 
                  className="bg-white rounded-lg border border-slate-100 p-1.5 text-center border-b-2 shadow-sm transition hover:shadow"
                  style={{ borderBottomColor: color }}
                >
                  <span className="block text-[9px] font-bold text-slate-500 truncate mb-0.5">
                    {ala.replace("SEGURANÇA", "SEG")}
                  </span>
                  <span className="block text-sm font-black" style={{ color }}>{count}</span>
                </div>
              )
            })}
            <div className="bg-white rounded-lg border border-purple-200 border-b-2 border-b-purple-500 p-1.5 text-center shadow-sm">
              <span className="block text-[9px] font-bold text-slate-500 mb-0.5">Total</span>
              <span className="block text-sm font-black text-purple-700">{totalVisits}</span>
            </div>
          </div>
        </div>

        {/* Internos únicos por Ala */}
        <div className="bg-indigo-50/40 border border-indigo-200 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <UserCheck size={12} className="text-indigo-600" />
            <h5 className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide">Internos por Ala</h5>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {ALAS_VALIDAS_UPI4.map((ala) => {
              const uniqueInternos = new Set(
                data
                  .filter((d) => d.ala && d.ala.toUpperCase() === ala.toUpperCase() && d.prontuario > 0)
                  .map((d) => d.prontuario)
              ).size
              const color = ALA_COLOR_MAP[ala] || "#6366f1"
              return (
                <div 
                  key={ala} 
                  className="bg-white rounded-lg border border-slate-100 p-1.5 text-center border-b-2 shadow-sm transition hover:shadow"
                  style={{ borderBottomColor: color }}
                >
                  <span className="block text-[9px] font-bold text-slate-500 truncate mb-0.5">
                    {ala.replace("SEGURANÇA", "SEG")}
                  </span>
                  <span className="block text-sm font-black" style={{ color }}>{uniqueInternos}</span>
                </div>
              )
            })}
            <div className="bg-white rounded-lg border border-indigo-200 border-b-2 border-b-indigo-500 p-1.5 text-center shadow-sm">
              <span className="block text-[9px] font-bold text-slate-500 mb-0.5">Total</span>
              <span className="block text-sm font-black text-indigo-700">
                {new Set(data.filter(d => d.prontuario > 0).map((d) => d.prontuario)).size}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

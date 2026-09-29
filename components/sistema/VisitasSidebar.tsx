import { User, UserCheck, Users } from "lucide-react"
import { ExtractedVisitor, ALAS_VALIDAS_UPI4 } from "@/lib/pdf-parser"
import { detectVisitorGender } from "@/lib/gender-detector"

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
  let totalHomens = 0
  let totalMulheres = 0
  data.forEach((d) => {
    if (detectVisitorGender(d.relacao, d.nomeVisitante) === "M") {
      totalHomens++
    } else {
      totalMulheres++
    }
  })
  const pctMulheres = data.length > 0 ? Math.round((totalMulheres / data.length) * 100) : 0
  const pctHomens = data.length > 0 ? Math.round((totalHomens / data.length) * 100) : 0

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Estatísticas por Ala
        </h3>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200 shadow-xs">
            👩 Mulheres: {totalMulheres} ({pctMulheres}%)
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-xs">
            👨 Homens: {totalHomens} ({pctHomens}%)
          </span>
        </div>
      </div>

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

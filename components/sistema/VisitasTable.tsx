import { UserCheck } from "lucide-react"

interface VisitasTableProps {
  displayRows: {
    senhaDisplay: string
    custodiado: string
    prontuario: number
    cela: string
    ala: string
    nomeVisitante: string
    cpfVisitante: string
    relacao: string
    prioridade: string
    situacao: string
  }[]
  totalCount: number
  viewMode: "visitas" | "internos"
}

const PRIORIDADE_BADGE = (p: string) =>
  p === "sim"
    ? "bg-rose-100 text-rose-700 border border-rose-200"
    : "bg-slate-100 text-slate-500 border border-slate-200"

const SITUACAO_BADGE = (s: string) => {
  if (/cancelad/i.test(s)) return "bg-red-100 text-red-700 border border-red-200"
  if (/agendad/i.test(s)) return "bg-emerald-100 text-emerald-700 border border-emerald-200"
  return "bg-slate-100 text-slate-500 border border-slate-200"
}

export function VisitasTable({ displayRows, totalCount, viewMode }: VisitasTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <h3 className="text-sm font-bold text-slate-800">
          {viewMode === "visitas" ? "Registro de Visitas" : "Lista de Internos"}
        </h3>
        <div className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1">
          <UserCheck size={12} className="text-slate-400" />
          <span>Exibindo {displayRows.length} de {totalCount}</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px] lg:min-w-[950px]">
          <thead>
            {viewMode === "visitas" ? (
              <tr className="border-b border-slate-200 text-slate-500 font-bold text-[10px] bg-slate-50/60 uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">Nº</th>
                <th className="py-3 px-3 w-24">Senha</th>
                <th className="py-3 px-3">Visitante</th>
                <th className="py-3 px-3 w-36">CPF</th>
                <th className="py-3 px-3 w-28">Relação</th>
                <th className="py-3 px-3 w-28 text-center">Situação</th>
                <th className="py-3 px-3">Interno</th>
                <th className="py-3 px-3 w-28">Ala / Cela</th>
                <th className="py-3 px-3 w-20 text-center">Prior.</th>
              </tr>
            ) : (
              <tr className="border-b border-slate-200 text-slate-500 font-bold text-[10px] bg-slate-50/60 uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">Nº</th>
                <th className="py-3 px-3 w-28">Prontuário</th>
                <th className="py-3 px-3">Interno</th>
                <th className="py-3 px-3 w-48">Ala / Cela</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
            {displayRows.length === 0 ? (
              <tr>
                <td colSpan={viewMode === "visitas" ? 9 : 4} className="py-10 text-center text-slate-400 text-sm">
                  Nenhum registro encontrado com os filtros informados.
                </td>
              </tr>
            ) : (
              displayRows.map((item, idx) => (
                <tr key={idx} className="hover:bg-purple-50/30 transition">
                  {viewMode === "visitas" ? (
                    <>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 font-mono text-[10px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-black text-slate-900 text-sm truncate max-w-[120px]" title={item.senhaDisplay}>
                        {item.senhaDisplay}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 max-w-[200px] truncate" title={item.nomeVisitante}>
                        {item.nomeVisitante || "—"}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[10px] max-w-[150px] truncate" title={item.cpfVisitante}>
                        {item.cpfVisitante || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[120px] truncate" title={item.relacao}>
                        {item.relacao || "—"}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${SITUACAO_BADGE(item.situacao)}`} title={item.situacao}>
                          {item.situacao}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-800 leading-tight">{item.custodiado}</div>
                        {item.prontuario > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono">#{item.prontuario}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.cela || item.ala}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${PRIORIDADE_BADGE(item.prioridade)}`}>
                          {item.prioridade === "sim" ? "SIM" : "NÃO"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-400 font-mono text-[10px]">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600 text-xs">
                        {item.prontuario > 0 ? item.prontuario : "—"}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.custodiado}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="inline-block bg-purple-50 border border-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {item.cela || item.ala}
                        </span>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

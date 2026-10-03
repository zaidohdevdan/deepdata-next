import { ChevronLeft, ChevronRight, Users, CheckCircle2 } from "lucide-react"

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
  currentPage: number
  setCurrentPage: (p: number) => void
  totalPages: number
  filteredCount: number
}

const PRIORIDADE_BADGE = (p: string) =>
  p === "sim"
    ? "bg-rose-50 text-rose-700 border border-rose-200/80"
    : "bg-slate-50 text-slate-500 border border-slate-200/60"

const SITUACAO_BADGE = (s: string) => {
  if (/cancelad/i.test(s)) return "bg-rose-50 text-rose-700 border border-rose-200/80"
  if (/agendad/i.test(s)) return "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
  return "bg-slate-50 text-slate-600 border border-slate-200/60"
}

export function VisitasTable({
  displayRows,
  totalCount,
  viewMode,
  currentPage,
  setCurrentPage,
  totalPages,
  filteredCount,
}: VisitasTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] overflow-hidden flex flex-col">
      {/* Table Header estilo Enterprise Hero */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
              {viewMode === "visitas" ? "Listagem de Visitantes Cadastrados" : "Listagem de Internos com Visita"}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Exibindo {displayRows.length} de {filteredCount} registros filtrados (Total: {totalCount})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <CheckCircle2 size={12} className="text-blue-600" />
            <span>{filteredCount} no filtro atual</span>
          </span>
        </div>
      </div>

      {/* Tabela com estilo Enterprise Hero */}
      <div className="overflow-x-auto p-2 sm:p-3">
        <table className="w-full text-left border-collapse min-w-[650px] lg:min-w-[950px]">
          <thead>
            {viewMode === "visitas" ? (
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-12 text-center">#</th>
                <th className="py-3 px-3 w-28">Senha</th>
                <th className="py-3 px-3">Visitante</th>
                <th className="py-3 px-3 w-36">CPF</th>
                <th className="py-3 px-3 w-28">Relação</th>
                <th className="py-3 px-3 w-28 text-center">Situação</th>
                <th className="py-3 px-3">Interno</th>
                <th className="py-3 px-3 w-28 text-center">Ala / Cela</th>
                <th className="py-3 px-3 w-20 text-center">Prior.</th>
              </tr>
            ) : (
              <tr className="border-b border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-16 text-center">#</th>
                <th className="py-3 px-3 w-32">Prontuário</th>
                <th className="py-3 px-3">Nome do Interno</th>
                <th className="py-3 px-3 w-40 text-center">Ala / Cela</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
            {displayRows.length === 0 ? (
              <tr>
                <td
                  colSpan={viewMode === "visitas" ? 9 : 4}
                  className="py-12 text-center text-slate-400 font-medium text-sm"
                >
                  Nenhum registro encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              displayRows.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-blue-50/40 transition-colors group"
                >
                  {viewMode === "visitas" ? (
                    <>
                      {/* Índice */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-200/80">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Senha */}
                      <td className="py-3 px-3">
                        <span
                          className="font-mono font-black text-slate-800 text-xs bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60 inline-block"
                          title={item.senhaDisplay}
                        >
                          {item.senhaDisplay}
                        </span>
                      </td>

                      {/* Nome Visitante */}
                      <td
                        className="py-3 px-3 font-semibold text-slate-800 max-w-[200px] truncate"
                        title={item.nomeVisitante}
                      >
                        {item.nomeVisitante || "—"}
                      </td>

                      {/* CPF */}
                      <td
                        className="py-3 px-3 font-mono text-slate-500 text-[11px] max-w-[150px] truncate"
                        title={item.cpfVisitante}
                      >
                        {item.cpfVisitante || "—"}
                      </td>

                      {/* Relação */}
                      <td
                        className="py-3 px-3 text-slate-600 font-medium max-w-[120px] truncate"
                        title={item.relacao}
                      >
                        {item.relacao || "—"}
                      </td>

                      {/* Situação */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${SITUACAO_BADGE(
                            item.situacao
                          )}`}
                          title={item.situacao}
                        >
                          {item.situacao}
                        </span>
                      </td>

                      {/* Interno & Prontuário */}
                      <td className="py-3 px-3">
                        <div className="font-extrabold text-slate-800 leading-tight">
                          {item.custodiado}
                        </div>
                        {item.prontuario > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            #{item.prontuario}
                          </div>
                        )}
                      </td>

                      {/* Ala / Cela */}
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-blue-50 border border-blue-200/70 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                          {item.cela || item.ala}
                        </span>
                      </td>

                      {/* Prioridade */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${PRIORIDADE_BADGE(
                            item.prioridade
                          )}`}
                        >
                          {item.prioridade === "sim" ? "PRIORITÁRIA" : "NORMAL"}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg font-mono text-[10px] font-black bg-slate-50 text-slate-600 border border-slate-200/80">
                          {idx + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700 text-xs">
                        {item.prontuario > 0 ? `#${item.prontuario}` : "—"}
                      </td>
                      <td className="py-3 px-3 font-extrabold text-slate-800">
                        {item.custodiado}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="inline-block bg-blue-50 border border-blue-200/70 text-blue-700 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
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

      {/* Paginação estilo Enterprise Hero */}
      {totalPages > 1 && (
        <div className="p-4 sm:p-5 border-t border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="text-xs text-slate-500 font-medium">
            Página <span className="font-extrabold text-slate-800">{currentPage}</span> de{" "}
            <span className="font-extrabold text-slate-800">{totalPages}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer text-slate-600 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <ChevronLeft size={14} />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-full border border-slate-200/80 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer text-slate-600 text-xs font-bold flex items-center gap-1 shadow-2xs"
            >
              <span>Próxima</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

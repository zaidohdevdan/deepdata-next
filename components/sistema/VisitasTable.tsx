import { Search, UserCheck } from "lucide-react"
import { ExtractedVisitor } from "@/lib/pdf-parser"

interface VisitasTableProps {
  sortedAndFiltered: ExtractedVisitor[]
  totalCount: number
  search: string
  onSearchChange: (val: string) => void
}

export function VisitasTable({
  sortedAndFiltered,
  totalCount,
  search,
  onSearchChange,
}: VisitasTableProps) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Search Input header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar custodiado ou localização..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700"
          />
        </div>

        <div className="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 flex items-center gap-1">
          <UserCheck size={12} className="text-slate-400" />
          <span>Exibindo {sortedAndFiltered.length} de {totalCount}</span>
        </div>
      </div>

      {/* Visitors Table Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs bg-slate-50/40 uppercase tracking-wider">
              <th className="py-3 px-4 w-20">Senha</th>
              <th className="py-3 px-4">Nome do Custodiado</th>
              <th className="py-3 px-4">Localização (Bloco-Ala-Cela)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {sortedAndFiltered.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-400">
                  Nenhum visitante encontrado com os termos de busca informados.
                </td>
              </tr>
            ) : (
              sortedAndFiltered.map((item) => (
                <tr key={item.custodiado} className="hover:bg-slate-50/50 transition">
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                    {item.senha}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-800">
                    {item.custodiado}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-500">
                    {item.localizacao}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { Plus, Trash2, Loader2, Save } from "lucide-react"
import { AlaDistribData } from "@/app/actions/distribuicao"
import { DistribuicaoConfig, ConfigValues } from "@/lib/calculation"

interface DistribuicaoTableProps {
  data: AlaDistribData[]
  config: DistribuicaoConfig
  globalConfig: ConfigValues
  isPending: boolean
  onCellChange: (id: string, field: "internos" | "dietas", value: string) => void
  onDeleteAla: (id: string, name: string) => void
  onAddAlaClick: () => void
  onResetLocal: () => void
  onSave: () => void
}

export function DistribuicaoTable({
  data,
  config,
  globalConfig,
  isPending,
  onCellChange,
  onDeleteAla,
  onAddAlaClick,
  onResetLocal,
  onSave,
}: DistribuicaoTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col print:border-none print:shadow-none">
      <div className="p-4 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between print:hidden">
        <span className="text-sm font-semibold text-slate-700">Tabela de Ala / Galpão</span>
        <button
          onClick={onAddAlaClick}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
        >
          <Plus size={14} /> Nova Ala
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px] print:min-w-0">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs bg-slate-50/40 uppercase tracking-wider">
              <th className="py-3.5 px-4 w-1/3">Ala</th>
              {config.colunas.slice(1).map((col) => (
                <th key={col.key} className="py-3.5 px-4">
                  {col.header}
                </th>
              ))}
              <th className="py-3.5 px-4 text-right print:hidden w-16">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {data.length === 0 ? (
              <tr>
                <td colSpan={config.colunas.length + 1} className="py-8 text-center text-slate-400">
                  Nenhuma ala cadastrada no sistema. Adicione uma para começar.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const computed = config.calcularAla(
                  { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
                  globalConfig
                )

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-4 font-medium text-slate-900">{item.nome}</td>
                    
                    {/* Qtd Internos Column */}
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min="0"
                        value={item.internos || ""}
                        placeholder="0"
                        onChange={(e) => onCellChange(item.id, "internos", e.target.value)}
                        className="w-24 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-md transition outline-none text-sm font-semibold print:border-none print:bg-transparent print:p-0 print:w-auto"
                      />
                    </td>

                    {/* Computed Columns & Dietas depending on Modulo config */}
                    {config.modulo === "ALIMENTACAO" && (
                      <>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600 bg-slate-50/30">
                          {computed.caixas} cx
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600">
                          {computed.normal} un
                        </td>
                        <td className="py-2.5 px-4">
                          <input
                            type="number"
                            min="0"
                            max={item.internos}
                            value={item.dietas || ""}
                            placeholder="0"
                            onChange={(e) => onCellChange(item.id, "dietas", e.target.value)}
                            className="w-24 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-md transition outline-none text-sm font-semibold print:border-none print:bg-transparent print:p-0 print:w-auto text-orange-700"
                          />
                        </td>
                      </>
                    )}

                    {config.modulo === "CAFE" && (
                      <>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600 bg-slate-50/30">
                          {computed.pacotes} cx
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600">
                          {computed.unidades} un
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-amber-800 bg-amber-50/10">
                          {computed.garrafas} gf
                        </td>
                      </>
                    )}

                    {config.modulo === "BISCOITO" && (
                      <>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600 bg-slate-50/30">
                          {computed.pacotes} cx
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-slate-600">
                          {computed.unidades} un
                        </td>
                        <td className="py-2.5 px-4 font-mono font-medium text-amber-800 bg-amber-50/10">
                          {computed.garrafas} gf
                        </td>
                      </>
                    )}

                    <td className="py-2.5 px-4 text-right print:hidden">
                      <button
                        onClick={() => onDeleteAla(item.id, item.nome)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 transition"
                        title="Remover Ala"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Save Actions Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex items-center justify-end gap-2 print:hidden">
        <button
          onClick={onResetLocal}
          className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
          disabled={isPending}
        >
          Descartar
        </button>
        <button
          onClick={onSave}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition disabled:opacity-55"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Salvar Distribuição
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Save, Info, Landmark, Utensils, Coffee, Cookie, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveGlobalConfigAction } from "@/app/actions/configuracoes"
import { ConfigValues } from "@/lib/calculation"

interface ConfigFormProps {
  initialConfig: ConfigValues
}

export function ConfigForm({ initialConfig }: ConfigFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form State
  const [nomeUnidade, setNomeUnidade] = useState(initialConfig.nomeUnidade)
  const [localidade, setLocalidade] = useState(initialConfig.localidade)
  const [alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade] = useState(initialConfig.alimentacaoCaixaCapacidade)
  const [cafeCapacitePacote, setCafeCapacitePacote] = useState(initialConfig.cafeCapacitePacote)
  const [cafePaoesPorInterno, setCafePaoesPorInterno] = useState(initialConfig.cafePaoesPorInterno)
  const [cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa] = useState(initialConfig.cafeLitrosPorGarrafa)
  const [biscoitoPorInterno, setBiscoitoPorInterno] = useState(initialConfig.biscoitoPorInterno)
  const [biscoitoCapacidadePacote, setBiscoitoCapacidadePacote] = useState(initialConfig.biscoitoCapacidadePacote)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await saveGlobalConfigAction({
        nomeUnidade,
        localidade,
        alimentacaoCaixaCapacidade,
        cafeCapacitePacote,
        cafePaoesPorInterno,
        cafeLitrosPorGarrafa,
        biscoitoPorInterno,
        biscoitoCapacidadePacote,
      })

      if (res.success) {
        toast.success("Configurações atualizadas com sucesso!", {
          description: "Os novos valores já estão ativos no sistema e tabelas.",
        })
        router.refresh()
      } else {
        toast.error("Erro ao salvar configurações", {
          description: res.error,
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. General Info & Locality */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Landmark size={18} className="text-violet-600" /> Identificação e Localidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Nome da Unidade Prisional
            </label>
            <input
              type="text"
              required
              value={nomeUnidade}
              onChange={(e) => setNomeUnidade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">EX: UPI-4, IPPOO II, etc. Exibido no cabeçalho das páginas e PDF.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Localidade / Cidade
            </label>
            <input
              type="text"
              required
              value={localidade}
              onChange={(e) => setLocalidade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Cidade onde se localiza o estabelecimento. Exibido no rodapé impresso.</p>
          </div>
        </div>
      </div>

      {/* 2. Food / Meal constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Utensils size={18} className="text-emerald-600" /> Parâmetros de Alimentação (Almoço/Jantar)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Quentinhas por Caixa
            </label>
            <input
              type="number"
              min="1"
              required
              value={alimentacaoCaixaCapacidade}
              onChange={(e) => setAlimentacaoCaixaCapacidade(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade padrão de quentinhas normais acondicionadas em cada caixa de transporte.</p>
          </div>
        </div>
      </div>

      {/* 3. Cafe constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Coffee size={18} className="text-amber-700" /> Parâmetros de Café da Manhã
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Pães por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafePaoesPorInterno}
              onChange={(e) => setCafePaoesPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Média de pães consumidos por cada interno custodiado.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Pães por Pacote
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeCapacitePacote}
              onChange={(e) => setCafeCapacitePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade de pães contida em cada pacote fardo entregue pela panificadora.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Capacidade Garrafa Térmica (Litros)
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeLitrosPorGarrafa}
              onChange={(e) => setCafeLitrosPorGarrafa(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Relação de internos por garrafa térmica de café de grande porte (40 Litros).</p>
          </div>
        </div>
      </div>

      {/* 4. Biscuit constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Cookie size={18} className="text-yellow-600" /> Parâmetros de Biscoitos (Lanche)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Biscoitos por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoPorInterno}
              onChange={(e) => setBiscoitoPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade de biscoitos unitários recomendada no cardápio diário por interno.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Biscoitos por Pacote
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoCapacidadePacote}
              onChange={(e) => setBiscoitoCapacidadePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Capacidade de biscoitos individuais em cada fardo ou embalagem do fabricante.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
        <Info size={16} className="text-slate-400 shrink-0" />
        <span>
          A alteração destes parâmetros causará recalculação instantânea em todas as colunas computadas dos respectivos painéis de distribuição (Alimentação, Café e Biscoitos) sem perda de dados históricos de internos.
        </span>
      </div>

      {/* Action Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Gravar Configurações
        </button>
      </div>
    </form>
  )
}

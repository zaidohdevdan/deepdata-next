import { Landmark, Utensils, Coffee, Cookie } from "lucide-react"

export function ConfigGeraisPanel({ configBasicas }: { configBasicas: any }) {
  const {
    nomeUnidade, setNomeUnidade,
    localidade, setLocalidade,
    alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade,
    cafeCapacitePacote, setCafeCapacitePacote,
    cafePaoesPorInterno, setCafePaoesPorInterno,
    cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa,
    biscoitoPorInterno, setBiscoitoPorInterno,
    biscoitoCapacidadePacote, setBiscoitoCapacidadePacote
  } = configBasicas

  return (
    <>
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
    </>
  )
}

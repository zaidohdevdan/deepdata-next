import { Landmark, Utensils, Coffee, Cookie } from "lucide-react"

interface ConfigBasicas {
  nomeUnidade: string
  setNomeUnidade: (v: string) => void
  localidade: string
  setLocalidade: (v: string) => void
  alimentacaoCaixaCapacidade: number
  setAlimentacaoCaixaCapacidade: (v: number) => void
  cafeCapacitePacote: number
  setCafeCapacitePacote: (v: number) => void
  cafePaoesPorInterno: number
  setCafePaoesPorInterno: (v: number) => void
  cafeLitrosPorGarrafa: number
  setCafeLitrosPorGarrafa: (v: number) => void
  biscoitoPorInterno: number
  setBiscoitoPorInterno: (v: number) => void
  biscoitoCapacidadePacote: number
  setBiscoitoCapacidadePacote: (v: number) => void
}

export function ConfigGeraisPanel({ configBasicas }: { configBasicas: ConfigBasicas }) {
  const {
    nomeUnidade, setNomeUnidade,
    localidade, setLocalidade,
    alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade,
    cafeCapacitePacote, setCafeCapacitePacote,
    cafePaoesPorInterno, setCafePaoesPorInterno,
    cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa,
    biscoitoPorInterno, setBiscoitoPorInterno,
    biscoitoCapacidadePacote, setBiscoitoCapacidadePacote,
  } = configBasicas

  return (
    <>
      {/* 1. Identificação e Localidade */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_-5px_rgba(20,50,110,0.05)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Landmark size={17} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              Identificação Institucional da Unidade
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Dados impressos nos cabeçalhos, rodapés e relatórios operacionais
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Nome da Unidade Prisional
            </label>
            <input
              type="text"
              required
              value={nomeUnidade}
              onChange={(e) => setNomeUnidade(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition"
            />
            <p className="text-[10px] text-slate-400 font-medium">Ex: UPI-4, IPPOO II. Utilizado no topo de tabelas e impressões.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Localidade / Município
            </label>
            <input
              type="text"
              required
              value={localidade}
              onChange={(e) => setLocalidade(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition"
            />
            <p className="text-[10px] text-slate-400 font-medium">Cidade onde se localiza o estabelecimento penal.</p>
          </div>
        </div>
      </div>

      {/* 2. Parâmetros de Alimentação */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_-5px_rgba(20,50,110,0.05)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Utensils size={17} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              Acondicionamento de Refeições (Almoço / Jantar)
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Regras para o cálculo automático de caixas térmicas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Quentinhas por Caixa Térmica
            </label>
            <input
              type="number"
              min="1"
              required
              value={alimentacaoCaixaCapacidade}
              onChange={(e) => setAlimentacaoCaixaCapacidade(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Capacidade padrão de quentinhas por caixa (padrão: 42).</p>
          </div>
        </div>
      </div>

      {/* 3. Parâmetros de Café da Manhã */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_-5px_rgba(20,50,110,0.05)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Coffee size={17} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              Parâmetros de Café da Manhã & Pães
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Cálculo de pacotes de pães e garrafas térmicas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Pães por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafePaoesPorInterno}
              onChange={(e) => setCafePaoesPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Média de pães por custodiado no desjejum.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Pães por Pacote / Fardo
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeCapacitePacote}
              onChange={(e) => setCafeCapacitePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Quantidade de pães contida em cada pacote fardo entregue.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Capacidade Garrafa Térmica (Litros)
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeLitrosPorGarrafa}
              onChange={(e) => setCafeLitrosPorGarrafa(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Capacidade volumétrica da garrafa térmica (padrão: 40 L).</p>
          </div>
        </div>
      </div>

      {/* 4. Parâmetros de Biscoitos */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_10px_35px_-5px_rgba(20,50,110,0.05)] space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Cookie size={17} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight">
              Parâmetros de Biscoitos e Ceia
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">
              Cálculo de pacotes de biscoito e lanches noturnos
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Biscoitos por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoPorInterno}
              onChange={(e) => setBiscoitoPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Quantidade unitária de biscoitos por interno.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Biscoitos por Pacote
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoCapacidadePacote}
              onChange={(e) => setBiscoitoCapacidadePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-200/90 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl outline-none font-semibold text-slate-800 text-xs bg-slate-50/50 focus:bg-white transition font-mono"
            />
            <p className="text-[10px] text-slate-400 font-medium">Capacidade por embalagem/fardo (padrão: 68).</p>
          </div>
        </div>
      </div>
    </>
  )
}

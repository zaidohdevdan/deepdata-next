import { Info, CheckCircle2 } from "lucide-react"
import { AlimentacaoConfig, ConfigValues } from "@/lib/calculation"

interface AlimentacaoSummaryProps {
  summaryMetrics: Record<string, string | number>
  config: AlimentacaoConfig
  globalConfig: ConfigValues
}

export function AlimentacaoSummary({ summaryMetrics, config, globalConfig }: AlimentacaoSummaryProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(20,50,110,0.06)] print:bg-white print:text-black print:border print:border-slate-300 print:shadow-none print:p-4 print:rounded-none">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <CheckCircle2 size={16} />
        </div>
        <div>
          <h3 className="text-sm font-extrabold tracking-tight text-slate-800 uppercase">
            Resumo Operacional
          </h3>
          <p className="text-[11px] text-slate-400 font-medium">Totais consolidados para entrega</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {Object.entries(summaryMetrics).map(([key, val]) => (
          <div
            key={key}
            className="flex justify-between items-center p-3 bg-slate-50/70 hover:bg-slate-50 rounded-2xl border border-slate-100/90 transition-all"
          >
            <span className="text-xs text-slate-600 font-semibold">{key}</span>
            <span className="text-base font-black tracking-tight text-blue-700 font-mono">
              {val}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 space-y-1.5 print:hidden">
        <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[11px] mb-1">
          <Info size={13} className="text-blue-600" />
          <span>Parâmetros de Cálculo da Unidade:</span>
        </div>
        {config.modulo === "ALIMENTACAO" && (
          <p className="text-[11px] text-slate-500">• Capacidade da Caixa: <strong className="text-slate-700">{globalConfig.alimentacaoCaixaCapacidade} quentinhas</strong></p>
        )}
        {config.modulo === "CAFE" && (
          <>
            <p className="text-[11px] text-slate-500">• Pães por interno: <strong className="text-slate-700">{globalConfig.cafePaoesPorInterno} un</strong></p>
            <p className="text-[11px] text-slate-500">• Pães por pacote: <strong className="text-slate-700">{globalConfig.cafeCapacitePacote} un</strong></p>
            <p className="text-[11px] text-slate-500">• Garrafa térmica: <strong className="text-slate-700">{globalConfig.cafeLitrosPorGarrafa} Litros</strong></p>
          </>
        )}
        {config.modulo === "BISCOITO" && (
          <>
            <p className="text-[11px] text-slate-500">• Biscoitos por interno: <strong className="text-slate-700">{globalConfig.biscoitoPorInterno} un</strong></p>
            <p className="text-[11px] text-slate-500">• Unidades por pacote: <strong className="text-slate-700">{globalConfig.biscoitoCapacidadePacote} un</strong></p>
            <p className="text-[11px] text-slate-500">• Garrafa de suco: <strong className="text-slate-700">40 Litros</strong></p>
          </>
        )}
      </div>
    </div>
  )
}

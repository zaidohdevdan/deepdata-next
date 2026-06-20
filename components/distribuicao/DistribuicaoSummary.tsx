import { AlertCircle } from "lucide-react"
import { DistribuicaoConfig, ConfigValues } from "@/lib/calculation"

interface DistribuicaoSummaryProps {
  summaryMetrics: Record<string, string | number>
  config: DistribuicaoConfig
  globalConfig: ConfigValues
}

export function DistribuicaoSummary({ summaryMetrics, config, globalConfig }: DistribuicaoSummaryProps) {
  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl p-6 border border-slate-800 shadow-md print:bg-none print:text-black print:border-none print:shadow-none print:p-0">
      <h3 className="text-lg font-bold tracking-tight mb-4 border-b border-slate-800 pb-2 print:text-base">
        Resumo Geral da Entrega
      </h3>
      
      <div className="space-y-4">
        {Object.entries(summaryMetrics).map(([key, val]) => (
          <div key={key} className="flex justify-between items-center border-b border-slate-900 pb-3 last:border-0 last:pb-0">
            <span className="text-sm text-slate-400 font-medium print:text-slate-600">{key}</span>
            <span className="text-lg font-extrabold tracking-tight text-white font-mono print:text-black">
              {val}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-850 text-xs text-slate-500 space-y-1 print:hidden">
        <div className="flex items-center gap-1">
          <AlertCircle size={12} className="text-slate-400" />
          <span>Cálculos baseados nos parâmetros globais:</span>
        </div>
        {config.modulo === "ALIMENTACAO" && (
          <p>• Quentinhas por caixa: {globalConfig.alimentacaoCaixaCapacidade}</p>
        )}
        {config.modulo === "CAFE" && (
          <>
            <p>• Pães por interno: {globalConfig.cafePaoesPorInterno}</p>
            <p>• Pães por pacote: {globalConfig.cafeCapacitePacote}</p>
            <p>• Garrafa térmica: {globalConfig.cafeLitrosPorGarrafa} L</p>
          </>
        )}
        {config.modulo === "BISCOITO" && (
          <>
            <p>• Biscoitos por interno: {globalConfig.biscoitoPorInterno}</p>
            <p>• Unidades por pacote: {globalConfig.biscoitoCapacidadePacote}</p>
            <p>• Garrafa leite/suco: 40 L</p>
          </>
        )}
      </div>
    </div>
  )
}

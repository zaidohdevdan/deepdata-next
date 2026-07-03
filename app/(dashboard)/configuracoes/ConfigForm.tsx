"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Save, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveGlobalConfigAction } from "@/app/actions/configuracoes"
import { ConfigValues } from "@/lib/calculation"

import { useConfigEquipes } from "./hooks/useConfigEquipes"
import { useConfigPoliciaisFixos } from "./hooks/useConfigPoliciaisFixos"
import { ConfigGeraisPanel } from "./components/ConfigGeraisPanel"
import { ConfigEquipesPanel } from "./components/ConfigEquipesPanel"

interface ConfigFormProps {
  initialConfig: ConfigValues
  currentUserRole?: string
}

export function ConfigForm({ initialConfig, currentUserRole }: ConfigFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // General Basic Info
  const [nomeUnidade, setNomeUnidade] = useState(initialConfig.nomeUnidade)
  const [localidade, setLocalidade] = useState(initialConfig.localidade)
  const [alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade] = useState(initialConfig.alimentacaoCaixaCapacidade)
  const [cafeCapacitePacote, setCafeCapacitePacote] = useState(initialConfig.cafeCapacitePacote)
  const [cafePaoesPorInterno, setCafePaoesPorInterno] = useState(initialConfig.cafePaoesPorInterno)
  const [cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa] = useState(initialConfig.cafeLitrosPorGarrafa)
  const [biscoitoPorInterno, setBiscoitoPorInterno] = useState(initialConfig.biscoitoPorInterno)
  const [biscoitoCapacidadePacote, setBiscoitoCapacidadePacote] = useState(initialConfig.biscoitoCapacidadePacote)

  const configBasicas = {
    nomeUnidade, setNomeUnidade,
    localidade, setLocalidade,
    alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade,
    cafeCapacitePacote, setCafeCapacitePacote,
    cafePaoesPorInterno, setCafePaoesPorInterno,
    cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa,
    biscoitoPorInterno, setBiscoitoPorInterno,
    biscoitoCapacidadePacote, setBiscoitoCapacidadePacote
  }

  // Custom Hooks
  const { policiaisFixos } = useConfigPoliciaisFixos(initialConfig)
  const configEquipes = useConfigEquipes(initialConfig)

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
        escalaPoliciaisFixos: JSON.stringify(policiaisFixos),
        equipeAlfa: JSON.stringify(configEquipes.equipeAlfa),
        equipeBravo: JSON.stringify(configEquipes.equipeBravo),
        equipeEcho: JSON.stringify(configEquipes.equipeEcho),
        equipeFox: JSON.stringify(configEquipes.equipeFox),
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
      
      <ConfigGeraisPanel configBasicas={configBasicas} />

      {currentUserRole === "ADMIN" && (
        <ConfigEquipesPanel configEquipes={configEquipes} />
      )}

      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
        <Info size={16} className="text-slate-400 shrink-0" />
        <span>
          A alteração destes parâmetros causará recalculação instantânea em todas as colunas computadas dos respectivos painéis de distribuição (Alimentação, Café e Biscoitos) sem perda de dados históricos de internos.
        </span>
      </div>

      {/* Action Submit (Floating FAB) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-2xl hover:shadow-slate-900/30 transition-all duration-200 disabled:opacity-60 cursor-pointer font-bold text-sm border border-slate-700/50 hover:scale-105 active:scale-95"
        >
          {isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          Gravar Configurações
        </button>
      </div>
    </form>
  )
}

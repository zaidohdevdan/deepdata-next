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
import { ConfigBackupPanel } from "./components/ConfigBackupPanel"

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
        <>
          <ConfigEquipesPanel configEquipes={configEquipes} />
          <ConfigBackupPanel />
        </>
      )}

      <div className="flex items-center gap-3 text-xs text-blue-900 bg-blue-50/70 p-4 sm:p-5 rounded-2xl border border-blue-200/60 shadow-2xs">
        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Info size={16} />
        </div>
        <span className="font-medium leading-relaxed">
          A alteração destes parâmetros causará o recálculo instantâneo de todas as colunas das tabelas de distribuição (Alimentação, Café e Biscoitos) sem perda dos registros cadastrados.
        </span>
      </div>

      {/* Action Submit (Floating FAB) */}
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-full shadow-xl shadow-blue-600/30 hover:shadow-2xl transition-all duration-150 disabled:opacity-60 cursor-pointer font-extrabold text-xs"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          <span>Gravar Configurações</span>
        </button>
      </div>
    </form>
  )
}

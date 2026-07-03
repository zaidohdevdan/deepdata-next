import { AlimentacaoPage } from "@/components/alimentacao/AlimentacaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getAlimentacaoData } from "@/app/actions/alimentacao"

export const dynamic = "force-dynamic"

export default async function BiscoitoPage() {
  const [initialData, globalConfig] = await Promise.all([
    getAlimentacaoData("BISCOITO"),
    getConfigValues(),
  ])

  return (
    <AlimentacaoPage
      modulo="BISCOITO"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

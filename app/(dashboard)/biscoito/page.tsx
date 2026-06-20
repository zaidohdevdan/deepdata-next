import { DistribuicaoPage } from "@/components/distribuicao/DistribuicaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getDistribuicaoData } from "@/app/actions/distribuicao"

export const dynamic = "force-dynamic"

export default async function BiscoitoPage() {
  const [initialData, globalConfig] = await Promise.all([
    getDistribuicaoData("BISCOITO"),
    getConfigValues(),
  ])

  return (
    <DistribuicaoPage
      modulo="BISCOITO"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

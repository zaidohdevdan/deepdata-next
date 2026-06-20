import { DistribuicaoPage } from "@/components/distribuicao/DistribuicaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getDistribuicaoData } from "@/app/actions/distribuicao"

export const dynamic = "force-dynamic"

export default async function CafePage() {
  const [initialData, globalConfig] = await Promise.all([
    getDistribuicaoData("CAFE"),
    getConfigValues(),
  ])

  return (
    <DistribuicaoPage
      modulo="CAFE"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

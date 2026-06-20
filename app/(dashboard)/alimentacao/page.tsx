import { DistribuicaoPage } from "@/components/distribuicao/DistribuicaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getDistribuicaoData } from "@/app/actions/distribuicao"

// Next.js dynamic rendering
export const dynamic = "force-dynamic"

export default async function AlimentacaoPage() {
  const [initialData, globalConfig] = await Promise.all([
    getDistribuicaoData("ALIMENTACAO"),
    getConfigValues(),
  ])

  return (
    <DistribuicaoPage
      modulo="ALIMENTACAO"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

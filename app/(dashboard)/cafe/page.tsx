import { AlimentacaoPage } from "@/components/alimentacao/AlimentacaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getAlimentacaoData } from "@/app/actions/alimentacao"

export const dynamic = "force-dynamic"

export default async function CafePage() {
  const [initialData, globalConfig] = await Promise.all([
    getAlimentacaoData("CAFE"),
    getConfigValues(),
  ])

  return (
    <AlimentacaoPage
      modulo="CAFE"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

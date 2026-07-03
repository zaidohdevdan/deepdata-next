import { AlimentacaoPage } from "@/components/alimentacao/AlimentacaoPage"
import { getConfigValues } from "@/lib/calculation"
import { getAlimentacaoData } from "@/app/actions/alimentacao"

// Next.js dynamic rendering
export const dynamic = "force-dynamic"

export default async function AlimentacaoRoute() {
  const [initialData, globalConfig] = await Promise.all([
    getAlimentacaoData("ALIMENTACAO"),
    getConfigValues(),
  ])

  return (
    <AlimentacaoPage
      modulo="ALIMENTACAO"
      initialData={initialData}
      globalConfig={globalConfig}
    />
  )
}

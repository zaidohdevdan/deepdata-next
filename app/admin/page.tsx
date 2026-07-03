import { prisma } from "@/lib/prisma"
import { ChefeEquipe } from "@/app/actions/chefes"
import AdminWelcomeCard from "@/components/admin/AdminWelcomeCard"
import AdminMetricsRow from "@/components/admin/AdminMetricsRow"
import AdminMenuGrid from "@/components/admin/AdminMenuGrid"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [userCount, alaCount, chefesConfig] = await Promise.all([
    prisma.user.count(),
    prisma.ala.count({ where: { ativa: true } }),
    prisma.configuracaoGlobal.findUnique({ where: { chave: "chefesEquipe" } }),
  ])

  const chefesCount = chefesConfig ? (JSON.parse(chefesConfig.valor) as ChefeEquipe[]).length : 0

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminWelcomeCard />
      <AdminMetricsRow userCount={userCount} chefesCount={chefesCount} alaCount={alaCount} />
      <AdminMenuGrid />
    </div>
  )
}

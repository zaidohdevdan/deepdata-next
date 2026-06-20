import Link from "next/link"
import { 
  Utensils, Coffee, Cookie, ClipboardList, 
  Users, Calendar, ChevronRight, ShieldCheck, HelpCircle 
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getConfigValues } from "@/lib/calculation"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  const globalConfig = await getConfigValues()

  // Aggregate current totals for preview cards
  const [sumAlimentacao, sumCafe, sumBiscoito] = await Promise.all([
    prisma.distribAla.aggregate({
      where: { modulo: "ALIMENTACAO", ala: { ativa: true } },
      _sum: { internos: true, dietas: true },
    }),
    prisma.distribAla.aggregate({
      where: { modulo: "CAFE", ala: { ativa: true } },
      _sum: { internos: true },
    }),
    prisma.distribAla.aggregate({
      where: { modulo: "BISCOITO", ala: { ativa: true } },
      _sum: { internos: true },
    }),
  ])

  const modules = [
    {
      title: "Distribuição de Alimentação",
      description: "Controle de quentinhas (Normais e Dietas) por ala e cálculo de caixas.",
      icon: Utensils,
      href: "/alimentacao",
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-600",
      metric: `${sumAlimentacao._sum.internos ?? 0} internos (${sumAlimentacao._sum.dietas ?? 0} dietas)`,
    },
    {
      title: "Distribuição de Café",
      description: "Cálculo de pacotes de pães e garrafas térmicas de café por ala.",
      icon: Coffee,
      href: "/cafe",
      color: "from-amber-600 to-orange-700",
      textColor: "text-amber-700",
      metric: `${sumCafe._sum.internos ?? 0} internos`,
    },
    {
      title: "Distribuição de Biscoitos",
      description: "Cálculo de pacotes de biscoito e garrafas de leite/suco por ala.",
      icon: Cookie,
      href: "/biscoito",
      color: "from-yellow-500 to-amber-600",
      textColor: "text-yellow-700",
      metric: `${sumBiscoito._sum.internos ?? 0} internos`,
    },
    {
      title: "Livro de Ocorrências",
      description: "Registro de ocorrências diárias com cards copiáveis e formatados.",
      icon: ClipboardList,
      href: "/ocorrencias",
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600",
      metric: "Livro ativo",
    },
    {
      title: "Sistema de Visitas",
      description: "Busca rápida e filtragem de visitantes ativos e históricos de internos.",
      icon: Users,
      href: "/sistema",
      color: "from-purple-500 to-violet-600",
      textColor: "text-purple-600",
      metric: "Pesquisa XLSX",
    },
    {
      title: "Escalas de Serviço",
      description: "Visualização e consulta da escala da equipe de segurança e plantões.",
      icon: Calendar,
      href: "/escalas",
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-600",
      metric: "Visualizar PDF",
    },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 md:p-8 shadow-xl border border-slate-800">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center pr-12">
          <ShieldCheck size={280} className="text-white" />
        </div>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Painel Operacional
          </span>
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            Olá, {session?.user.name} 👋
          </h1>
          <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
            Bem-vindo ao sistema de controle da unidade <span className="text-white font-bold">{globalConfig.nomeUnidade}</span> ({globalConfig.localidade}). Utilize os atalhos abaixo para gerenciar a alimentação, ocorrências ou verificar visitas dos internos.
          </p>
        </div>
      </div>

      {/* Grid of Modules */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">Atalhos Operacionais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <Link 
                key={m.href} 
                href={m.href}
                className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition duration-200 outline-none focus:ring-2 focus:ring-slate-900"
              >
                <div className="space-y-4">
                  {/* Icon Block */}
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${m.color} text-white shadow-sm`}>
                    <Icon size={22} />
                  </div>
                  
                  {/* Title & Desc */}
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-slate-800 group-hover:text-slate-950 transition flex items-center gap-1">
                      {m.title}
                      <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                    </h3>
                    <p className="text-slate-500 text-xs font-medium leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400 uppercase tracking-wider">Status Atual</span>
                  <span className={`${m.textColor} bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100`}>
                    {m.metric}
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle size={14} className="text-slate-400" />
          <span>Dica: Use o menu lateral para gerenciar as configurações da unidade ou usuários.</span>
        </div>
        <div className="font-mono">
          UPI-4 v1.0.0 • Prisma + SQLite
        </div>
      </div>
    </div>
  )
}

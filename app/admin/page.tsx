import Link from "next/link"
import { Users, Settings, ShieldCheck, ChevronRight, UserPlus, Sliders } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const [userCount, alaCount] = await Promise.all([
    prisma.user.count(),
    prisma.ala.count({ where: { ativa: true } }),
  ])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Admin Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-xl">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 pointer-events-none flex items-center justify-center pr-12">
          <ShieldCheck size={280} />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            Acesso Root
          </span>
          <h1 className="text-3xl font-black tracking-tight">Painel de Controle Admin</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-xl font-medium">
            Gerencie os usuários do sistema, as configurações globais de cálculo da unidade prisional e as alas cadastradas de forma centralizada.
          </p>
        </div>
      </div>

      {/* Ratios Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Usuários do Sistema</span>
            <span className="block text-3xl font-black text-slate-900 font-mono">{userCount}</span>
            <p className="text-xs text-slate-500 font-medium">Controle de acessos e permissões.</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
            <Users size={28} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alas Ativas</span>
            <span className="block text-3xl font-black text-slate-900 font-mono">{alaCount}</span>
            <p className="text-xs text-slate-500 font-medium">Setores mapeados para distribuição.</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
            <Sliders size={28} />
          </div>
        </div>
      </div>

      {/* Main Admin Menu Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">O que você deseja fazer?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User management card */}
          <Link
            href="/admin/usuarios"
            className="group p-6 bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                <UserPlus size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 group-hover:text-slate-950 flex items-center gap-1">
                  Gerenciamento de Usuários
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Cadastre novos policiais no sistema, altere senhas, altere permissões de administrador ou desative contas inativas.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-blue-600">
              Ir para usuários →
            </div>
          </Link>

          {/* Configurations card */}
          <Link
            href="/admin/configuracoes"
            className="group p-6 bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl hover:shadow-md transition duration-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition">
                <Settings size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 group-hover:text-slate-950 flex items-center gap-1">
                  Configurações do Sistema
                  <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition" />
                </h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  Defina os parâmetros globais de entrega (como o nome da unidade e localidade, capacidade das caixas e limites operacionais).
                </p>
              </div>
            </div>
            <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-purple-600">
              Ir para configurações →
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

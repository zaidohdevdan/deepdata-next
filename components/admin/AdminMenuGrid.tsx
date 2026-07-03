import Link from "next/link"
import { UserPlus, Settings, ChevronRight, UserCheck } from "lucide-react"

export default function AdminMenuGrid() {
  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">O que você deseja fazer?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Chefes management card */}
        <Link
          href="/admin/chefes"
          className="group p-6 bg-white border border-slate-200/80 hover:border-violet-300 rounded-2xl hover:shadow-md transition duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <UserCheck size={20} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 group-hover:text-slate-950 flex items-center gap-1">
                Chefes de Equipe
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition" />
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Cadastre os chefes de equipe (nome, matrícula) e vincule-os às equipes operacionais (Alfa, Bravo, Charlie, Delta) para exibição nas assinaturas.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-emerald-600">
            Ir para chefes →
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
  )
}

import Link from "next/link"
import { UserPlus, Settings, ChevronRight, UserCheck } from "lucide-react"

export default function AdminMenuGrid() {
  return (
    <div>
      <h2 className="text-base sm:text-lg font-black text-slate-900 mb-4 tracking-tight">O que você deseja gerenciar?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User management card */}
        <Link
          href="/admin/usuarios"
          className="group p-6 bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] hover:shadow-lg transition duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/80 items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              <UserPlus size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 group-hover:text-blue-600 flex items-center gap-1 transition">
                Gerenciamento de Usuários
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-blue-600 transition" />
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Cadastre novos policiais penais, redefina senhas, gerencie permissões de administrador ou desative contas inativas.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-extrabold text-blue-600 flex items-center gap-1">
            <span>Acessar Usuários</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </Link>

        {/* Chefes management card */}
        <Link
          href="/admin/chefes"
          className="group p-6 bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] hover:shadow-lg transition duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              <UserCheck size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 group-hover:text-emerald-600 flex items-center gap-1 transition">
                Chefes de Equipe
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-emerald-600 transition" />
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Cadastre os chefes de equipe (nome, matrícula) e vincule-os às equipes operacionais (Alfa, Bravo, Echo, Fox) para assinaturas automáticas.
              </p>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-extrabold text-emerald-600 flex items-center gap-1">
            <span>Acessar Chefes</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </Link>

        {/* Configurations card */}
        <Link
          href="/configuracoes"
          className="group p-6 bg-white border border-slate-200/80 hover:border-blue-300 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] hover:shadow-lg transition duration-200 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100/80 items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              <Settings size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 group-hover:text-indigo-600 flex items-center gap-1 transition">
                Configurações do Sistema
                <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-0.5 group-hover:text-indigo-600 transition" />
              </h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Defina os parâmetros globais de cálculo da unidade (capacidade de caixas, pacotes de pães, garrafas e regras de refeição).
              </p>
            </div>
          </div>
          <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-extrabold text-indigo-600 flex items-center gap-1">
            <span>Acessar Configurações</span>
            <span className="group-hover:translate-x-1 transition">→</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

import { Users, UserCheck, Sliders } from "lucide-react"

interface AdminMetricsRowProps {
  userCount: number
  chefesCount: number
  alaCount: number
}

export default function AdminMetricsRow({ userCount, chefesCount, alaCount }: AdminMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex items-center justify-between transition hover:shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Usuários do Sistema</span>
          <span className="block text-3xl font-black text-slate-900 font-mono">{userCount}</span>
          <p className="text-xs text-slate-500 font-medium">Controle de acessos e permissões.</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 border border-blue-100/80 rounded-2xl text-blue-600 flex items-center justify-center shrink-0">
          <Users size={24} />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex items-center justify-between transition hover:shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Chefes de Equipe</span>
          <span className="block text-3xl font-black text-slate-900 font-mono">{chefesCount}</span>
          <p className="text-xs text-slate-500 font-medium">Chefes ativos e vinculados.</p>
        </div>
        <div className="w-12 h-12 bg-emerald-50 border border-emerald-100/80 rounded-2xl text-emerald-600 flex items-center justify-center shrink-0">
          <UserCheck size={24} />
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex items-center justify-between transition hover:shadow-md">
        <div className="space-y-1">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Alas Ativas</span>
          <span className="block text-3xl font-black text-slate-900 font-mono">{alaCount}</span>
          <p className="text-xs text-slate-500 font-medium">Setores mapeados para distribuição.</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100/80 rounded-2xl text-indigo-600 flex items-center justify-center shrink-0">
          <Sliders size={24} />
        </div>
      </div>
    </div>
  )
}

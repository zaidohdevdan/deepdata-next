import { Users, UserCheck, Sliders } from "lucide-react"

interface AdminMetricsRowProps {
  userCount: number
  chefesCount: number
  alaCount: number
}

export default function AdminMetricsRow({ userCount, chefesCount, alaCount }: AdminMetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chefes de Equipe</span>
          <span className="block text-3xl font-black text-slate-900 font-mono">{chefesCount}</span>
          <p className="text-xs text-slate-500 font-medium">Chefes ativos e vinculados.</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
          <UserCheck size={28} />
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
  )
}

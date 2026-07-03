import { ShieldCheck } from "lucide-react"

export default function AdminWelcomeCard() {
  return (
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
          Gerencie os usuários do sistema, as configurações globais de cálculo da unidade prisional e os chefes de equipe vinculados.
        </p>
      </div>
    </div>
  )
}

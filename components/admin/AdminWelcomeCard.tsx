import { ShieldCheck } from "lucide-react"

export default function AdminWelcomeCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 md:p-8 border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)]">
      {/* Filete superior em degradê institucional */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
      
      <div className="absolute right-4 bottom-0 top-0 opacity-5 pointer-events-none flex items-center justify-center text-blue-900">
        <ShieldCheck size={220} />
      </div>
      
      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wide uppercase">
            <ShieldCheck size={13} className="text-blue-600" />
            Controle do Sistema • Acesso Root
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
          Painel de Controle Administrativo
        </h1>
        <p className="text-slate-500 text-xs md:text-sm max-w-2xl font-medium leading-relaxed">
          Gerencie os usuários do sistema, as configurações globais de cálculo da unidade prisional e os chefes de equipe vinculados com permissões avançadas.
        </p>
      </div>
    </div>
  )
}

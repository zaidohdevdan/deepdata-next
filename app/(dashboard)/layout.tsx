import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { ShieldCheck, MapPin, Calendar } from "lucide-react"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase()

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar role={session.user.role} userName={session.user.name} />

      {/* Main content - offset by sidebar width */}
      <main className="flex-1 ml-16 lg:ml-56 min-h-screen print:ml-0 print:min-h-0 flex flex-col">
        {/* Topbar no estilo do screenshot SaaS (Jane Davidson / Enterprise Hero) */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 print:hidden transition-all shadow-xs">
          {/* Lado Esquerdo: Identidade do Sistema */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
              UPI
            </div>
            <div>
              <div className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight leading-tight">
                DEEPDATA OPERACIONAL
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Secretaria da Administração Penitenciária • SAP
              </div>
            </div>
          </div>

          {/* Lado Direito: Pílulas de Status e Perfil de Usuário */}
          <div className="flex items-center gap-3">
            {/* Pílula de Data */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-600 font-semibold font-mono">
              <Calendar size={13} className="text-blue-600" />
              <span>{dataHoje}</span>
            </div>

            {/* Pílula de Unidade */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-600 font-semibold">
              <MapPin size={13} className="text-blue-600" />
              <span>UPI-4 • Itaitinga</span>
            </div>

            {/* Pílula do Usuário estilo "Jane Davidson" do Screenshot */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full transition shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                {session.user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-extrabold text-slate-800 leading-tight">
                  {session.user.name}
                </div>
                <div className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  {session.user.role === "ADMIN" && <ShieldCheck size={10} />}
                  <span>{session.user.role === "ADMIN" ? "Administrador" : "Operador"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8 flex-1 print:p-0">
          {children}
        </div>
      </main>
    </div>
  )
}

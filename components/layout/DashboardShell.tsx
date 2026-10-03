"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Menu, ShieldCheck, MapPin, Calendar } from "lucide-react"

interface DashboardShellProps {
  role?: string
  userName?: string
  dataHoje: string
  isAdmin?: boolean
  children: React.ReactNode
}

export function DashboardShell({
  role,
  userName,
  dataHoje,
  isAdmin,
  children,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const [prevPathname, setPrevPathname] = useState(pathname)

  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setMobileOpen(false)
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] w-full min-w-0 overflow-x-hidden">
      <Sidebar
        role={role}
        userName={userName}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main content - 100% no mobile, offset no desktop */}
      <main className="flex-1 ml-0 lg:ml-56 min-h-screen print:ml-0 print:min-h-0 flex flex-col w-full min-w-0">
        {/* Topbar responsiva */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-4 lg:px-8 print:hidden transition-all shadow-xs">
          {/* Lado Esquerdo: Botão Hamburger (Mobile) + Identidade */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer shrink-0"
              aria-label="Abrir menu de navegação"
            >
              <Menu size={22} />
            </button>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0 font-mono">
              UPI
            </div>

            <div className="min-w-0">
              <div className="font-extrabold text-slate-800 text-xs sm:text-sm tracking-tight leading-tight flex items-center gap-1.5 truncate">
                <span className="truncate">DEEPDATA OPERACIONAL</span>
                {isAdmin && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 uppercase shrink-0">
                    Admin Root
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate hidden sm:block">
                Secretaria da Administração Penitenciária • SAP
              </div>
            </div>
          </div>

          {/* Lado Direito: Pílulas de Status e Perfil de Usuário */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Pílula de Data (oculta em telas muito pequenas) */}
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-600 font-semibold font-mono">
              <Calendar size={13} className="text-blue-600" />
              <span>{dataHoje}</span>
            </div>

            {/* Pílula de Unidade (oculta em tablets/smartphones) */}
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs text-slate-600 font-semibold">
              <MapPin size={13} className="text-blue-600" />
              <span>UPI-4 • Itaitinga</span>
            </div>

            {/* Pílula do Usuário */}
            <div className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-full transition shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0 font-mono">
                {userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-extrabold text-slate-800 leading-tight truncate max-w-[120px]">
                  {userName}
                </div>
                <div className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                  {role === "ADMIN" && <ShieldCheck size={10} />}
                  <span>{role === "ADMIN" ? "Administrador" : "Operador"}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content - com padding seguro em celular */}
        <div className="p-3 sm:p-5 lg:p-8 flex-1 print:p-0 min-w-0 w-full overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}

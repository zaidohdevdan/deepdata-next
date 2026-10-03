"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Utensils,
  Coffee,
  Cookie,
  ClipboardList,
  Users,
  Calendar,
  LogOut,
  ShieldCheck,
  Settings,
  ChevronDown,
  UserCheck,
} from "lucide-react"
import { clsx } from "clsx"
import { LucideIcon } from "lucide-react"

interface SubMenuItem {
  href: string
  label: string
  icon: LucideIcon
}

interface MenuItem {
  href?: string
  label: string
  icon: LucideIcon
  exact?: boolean
  subItems?: SubMenuItem[]
}

const modules: MenuItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  {
    label: "Alimentação",
    icon: Utensils,
    subItems: [
      { href: "/alimentacao", label: "Almoço/Janta", icon: Utensils },
      { href: "/cafe", label: "Café/Pão", icon: Coffee },
      { href: "/biscoito", label: "Café/Biscoitos", icon: Cookie },
    ]
  },
  { href: "/ocorrencias", label: "Ocorrências", icon: ClipboardList },
  { href: "/sistema", label: "Visita Comum", icon: Users },
  {
    label: "Escalas",
    icon: Calendar,
    subItems: [
      { href: "/escalas/efetivo", label: "Efetivo", icon: Calendar },
      { href: "/escalas/diurna", label: "Diurna / Alvorada", icon: Calendar },
      { href: "/escalas/revezamento", label: "Revezamento", icon: Calendar },
      { href: "/escalas/noturna", label: "Noturna", icon: Calendar },
    ]
  },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
]

const adminModules = [
  { href: "/admin", label: "Painel Admin", icon: ShieldCheck, exact: true },
  { href: "/admin/usuarios", label: "Usuários", icon: Users },
  { href: "/admin/chefes", label: "Chefes de Equipe", icon: UserCheck },
]

interface SidebarProps {
  role?: string
  userName?: string
}

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname()
  const [isAlimHovered, setIsAlimHovered] = useState(false)
  const [isEscalasHovered, setIsEscalasHovered] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (label: string) => {
    setOpenMenu(prev => prev === label ? null : label)
  }

  // Reset menu on pathname change (fires once navigation has successfully completed)
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenMenu(null)
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href) && href !== "/"
  }

  // Check if any sub-item is active
  const isAlimActive = pathname.startsWith("/alimentacao") || pathname.startsWith("/cafe") || pathname.startsWith("/biscoito")
  const isEscalasActive = pathname.startsWith("/escalas")

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-16 lg:w-56 flex flex-col bg-white border-r border-slate-200/80 shadow-[2px_0_24px_-4px_rgba(20,50,110,0.04)] transition-all duration-300 print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-blue-500/20 font-mono">
          D
        </div>
        <span className="hidden lg:block text-slate-900 font-black text-sm tracking-wider uppercase truncate font-mono">
          DeepData
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 relative">
        <div className="hidden lg:block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mb-2">
          Módulos
        </div>
        
        {modules.map((mod) => {
          if (mod.subItems) {
            const isHovered = mod.label === "Alimentação" ? isAlimHovered : isEscalasHovered
            const setIsHovered = mod.label === "Alimentação" ? setIsAlimHovered : setIsEscalasHovered
            const isActiveNode = mod.label === "Alimentação" ? isAlimActive : isEscalasActive
            const groupClass = mod.label === "Alimentação" ? "relative group/alim" : "relative group/escalas"
            const hoverDotClass = mod.label === "Alimentação" ? "after:bg-slate-300 group-hover/alim:after:bg-blue-500" : "after:bg-slate-300 group-hover/escalas:after:bg-blue-500"
            const collapsedGroupHoverClass = mod.label === "Alimentação" ? "group-hover/alim:pointer-events-auto group-hover/alim:opacity-100 group-hover/alim:translate-x-0" : "group-hover/escalas:pointer-events-auto group-hover/escalas:opacity-100 group-hover/escalas:translate-x-0"
            const topAlignClass = mod.label === "Alimentação" ? "top-24" : "top-52"

            return (
              <div
                key={mod.label}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={groupClass}
              >
                <button
                  type="button"
                  onClick={() => toggleMenu(mod.label)}
                  className={clsx(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 outline-none cursor-pointer",
                    isActiveNode
                      ? "bg-blue-50 text-blue-700 border border-blue-200/80 font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <mod.icon className={clsx("w-5 h-5 shrink-0", isActiveNode ? "text-blue-600" : "text-slate-400")} />
                    <span className="hidden lg:block">{mod.label}</span>
                  </div>
                  <ChevronDown className={clsx(
                    "w-4 h-4 hidden lg:block text-slate-400 transition-transform duration-200",
                    (isHovered || isActiveNode || openMenu === mod.label) && "rotate-180 text-blue-600"
                  )} />
                </button>

                {/* GRAPH SUBMENU FOR LARGE SCREEN (Vertical expanded) */}
                <div
                  className={clsx(
                    "hidden lg:block transition-all duration-300 overflow-hidden ml-6 pl-4 border-l border-slate-200 space-y-1 relative mt-1",
                    isHovered || isActiveNode || openMenu === mod.label
                      ? "max-h-60 opacity-100 py-1"
                      : "max-h-0 opacity-0 pointer-events-none"
                  )}
                >
                  {/* Subtle Graph lines and nodes */}
                  {mod.subItems.map((sub) => {
                    const active = isActive(sub.href)
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          "relative flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 pl-5",
                          active
                            ? "text-blue-700 bg-blue-50/80 font-bold"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50",
                          
                          // Custom graph line branch connector
                          "before:absolute before:left-[-17px] before:top-1/2 before:-translate-y-1/2 before:w-[17px] before:h-[1px]",
                          active ? "before:bg-blue-500" : "before:bg-slate-200",

                          // Custom graph node circle dot
                          "after:absolute after:left-[-20px] after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:transition-all after:duration-150",
                          active ? "after:bg-blue-600 after:scale-125 shadow-sm shadow-blue-500/50" : hoverDotClass
                        )}
                      >
                        <sub.icon className={clsx("w-3.5 h-3.5 shrink-0", active ? "text-blue-600" : "text-slate-400")} />
                        <span>{sub.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* GRAPH SUBMENU FOR COLLAPSED SCREEN (Horizontal popover) */}
                <div
                  className={clsx(
                    "lg:hidden fixed left-16 bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xl transition-all duration-200 z-50 flex flex-col gap-1 w-48",
                    collapsedGroupHoverClass,
                    topAlignClass,
                    openMenu === mod.label
                      ? "pointer-events-auto opacity-100 translate-x-0"
                      : "pointer-events-none opacity-0 translate-x-2"
                  )}
                >
                  <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1 px-1.5">
                    {mod.label}
                  </div>
                  {mod.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={clsx(
                        "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                        isActive(sub.href)
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <sub.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          }

          if (mod.href) {
            const { href, label, icon: Icon, exact } = mod
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className={clsx("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400")} />
                <span className="hidden lg:block">{label}</span>
              </Link>
            )
          }

          return null
        })}

        {/* Admin section */}
        {role === "ADMIN" && (
          <>
            <div className="hidden lg:block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mt-4 mb-2">
              Admin
            </div>
            {adminModules.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact)
              return (
                <Link
                  key={href}
                  href={href}
                  title={label}
                  className={clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                    active
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <Icon className={clsx("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400")} />
                  <span className="hidden lg:block">{label}</span>
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/50">
        <div className="hidden lg:flex items-center gap-2.5 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
            {userName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <span className="text-xs font-semibold text-slate-700 truncate">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          title="Sair do sistema"
          className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 shadow-2xs active:scale-95 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span className="hidden lg:block tracking-wide">Sair da Sessão</span>
        </button>
      </div>
    </aside>
  )
}

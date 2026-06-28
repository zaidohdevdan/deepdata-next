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
    setOpenMenu(null)
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
    <aside className="fixed inset-y-0 left-0 z-40 w-16 lg:w-56 flex flex-col bg-slate-900 shadow-xl transition-all duration-300 print:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-lg shadow-blue-500/30">
          D
        </div>
        <span className="hidden lg:block text-white font-bold text-sm tracking-wide truncate">
          DeepData
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5 relative">
        <div className="hidden lg:block text-xs text-slate-500 font-semibold uppercase tracking-widest px-2 mb-2">
          Módulos
        </div>
        
        {modules.map((mod) => {
          if (mod.subItems) {
            const isHovered = mod.label === "Alimentação" ? isAlimHovered : isEscalasHovered
            const setIsHovered = mod.label === "Alimentação" ? setIsAlimHovered : setIsEscalasHovered
            const isActiveNode = mod.label === "Alimentação" ? isAlimActive : isEscalasActive
            const groupClass = mod.label === "Alimentação" ? "relative group/alim" : "relative group/escalas"
            const hoverDotClass = mod.label === "Alimentação" ? "after:bg-slate-700 group-hover/alim:after:bg-blue-500/40" : "after:bg-slate-700 group-hover/escalas:after:bg-blue-500/40"
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
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 outline-none cursor-pointer",
                    isActiveNode
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <mod.icon className="w-5 h-5 shrink-0" />
                    <span className="hidden lg:block">{mod.label}</span>
                  </div>
                  <ChevronDown className={clsx(
                    "w-4 h-4 hidden lg:block text-slate-500 transition-transform duration-200",
                    (isHovered || isActiveNode || openMenu === mod.label) && "rotate-180 text-blue-400"
                  )} />
                </button>

                {/* GRAPH SUBMENU FOR LARGE SCREEN (Vertical expanded) */}
                <div
                  className={clsx(
                    "hidden lg:block transition-all duration-300 overflow-hidden ml-6 pl-4 border-l border-blue-500/20 space-y-1 relative mt-1",
                    isHovered || isActiveNode || openMenu === mod.label
                      ? "max-h-60 opacity-100 py-1"
                      : "max-h-0 opacity-0 pointer-events-none"
                  )}
                >
                  {/* Subtle Graph lines and nodes */}
                  {mod.subItems.map((sub, idx) => {
                    const active = isActive(sub.href)
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={clsx(
                          "relative flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 pl-6",
                          active
                            ? "text-blue-400 bg-blue-500/5 font-bold"
                            : "text-slate-400 hover:text-white hover:bg-white/5",
                          
                          // Custom graph line branch connector
                          "before:absolute before:left-[-17px] before:top-1/2 before:-translate-y-1/2 before:w-[17px] before:h-[1px]",
                          active ? "before:bg-blue-500" : "before:bg-blue-500/20",

                          // Custom graph node circle dot
                          "after:absolute after:left-[-20px] after:top-1/2 after:-translate-y-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:transition-all after:duration-150",
                          active ? "after:bg-blue-500 after:scale-125 shadow-sm shadow-blue-500" : hoverDotClass
                        )}
                      >
                        <sub.icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{sub.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* GRAPH SUBMENU FOR COLLAPSED SCREEN (Horizontal popover) */}
                <div
                  className={clsx(
                    "lg:hidden fixed left-16 bg-slate-950 border border-slate-800 rounded-xl p-2.5 shadow-2xl transition-all duration-200 z-50 flex flex-col gap-1 w-44 pointer-events-none opacity-0 translate-x-2",
                    collapsedGroupHoverClass,
                    topAlignClass,
                    openMenu === mod.label && "pointer-events-auto opacity-100 translate-x-0"
                  )}
                >
                  <div className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider mb-1 px-1.5">
                    {mod.label}
                  </div>
                  {mod.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={clsx(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                        isActive(sub.href)
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:text-white hover:bg-white/10"
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
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive(href, exact)
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            )
          }

          return null
        })}

        {/* Admin section */}
        {role === "ADMIN" && (
          <>
            <div className="hidden lg:block text-xs text-slate-500 font-semibold uppercase tracking-widest px-2 mt-4 mb-2">
              Admin
            </div>
            {adminModules.map(({ href, label, icon: Icon, exact }) => (
              <Link
                key={href}
                href={href}
                title={label}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive(href, exact)
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/30"
                    : "text-slate-400 hover:text-white hover:bg-white/10"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="hidden lg:block">{label}</span>
              </Link>
            ))}
          </>
        )}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3">
        <div className="hidden lg:flex items-center gap-2 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
            {userName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <span className="text-xs text-slate-400 truncate">{userName}</span>
        </div>
        <button
          onClick={handleLogout}
          title="Sair"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="hidden lg:block">Sair</span>
        </button>
      </div>
    </aside>
  )
}

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
  Wrench,
  X,
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
    ],
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
    ],
  },
  { href: "/ferramentas", label: "Ferramentas", icon: Wrench },
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
  mobileOpen?: boolean
  onCloseMobile?: () => void
}

export function Sidebar({ role, userName, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const pathname = usePathname()
  const [isAlimHovered, setIsAlimHovered] = useState(false)
  const [isEscalasHovered, setIsEscalasHovered] = useState(false)
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label))
  }

  // Reset menu on pathname change
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

  const isAlimActive =
    pathname.startsWith("/alimentacao") ||
    pathname.startsWith("/cafe") ||
    pathname.startsWith("/biscoito")
  const isEscalasActive = pathname.startsWith("/escalas")

  async function handleLogout() {
    await signOut({ callbackUrl: "/login" })
  }

  // Renderiza a lista de itens de navegação (reutilizável para desktop e mobile)
  const renderNavList = (isMobile = false) => (
    <>
      <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mb-2 font-mono">
        Módulos Operacionais
      </div>

      {modules.map((mod) => {
        if (mod.subItems) {
          const isHovered = mod.label === "Alimentação" ? isAlimHovered : isEscalasHovered
          const setIsHovered = mod.label === "Alimentação" ? setIsAlimHovered : setIsEscalasHovered
          const isActiveNode = mod.label === "Alimentação" ? isAlimActive : isEscalasActive
          const isExpanded = isMobile
            ? openMenu === mod.label || isActiveNode
            : isHovered || isActiveNode || openMenu === mod.label

          return (
            <div
              key={mod.label}
              onMouseEnter={() => !isMobile && setIsHovered(true)}
              onMouseLeave={() => !isMobile && setIsHovered(false)}
              className="relative"
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
                  <mod.icon
                    className={clsx(
                      "w-5 h-5 shrink-0",
                      isActiveNode ? "text-blue-600" : "text-slate-400"
                    )}
                  />
                  <span>{mod.label}</span>
                </div>
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 text-slate-400 transition-transform duration-200",
                    isExpanded && "rotate-180 text-blue-600"
                  )}
                />
              </button>

              {/* Submenu Vertical Desdobrável */}
              <div
                className={clsx(
                  "transition-all duration-200 overflow-hidden ml-4 pl-3 border-l-2 border-slate-200 space-y-1 relative mt-1",
                  isExpanded ? "max-h-60 opacity-100 py-1" : "max-h-0 opacity-0 pointer-events-none"
                )}
              >
                {mod.subItems.map((sub) => {
                  const active = isActive(sub.href)
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => isMobile && onCloseMobile?.()}
                      className={clsx(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150",
                        active
                          ? "text-blue-700 bg-blue-50 font-bold"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <sub.icon
                        className={clsx(
                          "w-3.5 h-3.5 shrink-0",
                          active ? "text-blue-600" : "text-slate-400"
                        )}
                      />
                      <span>{sub.label}</span>
                    </Link>
                  )
                })}
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
              onClick={() => isMobile && onCloseMobile?.()}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                active
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={clsx("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400")} />
              <span>{label}</span>
            </Link>
          )
        }

        return null
      })}

      {/* Admin section */}
      {role === "ADMIN" && (
        <>
          <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest px-2 mt-5 mb-2 font-mono">
            Administração
          </div>
          {adminModules.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={() => isMobile && onCloseMobile?.()}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                  active
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon
                  className={clsx("w-5 h-5 shrink-0", active ? "text-white" : "text-slate-400")}
                />
                <span>{label}</span>
              </Link>
            )
          })}
        </>
      )}
    </>
  )

  return (
    <>
      {/* =================================================================== */}
      {/* 1. SIDEBAR DESKTOP DOCK (Visível apenas em telas grandes lg+)        */}
      {/* =================================================================== */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-56 flex-col bg-white border-r border-slate-200/80 shadow-[2px_0_24px_-4px_rgba(20,50,110,0.04)] transition-all duration-300 print:hidden">
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-blue-500/20 font-mono">
            D
          </div>
          <span className="text-slate-900 font-black text-sm tracking-wider uppercase truncate font-mono">
            DeepData
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative">
          {renderNavList(false)}
        </nav>

        {/* User + Logout */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/50">
          <div className="flex items-center gap-2.5 px-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 font-mono">
              {userName?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <span className="text-xs font-semibold text-slate-700 truncate">{userName}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Sair do sistema"
            className="w-full flex items-center justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 shadow-2xs active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="tracking-wide">Sair da Sessão</span>
          </button>
        </div>
      </aside>

      {/* =================================================================== */}
      {/* 2. SIDEBAR MOBILE DRAWER (Off-canvas com Backdrop para celulares)   */}
      {/* =================================================================== */}
      {/* Backdrop escuro com blur */}
      <div
        onClick={onCloseMobile}
        className={clsx(
          "fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden print:hidden",
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Gaveta deslizante móvel */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden print:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header do Drawer Móvel com Botão Fechar */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md shadow-blue-500/20 font-mono">
              D
            </div>
            <div>
              <span className="text-slate-900 font-black text-sm tracking-wider uppercase font-mono block leading-tight">
                DeepData
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Gestão Prisional</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Perfil do Usuário em Destaque no Topo do Menu Móvel */}
        <div className="p-3.5 mx-3 mt-3 bg-blue-50/70 border border-blue-100/80 rounded-2xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0 font-mono">
            {userName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black text-slate-800 truncate">{userName}</div>
            <div className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
              {role === "ADMIN" && <ShieldCheck size={10} />}
              <span>{role === "ADMIN" ? "Administrador" : "Operador"}</span>
            </div>
          </div>
        </div>

        {/* Navegação Completa no Celular */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 relative">
          {renderNavList(true)}
        </nav>

        {/* Footer com Botão de Sair no Celular */}
        <div className="border-t border-slate-100 p-3 bg-slate-50/70">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200/80 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sair da Sessão</span>
          </button>
        </div>
      </aside>
    </>
  )
}

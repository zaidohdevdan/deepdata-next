"use client"

import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Wrench,
  RefreshCw,
  Archive,
  Calculator,
  StickyNote,
  CalendarDays,
  FileCheck,
  Sparkles,
} from "lucide-react"

import { ConversorTab } from "./tabs/ConversorTab"
import { CompactadorTab } from "./tabs/CompactadorTab"
import { CalculadoraTab } from "./tabs/CalculadoraTab"
import { BlocoNotasTab } from "./tabs/BlocoNotasTab"
import { CalendarioTab } from "./tabs/CalendarioTab"
import { TermosModelosTab } from "./tabs/TermosModelosTab"

export type FerramentasTabKey =
  | "conversor"
  | "compactador"
  | "calculadora"
  | "notas"
  | "calendario"
  | "modelos"

interface ToolTabItem {
  key: FerramentasTabKey
  label: string
  subtitle: string
  icon: React.ElementType
}

const TABS: ToolTabItem[] = [
  {
    key: "conversor",
    label: "Conversor",
    subtitle: "PDF, Word, Excel & Fotos",
    icon: RefreshCw,
  },
  {
    key: "compactador",
    label: "Compactador",
    subtitle: "PDF, Fotos & Pacotes ZIP",
    icon: Archive,
  },
  {
    key: "calculadora",
    label: "Calculadora",
    subtitle: "Operacional & Frações LEP",
    icon: Calculator,
  },
  {
    key: "notas",
    label: "Bloco de Notas",
    subtitle: "Rascunhos & Lembretes",
    icon: StickyNote,
  },
  {
    key: "calendario",
    label: "Calendário",
    subtitle: "Escalas 24x72 & Eventos",
    icon: CalendarDays,
  },
  {
    key: "modelos",
    label: "Termos & Modelos",
    subtitle: "CFD, Apreensão & Carimbo",
    icon: FileCheck,
  },
]

function FerramentasContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tabParam = (searchParams.get("tab") as FerramentasTabKey) || "conversor"
  const activeTab: FerramentasTabKey = TABS.some((t) => t.key === tabParam) ? tabParam : "conversor"

  const handleSelectTab = (key: FerramentasTabKey) => {
    router.replace(`/ferramentas?tab=${key}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 1. HERO BANNER PRINCIPAL (ESTILO ENTERPRISE HERO)          */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 sm:p-7 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] border border-slate-200/80">
        {/* Filete superior institucional em gradiente */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>SISTEMA ADMINISTRATIVO • UPI-4</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Wrench size={18} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                Central de Ferramentas Operacionais
              </h1>
            </div>

            <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">
              Utilitários integrados para conversão e compactação de arquivos, cálculo de frações penais e prazos da LEP, anotações de plantão e acompanhamento do ciclo de escalas.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200/80 self-start md:self-auto">
            <Sparkles size={14} className="text-blue-600" />
            <span>6 Ferramentas Integradas</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. BARRA DE NAVEGAÇÃO ENTRE AS FERRAMENTAS (PILL TABS)    */}
      {/* ========================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-2 sm:p-2.5 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleSelectTab(tab.key)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all duration-150 cursor-pointer text-left ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon size={17} />
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-black truncate leading-tight ${
                      isActive ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {tab.label}
                  </div>
                  <div
                    className={`text-[10px] truncate leading-tight mt-0.5 ${
                      isActive ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {tab.subtitle}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CONTEÚDO DA FERRAMENTA SELECIONADA                     */}
      {/* ========================================================= */}
      <div>
        {activeTab === "conversor" && <ConversorTab />}
        {activeTab === "compactador" && <CompactadorTab />}
        {activeTab === "calculadora" && <CalculadoraTab />}
        {activeTab === "notas" && <BlocoNotasTab />}
        {activeTab === "calendario" && <CalendarioTab />}
        {activeTab === "modelos" && <TermosModelosTab />}
      </div>
    </div>
  )
}

export function FerramentasContainer() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px] text-xs font-bold text-slate-400">
          Carregando ferramentas...
        </div>
      }
    >
      <FerramentasContent />
    </Suspense>
  )
}

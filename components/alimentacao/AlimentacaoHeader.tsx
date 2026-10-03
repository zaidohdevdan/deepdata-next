"use client"

import { useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Upload, Download, Printer, RefreshCw, Calendar, MapPin, Utensils, Coffee, Cookie } from "lucide-react"
import { toast } from "sonner"
import { AlimentacaoConfig, ConfigValues } from "@/lib/calculation"

interface AlimentacaoHeaderProps {
  config?: AlimentacaoConfig
  globalConfig: ConfigValues
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onClearClick: () => void
}

export function AlimentacaoHeader({ globalConfig, onImport, onExport, onClearClick }: AlimentacaoHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase()

  const modules = [
    { href: "/alimentacao", label: "Almoço / Janta", icon: Utensils, active: pathname === "/alimentacao" },
    { href: "/cafe", label: "Café da Manhã", icon: Coffee, active: pathname === "/cafe" },
    { href: "/biscoito", label: "Ceia / Biscoito", icon: Cookie, active: pathname === "/biscoito" },
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_35px_-10px_rgba(20,50,110,0.06)] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
      {/* Lado Esquerdo: Identidade & Seletores em Pílula */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Logo / Badge Azul Real */}
        <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
          <Utensils size={20} className="stroke-[2.2]" />
        </div>

        {/* Informações da Unidade (Pílula) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-2xl text-xs transition">
          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
            <MapPin size={12} className="stroke-[2.5]" />
          </div>
          <div>
            <div className="font-extrabold text-slate-800 leading-tight">
              {globalConfig.nomeUnidade || "UPI-4"}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {globalConfig.localidade || "Itaitinga"}
            </div>
          </div>
        </div>

        {/* Data Atual (Pílula) */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
          <Calendar size={14} className="text-blue-600" />
          <div className="text-[11px] font-bold text-slate-700 font-mono">
            {dataAtual}
          </div>
        </div>

        {/* Alternador de Módulos (Pills estilo tela-tab.png Appointments / Walk-In) */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 max-w-full overflow-x-auto no-scrollbar">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  m.active
                    ? "bg-white text-blue-600 shadow-xs border border-slate-200/60"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={13} className={m.active ? "text-blue-600" : "text-slate-400"} />
                <span>{m.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Lado Direito: Ações em Pílulas */}
      <div className="flex flex-wrap items-center gap-2 self-start sm:self-end lg:self-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200 shadow-xs transition hover:border-slate-300 cursor-pointer"
          title="Importar dados de planilha Excel (.xlsx, .xls)"
        >
          <Upload size={14} className="text-blue-600" />
          <span>Importar</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImport}
          accept=".xlsx, .xls"
          className="hidden"
        />

        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 rounded-full border border-slate-200 shadow-xs transition hover:border-slate-300 cursor-pointer"
          title="Exportar dados para Excel"
        >
          <Download size={14} className="text-indigo-600" />
          <span>Exportar</span>
        </button>

        <button
          onClick={() => {
            toast.dismiss()
            window.print()
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100/80 text-blue-700 rounded-full border border-blue-200/80 shadow-xs transition cursor-pointer"
          title="Imprimir relatório enquadrado em A4"
        >
          <Printer size={14} className="text-blue-600" />
          <span>Imprimir</span>
        </button>

        <button
          onClick={onClearClick}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100/80 text-rose-700 rounded-full border border-rose-200/80 shadow-xs transition cursor-pointer"
          title="Resetar dados da distribuição"
        >
          <RefreshCw size={13} className="text-rose-600" />
          <span>Limpar</span>
        </button>
      </div>
    </div>
  )
}

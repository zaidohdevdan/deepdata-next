"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Utensils,
  Coffee,
  Cookie,
  ClipboardList,
  Users,
  Calendar,
  Settings,
  Search,
  ArrowUpRight,
  Activity,
  Package,
  LayoutGrid,
  List,
  Shield,
  ChevronRight,
  Clock,
} from "lucide-react"

export interface DashboardMetricData {
  totalAlas: number
  totalInternosAlimentacao: number
  totalDietas: number
  totalInternosCafe: number
  totalInternosBiscoito: number
  totalUsuarios: number
  totalOcorrencias: number
  unidade: string
  localidade: string
  userName: string
  userRole: string
}

interface DashboardViewProps {
  data: DashboardMetricData
}

type CategoryFilter = "ALL" | "SEGURANCA" | "ALIMENTACAO" | "MOVIMENTACAO" | "GESTAO"

export function DashboardView({ data }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<CategoryFilter>("ALL")
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  // Lista dos módulos principais da unidade UPI-4
  const modulesList = [
    {
      id: "alim",
      title: "Distribuição de Alimentação",
      subtitle: "Controle de quentinhas (normais e dietas) por ala e cálculo de caixas",
      category: "ALIMENTACAO",
      categoryLabel: "Alimentação",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      icon: Utensils,
      iconBg: "bg-blue-600 text-white",
      href: "/alimentacao",
      metric: `${data.totalInternosAlimentacao.toLocaleString("pt-BR")} Internos`,
      submetric: `${data.totalDietas} dietas cadastradas`,
      status: "Operacional",
      destaque: true,
    },
    {
      id: "cafe",
      title: "Distribuição de Café & Pães",
      subtitle: "Cálculo automático de pacotes de pães e garrafas térmicas",
      category: "ALIMENTACAO",
      categoryLabel: "Alimentação",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      icon: Coffee,
      iconBg: "bg-indigo-600 text-white",
      href: "/cafe",
      metric: `${data.totalInternosCafe.toLocaleString("pt-BR")} Internos`,
      submetric: "Cálculo de café e pães",
      status: "Operacional",
      destaque: false,
    },
    {
      id: "biscoito",
      title: "Distribuição de Biscoitos & Ceia",
      subtitle: "Controle de pacotes de biscoito e garrafas de leite/suco",
      category: "ALIMENTACAO",
      categoryLabel: "Alimentação",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      icon: Cookie,
      iconBg: "bg-sky-600 text-white",
      href: "/biscoito",
      metric: `${data.totalInternosBiscoito.toLocaleString("pt-BR")} Internos`,
      submetric: "Cálculo de ceia e biscoito",
      status: "Operacional",
      destaque: false,
    },
    {
      id: "ocorrencias",
      title: "Livro Diário de Ocorrências",
      subtitle: "Registro de plantão com formatação rápida e cards copiáveis",
      category: "SEGURANCA",
      categoryLabel: "Segurança",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      icon: ClipboardList,
      iconBg: "bg-purple-600 text-white",
      href: "/ocorrencias",
      metric: `${data.totalOcorrencias} Registros`,
      submetric: "Plantão ativo",
      status: "Em Andamento",
      destaque: true,
    },
    {
      id: "escalas",
      title: "Escalas de Serviço & Plantões",
      subtitle: "Visualização de turnos: Diurna, Alvorada, Revezamento e Noturna",
      category: "SEGURANCA",
      categoryLabel: "Segurança",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      icon: Calendar,
      iconBg: "bg-violet-600 text-white",
      href: "/escalas/diurna",
      metric: "4 Turnos Ativos",
      submetric: "Efetivo de segurança",
      status: "Escala Vigente",
      destaque: false,
    },
    {
      id: "visitas",
      title: "Controle de Visitas Comuns",
      subtitle: "Triagem instantânea de visitantes e consulta de cadastro via XLSX",
      category: "MOVIMENTACAO",
      categoryLabel: "Movimentação",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      icon: Users,
      iconBg: "bg-emerald-600 text-white",
      href: "/sistema",
      metric: "Planilha Integrada",
      submetric: "Busca por nome/matrícula",
      status: "Disponível",
      destaque: false,
    },
    {
      id: "configuracoes",
      title: "Parâmetros & Configurações",
      subtitle: `Capacidade de caixas, pacotes e regras específicas da ${data.unidade}`,
      category: "GESTAO",
      categoryLabel: "Gestão",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200/80",
      icon: Settings,
      iconBg: "bg-slate-700 text-white",
      href: "/configuracoes",
      metric: `${data.unidade} • ${data.localidade}`,
      submetric: "Capacidades e regras",
      status: "Configurado",
      destaque: false,
    },
  ]

  const filteredModules = modulesList.filter((m) => {
    const matchesTab = activeTab === "ALL" || m.category === activeTab
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      m.subtitle.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      m.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase().trim())
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================= */}
      {/* 1. HERO BANNER PRINCIPAL DO DASHBOARD (ESTILO ENTERPRISE) */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 sm:p-8 shadow-xl border border-slate-700/50">
        {/* Padrão geométrico suave no fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        {/* Glow azul no canto */}
        <div className="absolute -right-12 -top-12 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Tag / Badge superior */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/15 border border-blue-400/30 text-blue-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>PAINEL OPERACIONAL UNIFICADO • {data.unidade}</span>
            </div>

            {/* Saudação e Título Principal */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Olá, {data.userName} 👋
            </h1>

            {/* Descrição clara do que é o Dashboard */}
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
              Bem-vindo ao centro de controle da unidade <strong className="text-white font-bold">{data.unidade}</strong> ({data.localidade}). Acompanhe abaixo os indicadores em tempo real e utilize os atalhos para os módulos operacionais.
            </p>

            {/* Pílula de data e horário */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Clock size={13} className="text-blue-400" />
              <span className="capitalize">{dataHoje}</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Sistema 100% Conectado
              </span>
            </div>
          </div>

          {/* Botões de Ação Rápida no Hero (Estilo Enterprise Hero) */}
          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <Link
              href="/alimentacao"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition active:scale-98 cursor-pointer"
            >
              <Utensils size={15} />
              <span>Lançar Alimentação</span>
              <ArrowUpRight size={13} className="opacity-70" />
            </Link>

            <Link
              href="/ocorrencias"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition active:scale-98 cursor-pointer backdrop-blur-xs"
            >
              <ClipboardList size={15} className="text-purple-300" />
              <span>Livro de Ocorrências</span>
            </Link>

            <Link
              href="/sistema"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition active:scale-98 cursor-pointer backdrop-blur-xs"
            >
              <Users size={15} className="text-emerald-300" />
              <span>Consultar Visitas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. 4 CARDS DE INDICADORES GERAIS (TEMA tela-tab.png)       */}
      {/* ========================================================= */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Indicadores Consolidados da Unidade
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Atualizado em tempo real
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: População & Alas (Branco com marcador vertical) */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(20,50,110,0.06)] border border-slate-200/80 flex items-center gap-4 transition hover:shadow-md">
            <div className="w-1.5 h-12 bg-blue-600 rounded-full shrink-0" />
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight font-mono">
                {data.totalAlas.toString().padStart(2, "0")}
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Alas Ativas
              </div>
              <div className="text-[11px] text-blue-600 font-semibold mt-0.5">
                {data.unidade} Total
              </div>
            </div>
          </div>

          {/* Card 2: População Carcerária Total (Azul Royal) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-md shadow-blue-600/20 flex flex-col justify-center transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                {data.totalInternosAlimentacao.toLocaleString("pt-BR")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Shield size={16} />
              </div>
            </div>
            <div className="text-xs font-bold text-blue-100 uppercase tracking-wider mt-1">
              Internos Custodiados
            </div>
            <div className="text-[11px] text-blue-200 mt-0.5">
              Censo carcerário ativo
            </div>
          </div>

          {/* Card 3: Livro de Ocorrências (Roxo Indigo) */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl p-5 shadow-md shadow-indigo-600/20 flex flex-col justify-center transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                {data.totalOcorrencias.toString().padStart(2, "0")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <ClipboardList size={16} />
              </div>
            </div>
            <div className="text-xs font-bold text-indigo-100 uppercase tracking-wider mt-1">
              Ocorrências Registradas
            </div>
            <div className="text-[11px] text-indigo-200 mt-0.5">
              Livro de plantão digital
            </div>
          </div>

          {/* Card 4: Refeições Diárias (Esmeralda / Azul Sky) */}
          <div className="bg-gradient-to-br from-blue-600 to-teal-700 text-white rounded-2xl p-5 shadow-md shadow-teal-600/20 flex flex-col justify-center transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-2xl sm:text-3xl font-black tracking-tight font-mono">
                {(data.totalInternosAlimentacao * 2).toLocaleString("pt-BR")}
              </span>
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                <Package size={16} />
              </div>
            </div>
            <div className="text-xs font-bold text-teal-100 uppercase tracking-wider mt-1">
              Refeições / Dia (Almoço/Janta)
            </div>
            <div className="text-[11px] text-teal-200 mt-0.5">
              + {data.totalDietas} dietas especiais
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SEÇÃO DE MÓDULOS OPERACIONAIS (ENTERPRISE HERO STYLE)  */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] overflow-hidden">
        {/* Topo do Bloco: Filtros por Categoria + Modos de Exibição */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Módulos do Sistema DeepData
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/60">
                {modulesList.length} Ativos
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Selecione uma área abaixo para acessar ou gerenciar os dados da unidade.
            </p>
          </div>

          {/* Toggle de Exibição: Cards vs Tabela */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200/80">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "cards"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <LayoutGrid size={13} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <List size={13} />
                <span>Tabela</span>
              </button>
            </div>
          </div>
        </div>

        {/* Barra de Filtros e Busca Rápida (Estilo Customers Screenshot) */}
        <div className="p-4 sm:p-5 bg-slate-50/60 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Categoria Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "ALL"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              Todos ({modulesList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ALIMENTACAO")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "ALIMENTACAO"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              Alimentação (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("SEGURANCA")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "SEGURANCA"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              Segurança & Escalas (2)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("MOVIMENTACAO")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "MOVIMENTACAO"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              Visitas (1)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("GESTAO")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                activeTab === "GESTAO"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              Gestão (1)
            </button>
          </div>

          {/* Campo de Busca */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar serviço operacional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none w-full sm:w-64 transition font-medium text-slate-700"
            />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODO 1: GRADE DE CARDS (VISUALIZAÇÃO PADRÃO DO DASHBOARD) */}
        {/* ========================================================= */}
        {viewMode === "cards" && (
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredModules.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className="group relative flex flex-col justify-between p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500/40 hover:shadow-[0_12px_35px_-6px_rgba(20,50,110,0.1)] transition-all duration-200 cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Topo do Card */}
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105`}>
                        <Icon size={22} className="stroke-[2.2]" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${item.badgeColor}`}>
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Título & Descrição */}
                    <div className="space-y-1.5">
                      <h3 className="font-extrabold text-slate-800 text-base group-hover:text-blue-600 transition flex items-center gap-1.5">
                        <span>{item.title}</span>
                        <ChevronRight size={15} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Rodapé do Card */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                        Métrica Principal
                      </span>
                      <span className="text-xs font-black text-slate-800 font-mono">
                        {item.metric}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white border border-slate-200/80 group-hover:border-blue-600 transition shadow-2xs">
                      <span>Acessar</span>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* MODO 2: TABELA DETALHADA (SCREENSHOT SAAS)                 */}
        {/* ========================================================= */}
        {viewMode === "table" && (
          <div className="overflow-x-auto p-2 sm:p-4">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Módulo / Serviço Operacional</th>
                  <th className="py-3 px-4 text-center">Categoria</th>
                  <th className="py-3 px-4 text-center">Métrica Atual</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Acesso Direto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {filteredModules.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <tr
                      key={item.id}
                      className="group transition-all duration-150 hover:bg-blue-50/40"
                    >
                      {/* # Index */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl font-mono text-xs font-black bg-slate-50 text-slate-600 border border-slate-200/80 shadow-2xs">
                          {idx + 1}
                        </span>
                      </td>

                      {/* Nome do Módulo */}
                      <td className="py-3.5 px-4">
                        <Link href={item.href} className="flex items-center gap-3.5 group/link">
                          <div className={`w-10 h-10 rounded-2xl ${item.iconBg} flex items-center justify-center shadow-xs shrink-0 transition-transform group-hover/link:scale-105`}>
                            <Icon size={18} className="stroke-[2.2]" />
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1.5 group-hover/link:text-blue-600 transition">
                              <span>{item.title}</span>
                              <ArrowUpRight size={14} className="opacity-0 group-hover/link:opacity-100 transition-opacity text-blue-600" />
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {item.subtitle}
                            </span>
                          </div>
                        </Link>
                      </td>

                      {/* Categoria */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${item.badgeColor}`}>
                          {item.categoryLabel}
                        </span>
                      </td>

                      {/* Métrica Atual */}
                      <td className="py-3.5 px-4 text-center">
                        <div>
                          <div className="font-black text-slate-800 font-mono text-xs">
                            {item.metric}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {item.submetric}
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/70 rounded-full text-[11px] font-bold shadow-2xs">
                          <Activity size={12} className="text-emerald-600" />
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Ação */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={item.href}
                          className="inline-flex items-center gap-1 px-4 py-1.5 bg-slate-50 hover:bg-blue-600 text-slate-600 hover:text-white border border-slate-200/80 hover:border-blue-600 rounded-full text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <span>Abrir</span>
                          <ArrowUpRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Rodapé do Bloco */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>
              Unidade Ativa: <strong className="text-slate-700">{data.unidade} ({data.localidade})</strong>
            </span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            DeepData v2.3 • PostgreSQL Neon • SAP Ceará
          </div>
        </div>
      </div>
    </div>
  )
}

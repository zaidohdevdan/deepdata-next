"use client"

import { useState } from "react"
import { Plus, Trash2, Save, GripVertical, Search, Activity, Package, Users, Coffee, Utensils, Flame } from "lucide-react"
import { AlaDistribData } from "@/app/actions/alimentacao"
import { AlimentacaoConfig, ConfigValues } from "@/lib/calculation"

interface AlimentacaoTableProps {
  data: AlaDistribData[]
  config: AlimentacaoConfig
  globalConfig: ConfigValues
  isPending: boolean
  onCellChange: (id: string, field: "internos" | "dietas", value: string) => void
  onDeleteAla: (id: string, name: string) => void
  onAddAlaClick: () => void
  onResetLocal: () => void
  onSave: () => void
}

const BADGE_COLOR_PALETTES = [
  "bg-amber-50 text-amber-700 border-amber-200/80",
  "bg-blue-50 text-blue-700 border-blue-200/80",
  "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "bg-purple-50 text-purple-700 border-purple-200/80",
  "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  "bg-rose-50 text-rose-700 border-rose-200/80",
]

export function AlimentacaoTable({
  data,
  config,
  globalConfig,
  isPending,
  onCellChange,
  onDeleteAla,
  onAddAlaClick,
  onResetLocal,
  onSave,
}: AlimentacaoTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = data.filter((item) =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase().trim())
  )

  // Cálculos consolidados para as 4 Abas / Cards de Status do topo (Estilo tela-tab.png)
  const totalAlas = data.length
  const totalInternos = data.reduce((acc, curr) => acc + (curr.internos || 0), 0)
  const totalDietas = data.reduce((acc, curr) => acc + (curr.dietas || 0), 0)

  // Métricas específicas do módulo
  const totalCaixas = Math.floor(
    (totalInternos - (config.modulo === "ALIMENTACAO" ? totalDietas : 0)) /
      (globalConfig.alimentacaoCaixaCapacidade || 42)
  )
  const totalPacotesPaes = Math.floor(
    (totalInternos * (globalConfig.cafePaoesPorInterno || 2)) /
      (globalConfig.cafeCapacitePacote || 80)
  )
  const totalPacotesBiscoito = Math.floor(
    (totalInternos * (globalConfig.biscoitoPorInterno || 8)) /
      (globalConfig.biscoitoCapacidadePacote || 68)
  )

  const garrafasTotais = Math.ceil(
    (totalInternos * (globalConfig.cafePaoesPorInterno || 2)) /
      ((globalConfig.cafeLitrosPorGarrafa || 40) * 5)
  )

  return (
    <div className="space-y-6">
      {/* ========================================================= */}
      {/* 4 CARDS / ABAS DE STATUS SUPERIORES (ESTILO tela-tab.png)  */}
      {/* ========================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 print:hidden">
        {/* Card 1: Aba Ativa Branca com barra lateral azul */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(20,50,110,0.06)] border border-slate-200/80 flex items-center gap-3.5 relative overflow-hidden transition-all hover:shadow-md">
          <div className="w-1.5 h-10 bg-blue-600 rounded-full shrink-0" />
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight font-mono">
              {totalAlas.toString().padStart(2, "0")}
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alas Ativas
            </div>
          </div>
        </div>

        {/* Card 2: Card Azul Real - Total Internos */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-4 shadow-md shadow-blue-600/20 flex flex-col justify-center transition-all hover:shadow-lg">
          <div className="text-2xl font-black tracking-tight font-mono">
            {totalInternos.toString().padStart(2, "0")}
          </div>
          <div className="text-xs font-semibold text-blue-100 flex items-center gap-1">
            <Users size={12} className="opacity-80" />
            <span>Total Internos</span>
          </div>
        </div>

        {/* Card 3: Card Azul Real - Caixas ou Pacotes */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-4 shadow-md shadow-blue-600/20 flex flex-col justify-center transition-all hover:shadow-lg">
          <div className="text-2xl font-black tracking-tight font-mono">
            {config.modulo === "ALIMENTACAO" && `${totalCaixas} cx`}
            {config.modulo === "CAFE" && `${totalPacotesPaes} pct`}
            {config.modulo === "BISCOITO" && `${totalPacotesBiscoito} pct`}
          </div>
          <div className="text-xs font-semibold text-blue-100 flex items-center gap-1">
            <Package size={12} className="opacity-80" />
            <span>
              {config.modulo === "ALIMENTACAO" && "Caixas Fechadas"}
              {config.modulo === "CAFE" && "Pacotes de Pães"}
              {config.modulo === "BISCOITO" && "Pacotes Biscoito"}
            </span>
          </div>
        </div>

        {/* Card 4: Card Azul Real - Dietas ou Garrafas */}
        <div className="bg-gradient-to-br from-blue-600 to-sky-700 text-white rounded-2xl p-4 shadow-md shadow-blue-600/20 flex flex-col justify-center transition-all hover:shadow-lg">
          <div className="text-2xl font-black tracking-tight font-mono">
            {config.modulo === "ALIMENTACAO" ? `${totalDietas} un` : `${garrafasTotais} gf`}
          </div>
          <div className="text-xs font-semibold text-blue-100 flex items-center gap-1">
            {config.modulo === "ALIMENTACAO" ? (
              <Utensils size={12} className="opacity-80" />
            ) : (
              <Coffee size={12} className="opacity-80" />
            )}
            <span>
              {config.modulo === "ALIMENTACAO" ? "Dietas Especiais" : "Garrafas Térmicas"}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TABELA PRINCIPAL COM DESIGN tela-tab.png                 */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] overflow-hidden flex flex-col print:border-none print:shadow-none">
        
        {/* Barra Superior da Tabela (Busca + Botão Nova Ala) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-slate-800 text-base tracking-tight">
              Distribuição por Ala
            </h3>
            <span className="text-xs font-bold font-mono px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
              {filteredData.length} registros
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Campo de Busca Rápida */}
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar ala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/80 focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none w-36 sm:w-48 transition-all font-medium text-slate-700"
              />
            </div>

            {/* Botão + Nova Ala no estilo do tela-tab */}
            <button
              onClick={onAddAlaClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-sm transition hover:shadow cursor-pointer"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>Nova Ala</span>
            </button>
          </div>
        </div>

        {/* Tabela de Dados */}
        <div className="overflow-x-auto p-2 sm:p-3">
          <table className="w-full text-left border-collapse min-w-[700px] print:min-w-0">
            <thead>
              <tr className="text-slate-400 font-bold text-[11px] uppercase tracking-wider border-b border-slate-100">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Ala / Pavilhão</th>
                <th className="py-3 px-4 text-center">Internos</th>
                {config.modulo === "ALIMENTACAO" && (
                  <>
                    <th className="py-3 px-4 text-center">Caixas ({globalConfig.alimentacaoCaixaCapacidade}un)</th>
                    <th className="py-3 px-4 text-center">Normal</th>
                    <th className="py-3 px-4 text-center">Dietas</th>
                  </>
                )}
                {config.modulo === "CAFE" && (
                  <>
                    <th className="py-3 px-4 text-center">Pacotes ({globalConfig.cafeCapacitePacote}un)</th>
                    <th className="py-3 px-4 text-center">Unidades</th>
                    <th className="py-3 px-4 text-center">Garrafas ({globalConfig.cafeLitrosPorGarrafa}L)</th>
                  </>
                )}
                {config.modulo === "BISCOITO" && (
                  <>
                    <th className="py-3 px-4 text-center">Pacotes ({globalConfig.biscoitoCapacidadePacote}un)</th>
                    <th className="py-3 px-4 text-center">Unidades</th>
                    <th className="py-3 px-4 text-center">Garrafas Suco</th>
                  </>
                )}
                <th className="py-3 px-4 text-right print:hidden">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70 text-slate-700 text-sm">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    Nenhuma ala encontrada com os filtros informados.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => {
                  const computed = config.calcularAla(
                    { id: item.id, nome: item.nome, internos: item.internos, dietas: item.dietas },
                    globalConfig
                  )
                  const badgeColor = BADGE_COLOR_PALETTES[idx % BADGE_COLOR_PALETTES.length]
                  const alaLetter = item.nome.replace(/[^a-zA-Z0-9]/g, "").charAt(0).toUpperCase() || "A"

                  return (
                    <tr
                      key={item.id}
                      className="group transition-all duration-200 hover:bg-white hover:shadow-[0_8px_30px_rgba(20,50,110,0.07)] hover:rounded-2xl border-transparent"
                    >
                      {/* Coluna 1: Grip Handle + Número Badge com cantos arredondados */}
                      <td className="py-3 px-2 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <GripVertical size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                          <div className={`w-7 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center border shadow-2xs ${badgeColor}`}>
                            {idx + 1}
                          </div>
                        </div>
                      </td>

                      {/* Coluna 2: Avatar Circular + Nome em destaque e subtítulo */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shadow-xs ring-2 ring-blue-50 shrink-0">
                            {alaLetter}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-2">
                              <span>{item.nome}</span>
                              {idx === 0 && (
                                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200/60">
                                  Destaque
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-medium">
                              Pavilhão Operacional • Ativa
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Coluna 3: Input de Quantidade de Internos */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-50/80 group-hover:bg-white border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100 rounded-xl px-2.5 py-1 transition shadow-2xs">
                          <input
                            type="number"
                            min="0"
                            value={item.internos || ""}
                            placeholder="0"
                            onChange={(e) => onCellChange(item.id, "internos", e.target.value)}
                            className="w-16 bg-transparent outline-none text-center font-black text-sm text-slate-800 font-mono print:border-none"
                          />
                        </div>
                      </td>

                      {/* Colunas Calculadas & Badges no estilo do tela-tab */}
                      {config.modulo === "ALIMENTACAO" && (
                        <>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-100/90 shadow-2xs font-mono">
                              {computed.caixas} cx
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-600 border border-sky-100/90 shadow-2xs font-mono">
                              {computed.normal} un
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 bg-orange-50/70 group-hover:bg-orange-50 border border-orange-200/80 focus-within:border-orange-500 focus-within:ring-3 focus-within:ring-orange-100 rounded-xl px-2.5 py-1 transition shadow-2xs">
                              <input
                                type="number"
                                min="0"
                                max={item.internos}
                                value={item.dietas || ""}
                                placeholder="0"
                                onChange={(e) => onCellChange(item.id, "dietas", e.target.value)}
                                className="w-14 bg-transparent outline-none text-center font-black text-sm text-orange-700 font-mono print:border-none"
                              />
                              <span className="text-[10px] text-orange-500 font-bold uppercase">dietas</span>
                            </div>
                          </td>
                        </>
                      )}

                      {config.modulo === "CAFE" && (
                        <>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-100/90 shadow-2xs font-mono">
                              {computed.pacotes} cx
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-600 border border-sky-100/90 shadow-2xs font-mono">
                              {computed.unidades} un
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs font-mono">
                              <Flame size={12} className="text-amber-500" />
                              {computed.garrafas} gf
                            </span>
                          </td>
                        </>
                      )}

                      {config.modulo === "BISCOITO" && (
                        <>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-600 border border-rose-100/90 shadow-2xs font-mono">
                              {computed.pacotes} cx
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-sky-50 text-sky-600 border border-sky-100/90 shadow-2xs font-mono">
                              {computed.unidades} un
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/90 shadow-2xs font-mono">
                              <Flame size={12} className="text-amber-500" />
                              {computed.garrafas} gf
                            </span>
                          </td>
                        </>
                      )}

                      {/* Coluna de Ações com Pílula estilo Vitals de tela-tab */}
                      <td className="py-3 px-4 text-right print:hidden">
                        <div className="flex items-center justify-end gap-2">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/90 text-slate-700 rounded-full text-[11px] font-bold shadow-2xs">
                            <Activity size={13} className="text-teal-600" />
                            <span>Ativa</span>
                          </div>
                          <button
                            onClick={() => onDeleteAla(item.id, item.nome)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Remover Ala"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé de Ações de Salvamento da Tabela */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
          <div className="text-xs text-slate-500 font-medium">
            💡 Altere os valores nas células e clique em <strong className="text-slate-700">Salvar Distribuição</strong> para persistir no banco.
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetLocal}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition cursor-pointer"
              disabled={isPending}
            >
              Descartar
            </button>
            <button
              onClick={onSave}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
              disabled={isPending}
            >
              <Save size={14} />
              <span>{isPending ? "Gravando no Banco..." : "Salvar Distribuição"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Shield, Plus, Trash2, RefreshCw, Save, Lock, Unlock } from "lucide-react"
import { Policial, PolicialFixo } from "./types"
import { useMemo, memo } from "react"

interface PostosGridProps {
  faixasHorario: { inicio: string; fim: string }[]
  basePoliciais: Policial[]
  presenceMap: Record<string, boolean>
  estado: Record<number, Record<string, string[]>>
  postosConfig: Record<string, number>
  policiaisFixos: PolicialFixo[]
  unlockedFixedTokens: string[]
  toggleFixedOfficerLock: (t: string) => void
  poolSearch: string
  setPoolSearch: (s: string) => void
  poolFilter: "unallocated" | "all"
  setPoolFilter: (f: "unallocated" | "all") => void
  isDragOverPool: boolean
  setIsDragOverPool: (d: boolean) => void
  numFaixas: number
  autoOcupar: (pps: Policial[], customPresence?: Record<string, boolean>) => void
  handleClear: () => void
  handleSave: () => void
  handleDragStart: (e: React.DragEvent, t: string) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, s: number, p: string) => void
  handleDropIntoGlobalPool: (e: React.DragEvent) => void
  handleDuplicateToken: (t: string, p: string, s: number, i: boolean) => void
  handleRemoveToken: (t: string) => void
  parseToken: (t: string) => (Policial & { slotIdx: number }) | null
  tipo: string
}

function PostosGrid({
  faixasHorario,
  basePoliciais,
  presenceMap,
  estado,
  postosConfig,
  policiaisFixos,
  unlockedFixedTokens,
  toggleFixedOfficerLock,
  poolSearch,
  setPoolSearch,
  poolFilter,
  setPoolFilter,
  isDragOverPool,
  setIsDragOverPool,
  numFaixas,
  autoOcupar,
  handleClear,
  handleSave,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDropIntoGlobalPool,
  handleDuplicateToken,
  handleRemoveToken,
  parseToken,
  tipo
}: PostosGridProps) {

  // Helper local do painel para determinar policiais penais não alocados no pool
  const unallocatedOfficers = useMemo(() => {
    const present = basePoliciais.filter((p) => presenceMap[p.matricula] !== false)
    return present.filter((p) => {
      // Verifica se está alocado em algum posto ou guarita em qualquer turno
      let allocated = false
      for (let f = 0; f < numFaixas; f++) {
        if (estado[f]) {
          for (const posto of Object.keys(estado[f])) {
            if (posto === "POOL") continue
            if (estado[f][posto]?.some((tok) => tok.includes(`PP_${p.matricula}_F`))) {
              allocated = true
              break
            }
          }
        }
        if (allocated) break
      }
      return !allocated
    })
  }, [basePoliciais, presenceMap, estado, numFaixas])

  const getOfficerAllocations = (matricula: string): { slot: number; posto: string }[] => {
    const allocs: { slot: number; posto: string }[] = []
    for (let f = 0; f < numFaixas; f++) {
      if (estado[f]) {
        for (const posto of Object.keys(estado[f])) {
          if (posto === "POOL") continue
          if (estado[f][posto]?.some((tok) => tok.includes(`PP_${matricula}_F`))) {
            allocs.push({ slot: f, posto })
          }
        }
      }
    }
    return allocs
  }

  const gridColsClass = 
    numFaixas === 1 ? "md:grid-cols-1" :
    numFaixas === 2 ? "md:grid-cols-2" :
    numFaixas === 3 ? "md:grid-cols-3" : "md:grid-cols-4"

  return (
    <div className="space-y-6">
      {/* Timeline Quick View Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm print:hidden">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Linha do Tempo dos Turnos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {faixasHorario.map((f, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl text-center">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Turno {idx + 1}</span>
              <span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
                {f.inicio} - {f.fim}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid layout for Sidebar Pool and Faixas Board */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start print:hidden">
        {/* Global Pool Sidebar Card (col-span-1) */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOverPool(false)}
          onDrop={handleDropIntoGlobalPool}
          className={`bg-white border rounded-2xl p-5 shadow-sm space-y-4 transition ${
            isDragOverPool 
              ? "border-dashed border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 scale-[1.01]" 
              : "border-slate-200/80"
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                🔄 Pool de Policiais
              </h3>
              <p className="text-[10px] text-slate-400">
                Disponíveis no plantão. Arraste para os postos ou solte aqui para remover.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar policial..."
              value={poolSearch}
              onChange={(e) => setPoolSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 placeholder-slate-400"
            />
            <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex border border-slate-100 p-0.5 rounded-lg bg-slate-50">
            <button
              type="button"
              onClick={() => setPoolFilter("unallocated")}
              className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition ${
                poolFilter === "unallocated"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Não Alocados ({unallocatedOfficers.length})
            </button>
            <button
              type="button"
              onClick={() => setPoolFilter("all")}
              className={`flex-1 text-center py-1 text-[10px] font-bold rounded-md transition ${
                poolFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              Todos ({basePoliciais.filter((p: Policial) => presenceMap[p.matricula] !== false).length})
            </button>
          </div>

          {/* Roster List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {(() => {
              const presentOfficers = basePoliciais.filter((p: Policial) => presenceMap[p.matricula] !== false)
              const filteredList = (poolFilter === "unallocated" ? unallocatedOfficers : presentOfficers)
                .filter((p: Policial) => {
                  const search = poolSearch.toLowerCase().trim()
                  if (!search) return true
                  return (p.qra || p.nome).toLowerCase().includes(search) || p.nome.toLowerCase().includes(search) || p.matricula.includes(search)
                })

              if (filteredList.length === 0) {
                return (
                  <div className="text-center py-8 text-[11px] text-slate-355 italic">
                    Nenhum policial encontrado
                  </div>
                )
              }

              return filteredList.map((pp: Policial) => {
                const allocs = getOfficerAllocations(pp.matricula)
                const isAllocated = allocs.length > 0

                return (
                  <div
                    key={pp.matricula}
                    draggable
                    onDragStart={(e) => handleDragStart(e, `GLOBAL_PP_${pp.matricula}`)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing select-none transition hover:bg-slate-50 group/pool ${
                      isAllocated
                        ? "bg-slate-50/50 border-slate-200 text-slate-700"
                        : "bg-white border-slate-200 text-slate-800 shadow-xs hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="truncate pr-2">
                        <div className="font-extrabold text-slate-850 truncate">{pp.qra || pp.nome}</div>
                        <div className="text-[9px] text-slate-400 font-mono mt-0.5">{pp.matricula}</div>
                      </div>
                      <span className={`w-2 h-2 rounded-full ${isAllocated ? "bg-blue-500" : "bg-emerald-500"}`} title={isAllocated ? "Alocado" : "Livre"} />
                    </div>
                    {allocs.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {allocs.map((al, idx) => (
                          <span
                            key={idx}
                            className="text-[8px] px-1.5 py-0.5 font-bold rounded-md bg-slate-900 text-white leading-none uppercase"
                          >
                            F{al.slot + 1} - {al.posto}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Main Timeline/Faixas Grid Board (col-span-3) */}
        <div className="xl:col-span-3 space-y-6 animate-none">
          <div className={`grid gap-6 grid-cols-1 ${gridColsClass}`}>
            {Array.from({ length: numFaixas }).map((_, f) => {
              const slotTime = faixasHorario[f] || { inicio: "--:--", fim: "--:--" }

              return (
                <div key={f} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col space-y-4 shadow-sm">
                  {/* Slot Header */}
                  <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">Turno {f + 1}</h4>
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        {slotTime.inicio} - {slotTime.fim}
                      </span>
                    </div>
                  </div>

                  {/* Post Positions Stack */}
                  <div className="space-y-3">
                    {Object.keys(postosConfig).map((posto) => {
                      const allocatedIds = estado[f]?.[posto] || []

                      return (
                        <div
                          key={posto}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, f, posto)}
                          className={`p-3 border rounded-xl transition ${
                            allocatedIds.length === 0
                              ? "bg-amber-50/10 border-amber-200/50 border-dashed"
                              : "bg-white border-slate-200 shadow-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-slate-800">{posto}</span>
                            <span className="text-[9px] font-bold text-slate-400 font-mono">
                              {allocatedIds.length} PP
                            </span>
                          </div>

                          <div className="space-y-1.5 min-h-[40px] flex flex-col justify-center">
                            {allocatedIds.map((tid) => {
                              const pp = parseToken(tid)
                              if (!pp) return null
                              const isFixed = !tid.includes("_DUP_") && policiaisFixos.some(
                                (fixed) =>
                                  fixed.matricula === pp.matricula &&
                                  fixed.posto === posto &&
                                  fixed.faixa === `Faixa ${f + 1}`
                              )
                              const isUnlocked = isFixed && unlockedFixedTokens.includes(tid)

                              return (
                                <div
                                  key={tid}
                                  draggable={!isFixed || isUnlocked}
                                  onDragStart={(e) => (!isFixed || isUnlocked) && handleDragStart(e, tid)}
                                  className={`p-2 rounded-lg text-xs font-bold flex items-center justify-between select-none ${
                                    isFixed
                                      ? isUnlocked
                                        ? "bg-blue-500 hover:bg-blue-600 text-white border border-blue-400 cursor-grab active:cursor-grabbing transition-all shadow-sm"
                                        : "bg-blue-600 text-white border border-blue-700 cursor-not-allowed"
                                      : "bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-850 transition-colors"
                                  }`}
                                  title={isFixed ? (isUnlocked ? "Policial fixado (Desafixado temporariamente) - Arraste para mover" : "Policial fixado via configurações - Clique no cadeado para desafixar") : "Arraste para mover"}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="truncate">
                                      <div className="font-extrabold flex items-center gap-1.5 truncate">
                                        {pp.qra || pp.nome} 
                                        {isFixed && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              toggleFixedOfficerLock(tid)
                                            }}
                                            className="p-0.5 hover:bg-white/20 rounded text-white transition-colors cursor-pointer border-0 bg-transparent"
                                            title={isUnlocked ? "Bloquear/Fixar novamente" : "Desafixar e habilitar arraste"}
                                          >
                                            {isUnlocked ? (
                                              <Unlock size={10} className="text-blue-100" />
                                            ) : (
                                              <Lock size={10} className="fill-white/20 text-white" />
                                            )}
                                          </button>
                                        )}
                                      </div>
                                      <div className="text-[9px] text-slate-350 font-mono leading-none">{pp.matricula}</div>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0 ml-2">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDuplicateToken(tid, posto, f, false)
                                        }}
                                        className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer border-0 bg-transparent"
                                        title="Duplicar"
                                      >
                                        <Plus size={11} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveToken(tid)
                                        }}
                                        className="p-1 hover:bg-rose-900/40 rounded text-rose-400 hover:text-rose-300 transition cursor-pointer border-0 bg-transparent"
                                        title="Remover"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                            {allocatedIds.length === 0 && (
                              <span className="text-[10px] text-slate-300 italic text-center py-2 select-none">
                                — VAGO —
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating Action Buttons Panel */}
      <div className="print:hidden fixed bottom-6 right-6 z-40 flex flex-col sm:flex-row gap-2 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/85 shadow-2xl">
        <button
          onClick={() => autoOcupar([])}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition cursor-pointer select-none group border border-slate-700"
          title="Auto-Ocupar Postos"
        >
          <RefreshCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
          Auto-Ocupar
        </button>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer select-none border-0"
          title="Limpar todos os postos"
        >
          <Trash2 size={13} />
          Limpar Postos
        </button>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer select-none border-0"
          title="Gravar a escala no navegador"
        >
          <Save size={13} />
          Gravar Escala
        </button>
      </div>
    </div>
  )
}

export default memo(PostosGrid)

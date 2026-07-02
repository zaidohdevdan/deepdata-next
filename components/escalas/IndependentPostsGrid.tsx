import { Shield, Plus, Trash2 } from "lucide-react"
import { Policial, PolicialFixo, INDEPENDENT_POSTS } from "./types"

interface IndependentPostsGridProps {
  tipo: string
  independentHorarios: Record<string, string[]>
  setIndependentHorarios: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
  independentEstado: Record<string, Record<number, string[]>>
  policiaisFixos: PolicialFixo[]
  handleDragStart: (e: React.DragEvent, t: string) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent, s: number, p: string) => void
  handleDuplicateToken: (t: string, p: string, s: number, i: boolean) => void
  handleRemoveToken: (t: string) => void
  parseToken: (t: string) => (Policial & { slotIdx: number }) | null
}

export default function IndependentPostsGrid({
  tipo,
  independentHorarios,
  setIndependentHorarios,
  independentEstado,
  policiaisFixos,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDuplicateToken,
  handleRemoveToken,
  parseToken
}: IndependentPostsGridProps) {
  if (tipo !== "noturna") return null

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4 print:hidden">
      <div className="border-b border-slate-100 pb-2">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Shield size={16} className="text-blue-600" /> Postos Especiais (Guaritas G1, G3, G5, G6 & Tenda ABC)
        </h3>
        <p className="text-[11px] text-slate-500">
          Estas posições têm 4 faixas de horários editáveis em linha e independentes das demais escalas.
        </p>
      </div>

      <div className="space-y-4">
        {INDEPENDENT_POSTS.map((gId) => (
          <div key={gId} className="border border-slate-150 rounded-xl p-3 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">{gId}</span>
              <span className="text-[10px] text-slate-400 font-medium">4 Turnos / Faixas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, slotIdx) => {
                const timeVal = independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00"
                const allocatedTokens = independentEstado[gId]?.[slotIdx] || []

                return (
                  <div
                    key={slotIdx}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slotIdx, gId)}
                    className={`p-2.5 border rounded-lg bg-white transition flex flex-col justify-between min-h-[100px] ${
                      allocatedTokens.length === 0
                        ? "border-dashed border-slate-200"
                        : "border-slate-250 shadow-xs"
                    }`}
                  >
                    <div className="space-y-1 mb-2">
                      <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Faixa {slotIdx + 1}</span>
                      <input
                        type="text"
                        value={timeVal}
                        onChange={(e) => {
                          const newval = e.target.value
                          setIndependentHorarios((prev) => {
                            const updated = { ...prev }
                            if (!updated[gId]) updated[gId] = []
                            updated[gId][slotIdx] = newval
                            return updated
                          })
                        }}
                        placeholder="Horário"
                        className="w-full bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-750 font-mono outline-none focus:border-slate-350"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 flex flex-col justify-center min-h-[40px] bg-slate-50/30 rounded border border-slate-100/50 p-1">
                      {allocatedTokens.map((tid) => {
                        const pp = parseToken(tid)
                        if (!pp) return null
                        const isFixed = !tid.includes("_DUP_") && policiaisFixos.some(
                          (fixed) =>
                            fixed.matricula === pp.matricula &&
                            fixed.posto === gId &&
                            fixed.faixa === `Faixa ${slotIdx + 1}`
                        )

                        return (
                          <div
                            key={tid}
                            draggable={!isFixed}
                            onDragStart={(e) => !isFixed && handleDragStart(e, tid)}
                            className={`p-1.5 rounded text-[11px] font-bold flex items-center justify-between select-none ${
                              isFixed
                                ? "bg-blue-600 text-white"
                                : "bg-slate-900 text-white cursor-grab active:cursor-grabbing hover:bg-slate-850"
                            }`}
                            title={isFixed ? "Policial fixado" : "Arraste para mover"}
                          >
                            <div className="truncate pr-1">
                              <div className="truncate font-extrabold flex items-center gap-1">
                                {pp.qra || pp.nome} {isFixed && <Shield size={8} className="shrink-0" />}
                              </div>
                              <div className="text-[8px] text-slate-400 font-mono leading-tight">{pp.matricula}</div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDuplicateToken(tid, gId, slotIdx, true)
                                }}
                                className="p-0.5 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer border-0 bg-transparent"
                                title="Duplicar"
                              >
                                <Plus size={10} />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveToken(tid)
                                }}
                                className="p-0.5 hover:bg-rose-900/40 rounded text-rose-350 hover:text-rose-250 cursor-pointer border-0 bg-transparent"
                                title="Remover"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                      {allocatedTokens.length === 0 && (
                        <span className="text-[9px] text-slate-300 italic text-center py-1">
                          — VAGO —
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

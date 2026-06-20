"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, RefreshCw, Printer, AlertCircle, Shield, Plus, Copy } from "lucide-react"
import { toast } from "sonner"

interface Policial {
  nome: string
  matricula: string
}

interface FaixaHorario {
  inicio: string
  fim: string
}

interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

const POSTOS_CONFIG: Record<string, number> = {
  "P2": 1,
  "VISOR": 1,
  "CONTROLE": 1,
  "SUP ABC": 2,
  "SUP DEF": 2,
}

const INDEPENDENT_POSTS = ["G1", "G3", "G5", "G6", "TENDA ABC"]

const DEFAULT_INDEPENDENT_HORARIOS: Record<string, string[]> = {
  G1: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G3: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G5: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  G6: ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
  "TENDA ABC": ["00:00 - 06:00", "06:00 - 12:00", "12:00 - 18:00", "18:00 - 00:00"],
}

const DEFAULT_INDEPENDENT_ESTADO: Record<string, Record<number, string[]>> = {
  G1: { 0: [], 1: [], 2: [], 3: [] },
  G3: { 0: [], 1: [], 2: [], 3: [] },
  G5: { 0: [], 1: [], 2: [], 3: [] },
  G6: { 0: [], 1: [], 2: [], 3: [] },
  "TENDA ABC": { 0: [], 1: [], 2: [], 3: [] },
}

const LS_KEY = "escalaUPI4_faixas_v1"

// Helper calculation functions (defined outside component to prevent re-creation/warnings)
const minutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number)
  return h * 60 + m
}

const toHHMM = (min: number) => {
  const h = Math.floor(min / 60) % 24
  const m = Math.floor(min % 60)
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0")
}

const calcularFaixas = (iniStr: string, endStr: string, n: number): FaixaHorario[] => {
  if (!iniStr || !endStr || !n) return []
  const ini = minutes(iniStr)
  let end = minutes(endStr)
  if (end <= ini) end += 24 * 60 // crosses midnight
  const total = end - ini
  const step = total / n

  const out: FaixaHorario[] = []
  for (let i = 0; i < n; i++) {
    const a = ini + step * i
    const b = ini + step * (i + 1)
    out.push({ inicio: toHHMM(a), fim: toHHMM(b) })
  }
  return out
}

const tokenId = (matricula: string, slotIdx: number) => {
  return `PP_${matricula.replace(/\s/g, "")}_F${slotIdx}`
}

interface PolicialEquipe {
  nome: string
  matricula: string
}

interface EscalasContainerProps {
  policiaisFixos: PolicialFixo[]
  currentUser: { username: string; name: string; role: string } | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
}

export default function EscalasContainer({
  policiaisFixos,
  currentUser,
  equipeAlfa,
  equipeBravo,
  equipeEcho,
  equipeFox
}: EscalasContainerProps) {
  const [chefe, setChefe] = useState("")
  const [equipe, setEquipe] = useState("")
  const [dataEscala, setDataEscala] = useState("")
  const [horaInicio, setHoraInicio] = useState("00:00")
  const [horaFim, setHoraFim] = useState("06:00")
  const [numFaixas, setNumFaixas] = useState(2)
  const [basePoliciais, setBasePoliciais] = useState<Policial[]>([])
  const [estado, setEstado] = useState<Record<number, Record<string, string[]>>>({})
  const [draggedToken, setDraggedToken] = useState<string | null>(null)

  // Map of team members' presence
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({})

  // Automatically load team based on logged user
  useEffect(() => {
    if (!currentUser) return
    const uname = currentUser.username.toLowerCase()
    
    let selectedTeamList: PolicialEquipe[] = []
    let teamName = ""
    
    if (uname === "alfa") {
      selectedTeamList = equipeAlfa
      teamName = "ALFA"
    } else if (uname === "bravo") {
      selectedTeamList = equipeBravo
      teamName = "BRAVO"
    } else if (uname === "charlie") {
      // Echo team is mapped to Charlie login
      selectedTeamList = equipeEcho
      teamName = "ECHO"
    } else if (uname === "delta") {
      // Fox team is mapped to Delta login
      selectedTeamList = equipeFox
      teamName = "FOX"
    }
    
    if (selectedTeamList.length > 0) {
      setEquipe(teamName)
      // Check if localStorage already has data, if not auto-populate
      const localData = localStorage.getItem(LS_KEY)
      if (!localData) {
        setBasePoliciais(selectedTeamList)
        // Set everyone present by default
        const initPresence: Record<string, boolean> = {}
        selectedTeamList.forEach(p => {
          initPresence[p.matricula] = true
        })
        setPresenceMap(initPresence)
      }
    }
  }, [currentUser, equipeAlfa, equipeBravo, equipeEcho, equipeFox])

  // Guaritas & Tenda ABC independent states
  const [independentHorarios, setIndependentHorarios] = useState<Record<string, string[]>>(DEFAULT_INDEPENDENT_HORARIOS)
  const [independentEstado, setIndependentEstado] = useState<Record<string, Record<number, string[]>>>(DEFAULT_INDEPENDENT_ESTADO)

  // Derived state (no state/effect cascade needed)
  const faixasHorario = calcularFaixas(horaInicio, horaFim, numFaixas)

  // Parse token back to PP info
  const parseToken = (tid: string): (Policial & { slotIdx: number }) | null => {
    // Format: PP_MATRICULA_F{slot}_...
    const match = tid.match(/^PP_(.+?)_F(\d+)(?:_.*)?$/)
    if (!match) return null
    const matricula = match[1]
    const slotIdx = Number(match[2])
    const pp = basePoliciais.find((p) => p.matricula === matricula)
    return {
      nome: pp?.nome || "Policial",
      matricula,
      slotIdx
    }
  }

  // 1. Initial State Setup
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setDataEscala(today)
  }, [])

  // Calculate slots on time/slots changes
  useEffect(() => {
    // Rebuild/adjust empty slots structure in estado
    setEstado((prev) => {
      const novo: Record<number, Record<string, string[]>> = {}
      for (let f = 0; f < numFaixas; f++) {
        novo[f] = { POOL: [] }
        for (const posto of Object.keys(POSTOS_CONFIG)) {
          novo[f][posto] = prev[f]?.[posto] || []
        }

        // Auto-inject fixed PPs into their configured posts if they are present in basePoliciais
        const faixaName = `Faixa ${f + 1}`
        policiaisFixos.forEach((fixed) => {
          if (fixed.faixa === faixaName) {
            const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
            if (pp) {
              const token = tokenId(pp.matricula, f)
              const isAllocated = Object.keys(POSTOS_CONFIG).some((posto) =>
                novo[f][posto].includes(token)
              )
              if (!isAllocated && novo[f][fixed.posto]) {
                novo[f][fixed.posto].push(token)
              }
            }
          }
        })

        // Fill POOL with any PPs not currently in postos
        const allocatedMatriculas = new Set<string>()
        for (const posto of Object.keys(POSTOS_CONFIG)) {
          ;(novo[f]?.[posto] || []).forEach((id) => {
            const parsed = parseToken(id)
            if (parsed) {
              allocatedMatriculas.add(parsed.matricula)
            }
          })
        }

        // Also check allocated in independentEstado to remove them from pool
        INDEPENDENT_POSTS.forEach((gId) => {
          for (let sIdx = 0; sIdx < 4; sIdx++) {
            if (sIdx === f) {
              ;(independentEstado[gId]?.[sIdx] || []).forEach((id) => {
                const parsed = parseToken(id)
                if (parsed) {
                  allocatedMatriculas.add(parsed.matricula)
                }
              })
            }
          }
        })

        // Find PPs that belong to this slot (only if they are present)
        const slotPool: string[] = []
        basePoliciais.forEach((pp) => {
          const isPresent = presenceMap[pp.matricula] !== false
          if (isPresent && !allocatedMatriculas.has(pp.matricula)) {
            slotPool.push(tokenId(pp.matricula, f))
          }
        })
        novo[f].POOL = slotPool
      }
      return novo
    })
  }, [numFaixas, basePoliciais, policiaisFixos, independentEstado, presenceMap])

  // Load from Storage
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (parsed.chefe) setChefe(parsed.chefe)
      if (parsed.equipe) setEquipe(parsed.equipe)
      if (parsed.data) setDataEscala(parsed.data)
      if (parsed.horaInicio) setHoraInicio(parsed.horaInicio)
      if (parsed.horaFim) setHoraFim(parsed.horaFim)
      if (parsed.faixas) setNumFaixas(Number(parsed.faixas))
      if (parsed.basePoliciais) setBasePoliciais(parsed.basePoliciais)
      if (parsed.estado) setEstado(parsed.estado)
      if (parsed.independentEstado) setIndependentEstado(parsed.independentEstado)
      if (parsed.independentHorarios) setIndependentHorarios(parsed.independentHorarios)
      if (parsed.presenceMap) setPresenceMap(parsed.presenceMap)
    } catch {
      // Ignored
    }
  }, [])

  // Save to localStorage
  const handleSave = () => {
    const payload = {
      chefe,
      equipe,
      data: dataEscala,
      horaInicio,
      horaFim,
      faixas: numFaixas,
      basePoliciais,
      estado,
      independentEstado,
      independentHorarios,
      presenceMap,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
    toast.success("Escala gravada no navegador!")
  }

  // Clear all
  const handleClear = () => {
    if (!confirm("Deseja realmente limpar toda a escala?")) return
    localStorage.removeItem(LS_KEY)
    setBasePoliciais([])
    setEstado({})
    setIndependentEstado(DEFAULT_INDEPENDENT_ESTADO)
    setIndependentHorarios(DEFAULT_INDEPENDENT_HORARIOS)
    setPresenceMap({})
    toast.success("Escala limpa.")
  }

  // CSV parsing
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return

      const lines = text.split(/\r?\n/)
      const temp: Policial[] = []

      lines.forEach((line) => {
        if (!line.trim()) return
        const parts = line.includes(";") ? line.split(";") : line.split(",")
        if (parts.length >= 2) {
          const nome = parts[0].trim().toUpperCase()
          const matricula = parts[1].trim()
          if (nome && matricula) {
            temp.push({ nome, matricula })
          }
        }
      })

      // Remove duplicates
      const seen = new Set<string>()
      const unique = temp.filter((p) => {
        if (seen.has(p.matricula)) return false
        seen.add(p.matricula)
        return true
      })

      setBasePoliciais(unique)
      
      // Auto-set CSV officers presence to true
      const initPresence: Record<string, boolean> = {}
      unique.forEach(p => {
        initPresence[p.matricula] = true
      })
      setPresenceMap(initPresence)

      toast.success(`${unique.length} Policiais Penais carregados!`)

      // Auto assign after parsing
      setTimeout(() => autoOcupar(unique, initPresence), 50)
    }
    reader.readAsText(file)
  }

  // Automatic distribution algorithm
  const autoOcupar = (pps: Policial[], customPresence?: Record<string, boolean>) => {
    const activePresence = customPresence || presenceMap
    const allPPs = pps.length > 0 ? pps : basePoliciais
    // Only distribute present officers
    const activePPs = allPPs.filter(p => activePresence[p.matricula] !== false)

    if (activePPs.length === 0) {
      toast.error("Nenhum policial marcado como presente para distribuir.")
      return
    }

    const novoEstado: Record<number, Record<string, string[]>> = {}
    for (let f = 0; f < numFaixas; f++) {
      novoEstado[f] = { POOL: [] }
      for (const posto of Object.keys(POSTOS_CONFIG)) {
        novoEstado[f][posto] = []
      }

      // 1. Pre-assign fixed PPs from activePPs
      const faixaName = `Faixa ${f + 1}`
      const fixedForFaixa = policiaisFixos.filter((p) => p.faixa === faixaName)

      fixedForFaixa.forEach((fixed) => {
        const pp = activePPs.find((p) => p.matricula === fixed.matricula)
        if (pp) {
          const token = tokenId(pp.matricula, f)
          if (novoEstado[f][fixed.posto]) {
            novoEstado[f][fixed.posto].push(token)
          }
        }
      })
    }

    let ppIndex = 0
    const totalPP = activePPs.length

    // 2. Assign main postos sequentially for remaining non-fixed PPs
    for (let f = 0; f < numFaixas; f++) {
      for (const [posto, limit] of Object.entries(POSTOS_CONFIG)) {
        if (posto === "CONTROLE") continue // Controle handles excess

        const currentCount = novoEstado[f][posto].length
        const slotsNeeded = limit - currentCount

        for (let i = 0; i < slotsNeeded; i++) {
          while (ppIndex < totalPP) {
            const pp = activePPs[ppIndex]
            const token = tokenId(pp.matricula, f)

            // Check if this PP is already allocated in any post for slot f
            const isAlreadyAllocated = Object.values(novoEstado[f]).some((list) =>
              list.includes(token)
            )

            if (!isAlreadyAllocated) {
              novoEstado[f][posto].push(token)
              ppIndex++
              break
            }
            ppIndex++
          }
        }
      }
    }

    // Remaining PPs go to CONTROLE round-robin
    let fControle = 0
    for (let i = ppIndex; i < totalPP; i++) {
      const pp = activePPs[i]
      
      // Find the next slot f where this PP is not already allocated to something else
      let targetSlot = fControle
      let found = false
      
      for (let attempt = 0; attempt < numFaixas; attempt++) {
        const s = (fControle + attempt) % numFaixas
        const token = tokenId(pp.matricula, s)
        const isAlreadyAllocated = Object.values(novoEstado[s]).some((list) =>
          list.includes(token)
        )
        if (!isAlreadyAllocated) {
          targetSlot = s
          found = true
          break
        }
      }
      
      const token = tokenId(pp.matricula, targetSlot)
      novoEstado[targetSlot]["CONTROLE"].push(token)
      fControle = (targetSlot + 1) % numFaixas
    }

    // Repopulate POOL for all slots with missing PPs
    for (let s = 0; s < numFaixas; s++) {
      const allocated = new Set<string>()
      for (const p of Object.keys(POSTOS_CONFIG)) {
        ;(novoEstado[s]?.[p] || []).forEach((t) => allocated.add(t))
      }

      const pool: string[] = []
      activePPs.forEach((pp) => {
        const tid = tokenId(pp.matricula, s)
        if (!allocated.has(tid)) {
          pool.push(tid)
        }
      })
      novoEstado[s].POOL = pool
    }

    setEstado(novoEstado)
    toast.success("Ocupação automática concluída!")
  }

  // HTML5 Drag and Drop events handlers
  const handleDragStart = (e: React.DragEvent, token: string) => {
    setDraggedToken(token)
    e.dataTransfer.setData("text/plain", token)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, destSlot: number, destPosto: string) => {
    e.preventDefault()
    const token = e.dataTransfer.getData("text/plain") || draggedToken
    if (!token) return

    const parsed = parseToken(token)
    if (!parsed) return

    const isDestIndependent = INDEPENDENT_POSTS.includes(destPosto)
    const destToken = token.includes("_F" + destSlot) ? token : `PP_${parsed.matricula}_F${destSlot}_MOVE_${Math.random().toString(36).substr(2, 5)}`

    // Remove token from previous locations in standard slots
    setEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((sKey) => {
        const s = Number(sKey)
        next[s] = {}
        Object.keys(prev[s]).forEach((pKey) => {
          next[s][pKey] = (prev[s][pKey] || []).filter((t) => t !== token)
        })
      })

      if (!isDestIndependent) {
        if (!next[destSlot]) next[destSlot] = {}
        const currentList = next[destSlot][destPosto] || []
        next[destSlot][destPosto] = [...currentList, destToken]
      }
      return next
    })

    // Remove token from previous locations in independent slots
    setIndependentEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((pKey) => {
        next[pKey] = {}
        Object.keys(prev[pKey]).forEach((sKey) => {
          const s = Number(sKey)
          next[pKey][s] = (prev[pKey][s] || []).filter((t) => t !== token)
        })
      })

      if (isDestIndependent) {
        if (!next[destPosto]) next[destPosto] = {}
        next[destPosto][destSlot] = [destToken]
      }
      return next
    })

    setDraggedToken(null)
  }

  const handleRemoveToken = (token: string) => {
    setEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((sKey) => {
        const s = Number(sKey)
        next[s] = {}
        Object.keys(prev[s]).forEach((pKey) => {
          next[s][pKey] = (prev[s][pKey] || []).filter((t) => t !== token)
        })
      })
      return next
    })
    setIndependentEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((pKey) => {
        next[pKey] = {}
        Object.keys(prev[pKey]).forEach((sKey) => {
          const s = Number(sKey)
          next[pKey][s] = (prev[pKey][s] || []).filter((t) => t !== token)
        })
      })
      return next
    })
    toast.success("Policial removido com sucesso.")
  }

  const handleDuplicateToken = (token: string, posto: string, slotIdx: number, isIndependent: boolean) => {
    const parsed = parseToken(token)
    if (!parsed) return

    const dupToken = `PP_${parsed.matricula}_F${slotIdx}_DUP_${Math.random().toString(36).substr(2, 5)}`

    if (isIndependent) {
      setIndependentEstado((prev) => {
        const next = {} as typeof prev
        Object.keys(prev).forEach((pKey) => {
          next[pKey] = {}
          Object.keys(prev[pKey]).forEach((sKey) => {
            const s = Number(sKey)
            next[pKey][s] = [...(prev[pKey][s] || [])]
          })
        })
        
        if (!next[posto]) next[posto] = {}
        const currentList = next[posto][slotIdx] || []
        next[posto][slotIdx] = [...currentList, dupToken]
        return next
      })
    } else {
      setEstado((prev) => {
        const next = {} as typeof prev
        Object.keys(prev).forEach((sKey) => {
          const s = Number(sKey)
          next[s] = {}
          Object.keys(prev[s]).forEach((pKey) => {
            next[s][pKey] = [...(prev[s][pKey] || [])]
          })
        })

        if (!next[slotIdx]) next[slotIdx] = {}
        const currentList = next[slotIdx][posto] || []
        next[slotIdx][posto] = [...currentList, dupToken]
        return next
      })
    }
    toast.success(`Policial ${parsed.nome} duplicado no mesmo posto.`)
  }
  return (
    <div className="space-y-6">
      {/* -------------------- INTERACTIVE SCREEN UI (HIDDEN ON PRINT) -------------------- */}
      <div className="print:hidden space-y-6">
        {/* Roster Header Toolbar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🛡️</span>
              <h1 className="text-2xl font-bold tracking-tight">Escalas de Plantão UPI-4</h1>
            </div>
            <p className="text-white/80 text-sm">
              Carregue a lista de policiais por CSV, defina a divisão de faixas horárias e arraste para organizar o plantão.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-slate-800 hover:bg-slate-100 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Printer size={14} /> Imprimir Escala
            </button>
            <button
              onClick={() => autoOcupar([])}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-white rounded-xl border border-slate-700 shadow-sm transition cursor-pointer"
            >
              <RefreshCw size={14} /> Auto-Ocupar
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition cursor-pointer"
            >
              Gravar Escala
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition cursor-pointer"
            >
              <Trash2 size={14} /> Limpar
            </button>
          </div>
        </div>

        {/* Configuration Settings Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Chefe de Equipe
            </label>
            <input
              type="text"
              placeholder="Nome do Chefe"
              value={chefe}
              onChange={(e) => setChefe(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Nome da Equipe
            </label>
            <input
              type="text"
              placeholder="EX: EQUIPE A"
              value={equipe}
              onChange={(e) => setEquipe(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Data do Plantão
            </label>
            <input
              type="date"
              value={dataEscala}
              onChange={(e) => setDataEscala(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Hora Início
            </label>
            <input
              type="time"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Hora Fim
            </label>
            <input
              type="time"
              value={horaFim}
              onChange={(e) => setHoraFim(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Faixas/Subdivisões
            </label>
            <select
              value={numFaixas}
              onChange={(e) => setNumFaixas(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
            >
              <option value={1}>1 Faixa</option>
              <option value={2}>2 Faixas</option>
              <option value={3}>3 Faixas</option>
              <option value={4}>4 Faixas</option>
            </select>
          </div>
        </div>

        {/* CSV Drag and Drop Upload Area */}
        {basePoliciais.length === 0 && (
          <div className="bg-white border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-3xl p-10 text-center transition flex flex-col items-center justify-center space-y-3">
            <div className="p-3 bg-slate-50 rounded-full text-slate-500">
              <Upload size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800 text-sm">Carregar Policiais Penais</h3>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed mx-auto">
                Selecione um arquivo <strong>.csv</strong> contendo a lista dos servidores escalados para o plantão.
              </p>
              <small className="block text-[10px] text-slate-400 font-mono mt-1">
                Formato: nome_do_policial,matricula_do_policial (por linha)
              </small>
            </div>
            <input
              type="file"
              onChange={handleCSVUpload}
              accept=".csv, text/csv"
              className="hidden"
              id="csv-file-input"
            />
            <button
              onClick={() => document.getElementById("csv-file-input")?.click()}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition cursor-pointer"
            >
              Selecionar CSV
            </button>
          </div>
        )}

        {/* Interactive Drag & Drop Board */}
        {basePoliciais.length > 0 && (
          <div className="space-y-6">
            {/* Presence Checklist Box */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                    📋 Controle de Presença do Efetivo ({basePoliciais.filter(p => presenceMap[p.matricula] !== false).length} / {basePoliciais.length} Presentes)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Desmarque os policiais que faltaram ou estão de licença antes de realizar a auto-ocupação.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const allOn: Record<string, boolean> = {}
                      basePoliciais.forEach(p => allOn[p.matricula] = true)
                      setPresenceMap(allOn)
                      toast.success("Todos marcados como presentes.")
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    Marcar Todos
                  </button>
                  <button
                    onClick={() => {
                      const allOff: Record<string, boolean> = {}
                      basePoliciais.forEach(p => allOff[p.matricula] = false)
                      setPresenceMap(allOff)
                      toast.success("Todos marcados como ausentes.")
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    Desmarcar Todos
                  </button>
                  {currentUser && (
                    <button
                      onClick={() => {
                        const uname = currentUser.username.toLowerCase()
                        let selectedTeamList: PolicialEquipe[] = []
                        if (uname === "alfa") selectedTeamList = equipeAlfa
                        else if (uname === "bravo") selectedTeamList = equipeBravo
                        else if (uname === "charlie") selectedTeamList = equipeEcho
                        else if (uname === "delta") selectedTeamList = equipeFox

                        if (selectedTeamList.length > 0) {
                          setBasePoliciais(selectedTeamList)
                          const initPresence: Record<string, boolean> = {}
                          selectedTeamList.forEach(p => {
                            initPresence[p.matricula] = true
                          })
                          setPresenceMap(initPresence)
                          toast.success("Escala recarregada com o efetivo padrão da equipe!")
                        } else {
                          toast.error("Nenhuma equipe vinculada a este usuário.")
                        }
                      }}
                      className="px-2.5 py-1 text-[10px] font-bold bg-slate-800 hover:bg-slate-750 text-white rounded-lg transition"
                    >
                      Recarregar Efetivo
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {basePoliciais.map((pp) => {
                  const isPresent = presenceMap[pp.matricula] !== false
                  return (
                    <div
                      key={pp.matricula}
                      onClick={() => {
                        setPresenceMap(prev => ({
                          ...prev,
                          [pp.matricula]: !isPresent
                        }))
                      }}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition select-none ${
                        isPresent
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 transition ${
                        isPresent
                          ? "bg-white border-white text-slate-900"
                          : "border-slate-300 bg-white"
                      }`}>
                        {isPresent && <span className="text-[10px] leading-none">✓</span>}
                      </div>
                      <div className="truncate">
                        <div className="truncate text-[11px] leading-tight font-extrabold">{pp.nome}</div>
                        <div className={`text-[9px] font-mono leading-none ${isPresent ? "text-slate-400" : "text-slate-400"}`}>{pp.matricula}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timeline Quick View Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Linha do Tempo das Faixas</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {faixasHorario.map((f, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/50 p-3 rounded-xl text-center">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase">Faixa {idx + 1}</span>
                    <span className="text-xs font-extrabold text-slate-800 font-mono mt-0.5 block">
                      {f.inicio} - {f.fim}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid columns of Slots / Faixas */}
            <div className={`grid gap-6 grid-cols-1 md:grid-cols-${numFaixas}`}>
              {Array.from({ length: numFaixas }).map((_, f) => {
                const slotTime = faixasHorario[f] || { inicio: "--:--", fim: "--:--" }

                return (
                  <div key={f} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col space-y-4">
                    {/* Slot Header */}
                    <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-800">Faixa {f + 1}</h4>
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          {slotTime.inicio} - {slotTime.fim}
                        </span>
                      </div>
                    </div>

                    {/* Pool Zone (only visible during setup) */}
                    <div 
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, f, "POOL")}
                      className="p-3 bg-white border border-slate-200 rounded-xl min-h-[80px] space-y-2"
                    >
                      <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                        🔄 Pool ({estado[f]?.POOL?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(estado[f]?.POOL || []).map((tid) => {
                          const pp = parseToken(tid)
                          if (!pp) return null
                          return (
                            <div
                              key={tid}
                              draggable
                              onDragStart={(e) => handleDragStart(e, tid)}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded text-[11px] font-semibold text-slate-700 cursor-grab active:cursor-grabbing select-none"
                            >
                              {pp.nome}
                            </div>
                          )
                        })}
                        {(estado[f]?.POOL || []).length === 0 && (
                          <span className="text-[10px] text-slate-300 italic">Todos alocados</span>
                        )}
                      </div>
                    </div>

                    {/* Post Positions Stack */}
                    <div className="space-y-3">
                      {Object.keys(POSTOS_CONFIG).map((posto) => {
                        const limit = POSTOS_CONFIG[posto]
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
                              <span className="text-[9px] font-bold text-slate-400">
                                {allocatedIds.length} / {limit} PP
                              </span>
                            </div>

                            <div className="space-y-1.5 min-h-[40px] flex flex-col justify-center">
                              {allocatedIds.map((tid) => {
                                const pp = parseToken(tid)
                                if (!pp) return null
                                const isFixed = policiaisFixos.some(
                                  (fixed) =>
                                    fixed.matricula === pp.matricula &&
                                    fixed.posto === posto &&
                                    fixed.faixa === `Faixa ${f + 1}`
                                )

                                return (
                                  <div
                                    key={tid}
                                    draggable={!isFixed}
                                    onDragStart={(e) => !isFixed && handleDragStart(e, tid)}
                                    className={`p-2 rounded-lg text-xs font-bold flex items-center justify-between select-none ${
                                      isFixed
                                        ? "bg-blue-600 text-white border border-blue-700 cursor-not-allowed"
                                        : "bg-slate-900 text-white cursor-grab active:cursor-grabbing"
                                    }`}
                                    title={isFixed ? "Policial fixado via configurações do sistema" : "Arraste para mover"}
                                  >
                                    <div className="flex items-center justify-between w-full">
                                      <div>
                                        <div className="font-extrabold flex items-center gap-1.5">
                                          {pp.nome} {isFixed && <Shield size={10} className="fill-white/20 text-white" />}
                                        </div>
                                        <div className="text-[9px] text-slate-355 font-mono">{pp.matricula}</div>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0 ml-2">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDuplicateToken(tid, posto, f, false)
                                          }}
                                          className="p-1 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
                                          title="Duplicar"
                                        >
                                          <Plus size={11} />
                                        </button>
                                        {!isFixed && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleRemoveToken(tid)
                                            }}
                                            className="p-1 hover:bg-rose-900/40 rounded text-rose-450 hover:text-rose-350 transition cursor-pointer"
                                            title="Remover"
                                          >
                                            <Trash2 size={11} />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                              {allocatedIds.length === 0 && (
                                <span className="text-[10px] text-slate-300 italic text-center py-2">
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

            {/* Postos Especiais (Guaritas) */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield size={16} className="text-blue-600" /> Postos Especiais (Guaritas G1, G3, G5, G6)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Estas posições têm 4 faixas de horários editáveis em linha e independentes das demais escalas.
                </p>
              </div>

              <div className="space-y-4">
                {["G1", "G3", "G5", "G6"].map((gId) => (
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
                                className="w-full bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 font-mono outline-none focus:border-slate-350"
                              />
                            </div>

                            <div className="space-y-1.5 flex-1 flex flex-col justify-center min-h-[40px] bg-slate-50/30 rounded border border-slate-100/50 p-1">
                              {allocatedTokens.map((tid) => {
                                const pp = parseToken(tid)
                                if (!pp) return null
                                const isFixed = policiaisFixos.some(
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
                                        : "bg-slate-900 text-white cursor-grab active:cursor-grabbing"
                                    }`}
                                    title={isFixed ? "Policial fixado" : "Arraste para mover"}
                                  >
                                    <div className="truncate pr-1">
                                      <div className="truncate font-extrabold flex items-center gap-1">
                                        {pp.nome} {isFixed && <Shield size={8} />}
                                      </div>
                                      <div className="text-[8px] text-slate-350 font-mono leading-tight">{pp.matricula}</div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDuplicateToken(tid, gId, slotIdx, true)
                                        }}
                                        className="p-0.5 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer"
                                        title="Duplicar"
                                      >
                                        <Plus size={10} />
                                      </button>
                                      {!isFixed && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveToken(tid)
                                          }}
                                          className="p-0.5 hover:bg-rose-900/40 rounded text-rose-350 hover:text-rose-200 cursor-pointer"
                                          title="Remover"
                                        >
                                          <Trash2 size={10} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                              {allocatedTokens.length === 0 && (
                                <span className="text-[9px] text-slate-355 italic text-center py-1">
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

            {/* Posto Especial Tenda ABC */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Shield size={16} className="text-blue-600" /> Posto Especial (Tenda ABC)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Esta posição tem 4 faixas de horários editáveis em linha e independentes das demais escalas.
                </p>
              </div>

              <div className="space-y-4">
                {["TENDA ABC"].map((gId) => (
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
                                className="w-full bg-slate-50 border border-slate-200/60 rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 font-mono outline-none focus:border-slate-350"
                              />
                            </div>

                            <div className="space-y-1.5 flex-1 flex flex-col justify-center min-h-[40px] bg-slate-50/30 rounded border border-slate-100/50 p-1">
                              {allocatedTokens.map((tid) => {
                                const pp = parseToken(tid)
                                if (!pp) return null
                                const isFixed = policiaisFixos.some(
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
                                        : "bg-slate-900 text-white cursor-grab active:cursor-grabbing"
                                    }`}
                                    title={isFixed ? "Policial fixado" : "Arraste para mover"}
                                  >
                                    <div className="truncate pr-1">
                                      <div className="truncate font-extrabold flex items-center gap-1">
                                        {pp.nome} {isFixed && <Shield size={8} />}
                                      </div>
                                      <div className="text-[8px] text-slate-300 font-mono leading-tight">{pp.matricula}</div>
                                    </div>

                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleDuplicateToken(tid, gId, slotIdx, true)
                                        }}
                                        className="p-0.5 hover:bg-white/10 rounded text-slate-300 hover:text-white cursor-pointer"
                                        title="Duplicar"
                                      >
                                        <Plus size={10} />
                                      </button>
                                      {!isFixed && (
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemoveToken(tid)
                                          }}
                                          className="p-0.5 hover:bg-rose-900/40 rounded text-rose-350 hover:text-rose-200 cursor-pointer"
                                          title="Remover"
                                        >
                                          <Trash2 size={10} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                              {allocatedTokens.length === 0 && (
                                <span className="text-[9px] text-slate-355 italic text-center py-1">
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

            <div className="flex items-center gap-2 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200/50">
              <AlertCircle size={14} className="text-slate-400" />
              <span>
                Regra: Policiais não podem ser duplicados na mesma faixa horária. Arraste cards de policiais entre o Pool e os postos para organizar. Nós de policiais com ícone de escudo são fixados via configurações.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* -------------------- PREMIUM TABULAR PRINT LAYOUT (HIDDEN ON SCREEN, ONLY SHOWN ON PRINT) -------------------- */}
      <div className="hidden print:block space-y-8">
        {/* Full Institutional Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-4 text-center">
          <h3 className="text-md font-bold uppercase text-slate-700 tracking-normal mt-0.5">
            UPI-4 (Unidade Prisional de Itaitinga - 4) — Localidade: Itaitinga
          </h3>
          <h4 className="text-sm font-extrabold text-slate-800 uppercase mt-2">
            ESCALA DE PLANTÃO OPERACIONAL DE SEGURANÇA
          </h4>
          
          <div className="grid grid-cols-3 text-left text-xs mt-4 uppercase font-semibold border-t border-slate-300 pt-3">
            <div><strong>Chefe de Equipe:</strong> {chefe || "______________________"}</div>
            <div className="text-center"><strong>Equipe:</strong> {equipe || "______________________"}</div>
            <div className="text-right"><strong>Data do Plantão:</strong> {dataEscala ? new Date(dataEscala + "T00:00:00").toLocaleDateString("pt-BR") : "____/____/______"}</div>
          </div>
          <div className="text-center text-[10px] text-slate-500 mt-2">
            Período Geral: das {horaInicio} às {horaFim}
          </div>
        </div>

        {/* 1. Postos Operacionais Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-4 border-slate-900 pl-2">
            Postos Operacionais (Divisão de Faixas)
          </h3>
          
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto / Faixa</th>
                {Array.from({ length: numFaixas }).map((_, f) => {
                  const time = faixasHorario[f] || { inicio: "--:--", fim: "--:--" }
                  return (
                    <th key={f} style={{ width: `${80 / numFaixas}%` }}>
                      Faixa {f + 1} ({time.inicio} - {time.fim})
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(POSTOS_CONFIG).map((posto) => (
                <tr key={posto}>
                  <td className="font-bold text-slate-800 text-center uppercase">{posto}</td>
                  {Array.from({ length: numFaixas }).map((_, f) => {
                    const tokens = estado[f]?.[posto] || []
                    return (
                      <td key={f} className="text-center">
                        {tokens.length > 0 ? (
                          <div className="space-y-1">
                            {tokens.map((tid) => {
                              const pp = parseToken(tid)
                              if (!pp) return null
                              return (
                                <div key={tid} className="print-cell-active">
                                  <div className="font-semibold text-slate-900">{pp.nome}</div>
                                  <div className="print-cell-subtext">Matrícula: {pp.matricula}</div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <span className="print-cell-empty">— VAGO —</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Guaritas Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-4 border-slate-900 pl-2">
            Postos de Segurança (Guaritas Operacionais)
          </h3>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto</th>
                <th style={{ width: "20%" }}>Turno 1</th>
                <th style={{ width: "20%" }}>Turno 2</th>
                <th style={{ width: "20%" }}>Turno 3</th>
                <th style={{ width: "20%" }}>Turno 4</th>
              </tr>
            </thead>
            <tbody>
              {["G1", "G3", "G5", "G6"].map((gId) => (
                <tr key={gId}>
                  <td className="font-bold text-slate-800 text-center uppercase">{gId}</td>
                  {Array.from({ length: 4 }).map((_, slotIdx) => {
                    const timeVal = independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00"
                    const tokens = independentEstado[gId]?.[slotIdx] || []
                    return (
                      <td key={slotIdx} className="text-center">
                        <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
                          {timeVal}
                        </div>
                        {tokens.length > 0 ? (
                          <div className="space-y-0.5">
                            {tokens.map((tid) => {
                              const pp = parseToken(tid)
                              if (!pp) return null
                              return (
                                <div key={tid} className="print-cell-active">
                                  <div className="font-semibold text-slate-900">{pp.nome}</div>
                                  <div className="print-cell-subtext">{pp.matricula}</div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <span className="print-cell-empty">— VAGO —</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 3. Tenda ABC Table (Last Row/Section) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-4 border-slate-900 pl-2">
            Postos de Segurança (Tenda Operacional)
          </h3>

          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Posto</th>
                <th style={{ width: "20%" }}>Turno 1</th>
                <th style={{ width: "20%" }}>Turno 2</th>
                <th style={{ width: "20%" }}>Turno 3</th>
                <th style={{ width: "20%" }}>Turno 4</th>
              </tr>
            </thead>
            <tbody>
              {["TENDA ABC"].map((gId) => (
                <tr key={gId}>
                  <td className="font-bold text-slate-800 text-center uppercase">{gId}</td>
                  {Array.from({ length: 4 }).map((_, slotIdx) => {
                    const timeVal = independentHorarios[gId]?.[slotIdx] || "00:00 - 06:00"
                    const tokens = independentEstado[gId]?.[slotIdx] || []
                    return (
                      <td key={slotIdx} className="text-center">
                        <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">
                          {timeVal}
                        </div>
                        {tokens.length > 0 ? (
                          <div className="space-y-0.5">
                            {tokens.map((tid) => {
                              const pp = parseToken(tid)
                              if (!pp) return null
                              return (
                                <div key={tid} className="print-cell-active">
                                  <div className="font-semibold text-slate-900">{pp.nome}</div>
                                  <div className="print-cell-subtext">{pp.matricula}</div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <span className="print-cell-empty">— VAGO —</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4. Relação de Servidores Presentes */}
        <div className="space-y-2 page-break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-l-4 border-slate-900 pl-2">
            Efetivo de Serviço (Presentes no Plantão)
          </h3>
          <div className="border border-slate-300 p-2.5 rounded-lg bg-slate-50/20 text-slate-800">
            <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-[9px]">
              {basePoliciais.filter(p => presenceMap[p.matricula] !== false).map((pp, idx) => (
                <div key={pp.matricula} className="flex justify-between border-b border-slate-200/50 pb-0.5">
                  <span className="font-semibold text-slate-950 truncate max-w-[150px]">{idx + 1}. {pp.nome}</span>
                  <span className="font-mono text-slate-500 shrink-0">{pp.matricula}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Signatures Area */}
        <div className="pt-6 grid grid-cols-2 gap-8 text-center text-xs font-semibold uppercase">
          <div className="space-y-1">
            <div className="border-t border-slate-900 w-3/4 mx-auto pt-1"></div>
            <div>Responsável pela Confecção (UPI-4)</div>
          </div>
          <div className="space-y-1">
            <div className="border-t border-slate-900 w-3/4 mx-auto pt-1"></div>
            <div>Direção / Supervisão Geral</div>
          </div>
        </div>
      </div>
    </div>
  )
}

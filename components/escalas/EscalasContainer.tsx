"use client"

import { useState, useEffect, Fragment } from "react"
import { Upload, Trash2, RefreshCw, Printer, AlertCircle, Shield, Plus, Copy, Save, Settings, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { saveScaleConfigAction } from "@/app/actions/configuracoes"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Policial {
  nome: string
  matricula: string
  qra?: string
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

// Postos Config is now dynamic and stored in database/state

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

const isPostPairAllowed = (postA: string, postB: string): boolean => {
  const pA = postA.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  const pB = postB.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  
  if (
    (pA === "ACESSO EXTERNO" && pB === "ACESSO INTERNO") ||
    (pA === "ACESSO INTERNO" && pB === "ACESSO EXTERNO")
  ) {
    return true
  }
  if (
    (pA === "ACESSO INTERNO" && pB === "RECEPCAO") ||
    (pA === "RECEPCAO" && pB === "ACESSO INTERNO")
  ) {
    return true
  }
  return false
}


interface PolicialEquipe {
  nome: string
  matricula: string
}

interface EscalasContainerProps {
  tipo: "diurna" | "almoco" | "janta" | "noturna" | "alvorada"
  initialPoliciaisFixos: PolicialFixo[]
  currentUser: { username: string; name: string; role: string } | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  nomeUnidade?: string
  localidade?: string
  initialPostosConfig?: string
  initialHoraInicio?: string
  initialHoraFim?: string
  initialNumFaixas?: string
}

export default function EscalasContainer({
  tipo,
  initialPoliciaisFixos,
  currentUser,
  equipeAlfa,
  equipeBravo,
  equipeEcho,
  equipeFox,
  nomeUnidade = "UPI-4",
  localidade = "Itaitinga",
  initialPostosConfig = "",
  initialHoraInicio = "",
  initialHoraFim = "",
  initialNumFaixas = ""
}: EscalasContainerProps) {
  const LS_KEY = `escalaUPI4_${tipo}_v2`

  const [chefe, setChefe] = useState("")
  const [equipe, setEquipe] = useState("")
  const [dataEscala, setDataEscala] = useState("")

  const [horaInicio, setHoraInicio] = useState(() => {
    return initialHoraInicio || (tipo === "diurna" ? "06:00" : tipo === "almoco" ? "11:00" : tipo === "janta" ? "17:00" : tipo === "noturna" ? "18:00" : "06:00")
  })
  const [horaFim, setHoraFim] = useState(() => {
    return initialHoraFim || (tipo === "diurna" ? "18:00" : tipo === "almoco" ? "13:30" : tipo === "janta" ? "19:30" : tipo === "noturna" ? "06:00" : "08:00")
  })
  const [numFaixas, setNumFaixas] = useState(() => {
    if (tipo === "almoco") return 2
    if (tipo === "alvorada") return 1
    return Number(initialNumFaixas || "2")
  })

  const [policiaisFixos, setPoliciaisFixos] = useState<PolicialFixo[]>(initialPoliciaisFixos)

  const [postosConfig, setPostosConfig] = useState<Record<string, number>>(() => {
    if (initialPostosConfig) {
      try {
        const parsed = JSON.parse(initialPostosConfig)
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
          return parsed
        }
      } catch {}
    }
    // Fallbacks
    if (tipo === "diurna" || tipo === "almoco" || tipo === "alvorada") {
      return {
        "ACESSO EXTERNO": 1,
        "ACESSO INTERNO": 1,
        "RECEPÇÃO": 1,
        "MONITORAMENTO": 1,
        "VIDEOCONFERÊNCIA": 1,
        "POSTO DE CONTROLE": 1,
        "SUPERIOR ABC": 2,
        "SUPERIOR DEF": 2,
        "ATEND. ADVOGADOS": 1,
        "TENDA ABC": 2
      }
    } else { // janta & noturna
      return {
        "P2": 1,
        "VISOR": 1,
        "CONTROLE": 1,
        "SUP ABC": 2,
        "SUP DEF": 2
      }
    }
  })

  const [basePoliciais, setBasePoliciais] = useState<Policial[]>([])
  const [estado, setEstado] = useState<Record<number, Record<string, string[]>>>({})
  const [draggedToken, setDraggedToken] = useState<string | null>(null)

  // Map of team members' presence
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({})

  // Global Pool states
  const [poolFilter, setPoolFilter] = useState<"unallocated" | "all">("unallocated")
  const [poolSearch, setPoolSearch] = useState("")
  const [isDragOverPool, setIsDragOverPool] = useState(false)

  // Collapsible configuration states
  const [showConfig, setShowConfig] = useState(false)
  const [fixedNome, setFixedNome] = useState("")
  const [fixedMatricula, setFixedMatricula] = useState("")
  const [fixedPosto, setFixedPosto] = useState("")
  const [fixedFaixa, setFixedFaixa] = useState("Faixa 1")

  const [newPostName, setNewPostName] = useState("")
  const [newPostLimit, setNewPostLimit] = useState(1)
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)


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
    if (tid.startsWith("GLOBAL_PP_")) {
      const matricula = tid.replace("GLOBAL_PP_", "")
      const pp = basePoliciais.find((p) => p.matricula === matricula)
      return {
        nome: pp?.nome || "Policial",
        qra: pp?.qra || pp?.nome || "Policial",
        matricula,
        slotIdx: -1
      }
    }
    // Format: PP_MATRICULA_F{slot}_...
    const match = tid.match(/^PP_(.+?)_F(\d+)(?:_.*)?$/)
    if (!match) return null
    const matricula = match[1]
    const slotIdx = Number(match[2])
    const pp = basePoliciais.find((p) => p.matricula === matricula)
    return {
      nome: pp?.nome || "Policial",
      qra: pp?.qra || pp?.nome || "Policial",
      matricula,
      slotIdx
    }
  }

  const getOfficerAllocations = (matricula: string) => {
    const allocations: { slot: number; posto: string }[] = []
    // Check standard state
    Object.keys(estado).forEach((sKey) => {
      const s = Number(sKey)
      Object.keys(estado[s] || {}).forEach((posto) => {
        if (posto === "POOL") return
        const list = estado[s][posto] || []
        const hasToken = list.some(t => {
          const p = parseToken(t)
          return p && p.matricula === matricula
        })
        if (hasToken) {
          allocations.push({ slot: s, posto })
        }
      })
    })
    // Check independent state
    Object.keys(independentEstado).forEach((gId) => {
      Object.keys(independentEstado[gId] || {}).forEach((sKey) => {
        const s = Number(sKey)
        const list = independentEstado[gId][s] || []
        const hasToken = list.some(t => {
          const p = parseToken(t)
          return p && p.matricula === matricula
        })
        if (hasToken) {
          allocations.push({ slot: s, posto: gId })
        }
      })
    })
    return allocations
  }

  const getUnallocatedOfficers = () => {
    return basePoliciais.filter(pp => {
      if (presenceMap[pp.matricula] === false) return false
      const allocs = getOfficerAllocations(pp.matricula)
      return allocs.length === 0
    })
  }

  // 1. Initial State Setup
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    setDataEscala(today)
  }, [])

  // Calculate slots on time/slots changes
  // Auto-inject fixed PPs into independent posts on mount or when basePoliciais / policiaisFixos change
  useEffect(() => {
    if (tipo !== "noturna" || basePoliciais.length === 0) return
    setIndependentEstado((prev) => {
      let changed = false
      const novo = { ...prev }
      INDEPENDENT_POSTS.forEach((gId) => {
        if (!novo[gId]) {
          novo[gId] = { 0: [], 1: [], 2: [], 3: [] }
          changed = true
        }
        for (let sIdx = 0; sIdx < 4; sIdx++) {
          const faixaName = `Faixa ${sIdx + 1}`
          const fixedForFaixa = policiaisFixos.filter(
            (f) => f.posto === gId && f.faixa === faixaName
          )
          const currentList = [...(novo[gId][sIdx] || [])]
          let listChanged = false
          
          fixedForFaixa.forEach((fixed) => {
            const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
            if (pp) {
              const token = tokenId(pp.matricula, sIdx)
              if (!currentList.includes(token)) {
                currentList.push(token)
                listChanged = true
              }
            }
          })
          if (listChanged) {
            novo[gId][sIdx] = currentList
            changed = true
          }
        }
      })
      return changed ? novo : prev
    })
  }, [basePoliciais, policiaisFixos, tipo])

  // Calculate slots on time/slots changes
  useEffect(() => {
    // Rebuild/adjust empty slots structure in estado
    setEstado((prev) => {
      const novo: Record<number, Record<string, string[]>> = {}
      for (let f = 0; f < numFaixas; f++) {
        novo[f] = { POOL: [] }
        for (const posto of Object.keys(postosConfig)) {
          novo[f][posto] = prev[f]?.[posto] || []
        }

        // Auto-inject fixed PPs into their configured posts if they are present in basePoliciais
        const faixaName = `Faixa ${f + 1}`
        policiaisFixos.forEach((fixed) => {
          if (fixed.faixa === faixaName) {
            const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
            if (pp) {
              const token = tokenId(pp.matricula, f)
              if (novo[f][fixed.posto] && !novo[f][fixed.posto].includes(token)) {
                novo[f][fixed.posto].push(token)
              }
            }
          }
        })

        // Fill POOL with any PPs not currently in postos
        const allocatedMatriculas = new Set<string>()
        for (const posto of Object.keys(postosConfig)) {
          ;(novo[f]?.[posto] || []).forEach((id) => {
            const parsed = parseToken(id)
            if (parsed) {
              allocatedMatriculas.add(parsed.matricula)
            }
          })
        }

        // Also check allocated in independentEstado to remove them from pool
        if (tipo === "noturna") {
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
        }

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
  }, [numFaixas, basePoliciais, policiaisFixos, independentEstado, presenceMap, postosConfig, tipo])

  // Remove absent officers from all posts/slots automatically when unchecked in presence map
  useEffect(() => {
    const absentMatriculas = new Set<string>()
    basePoliciais.forEach((p) => {
      if (presenceMap[p.matricula] === false) {
        absentMatriculas.add(p.matricula)
      }
    })

    if (absentMatriculas.size === 0) return

    // 1. Filter out absent officers from standard posts in 'estado'
    setEstado((prev) => {
      let changed = false
      const novo = { ...prev }
      for (const f of Object.keys(novo)) {
        const fIdx = Number(f)
        if (!novo[fIdx]) continue
        novo[fIdx] = { ...prev[fIdx] }
        for (const posto of Object.keys(novo[fIdx])) {
          if (posto === "POOL") continue
          const currentList = novo[fIdx][posto] || []
          const filtered = currentList.filter((token) => {
            const parsed = parseToken(token)
            const isAbsent = parsed ? absentMatriculas.has(parsed.matricula) : false
            if (isAbsent) changed = true
            return !isAbsent
          })
          if (changed) {
            novo[fIdx][posto] = filtered
          }
        }
      }
      return changed ? novo : prev
    })

    // 2. Filter out absent officers from independent states
    setIndependentEstado((prev) => {
      let changed = false
      const novo = { ...prev }
      for (const gId of Object.keys(novo)) {
        if (!novo[gId]) continue
        novo[gId] = { ...prev[gId] }
        for (const f of Object.keys(novo[gId])) {
          const fIdx = Number(f)
          const currentList = novo[gId][fIdx] || []
          const filtered = currentList.filter((token) => {
            const parsed = parseToken(token)
            const isAbsent = parsed ? absentMatriculas.has(parsed.matricula) : false
            if (isAbsent) changed = true
            return !isAbsent
          })
          if (changed) {
            novo[gId][fIdx] = filtered
          }
        }
      }
      return changed ? novo : prev
    })
  }, [presenceMap, basePoliciais])

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
    setShowClearConfirm(true)
  }

  const confirmClear = () => {
    localStorage.removeItem(LS_KEY)
    setBasePoliciais([])
    setEstado({})
    setIndependentEstado(DEFAULT_INDEPENDENT_ESTADO)
    setIndependentHorarios(DEFAULT_INDEPENDENT_HORARIOS)
    setPresenceMap({})
    toast.success("Escala limpa.")
    setShowClearConfirm(false)
  }

  const handleDeletePost = (posto: string) => {
    setPostosConfig(prev => {
      const copy = { ...prev }
      delete copy[posto]
      return copy
    })
    // Clean state
    setEstado(prev => {
      const copy = { ...prev }
      Object.keys(copy).forEach(f => {
        const fIdx = Number(f)
        if (copy[fIdx][posto]) {
          delete copy[fIdx][posto]
        }
      })
      return copy
    })
    toast.success(`Posto ${posto} excluído da escala ativa.`)
  }

  const handleAddPost = () => {
    const name = newPostName.trim().toUpperCase()
    if (!name) {
      toast.error("Nome do posto é obrigatório.")
      return
    }
    if (postosConfig[name] !== undefined) {
      toast.error("Posto já cadastrado.")
      return
    }
    setPostosConfig(prev => ({
      ...prev,
      [name]: newPostLimit
    }))
    // Add to state for all faixas
    setEstado(prev => {
      const copy = { ...prev }
      Object.keys(copy).forEach(f => {
        const fIdx = Number(f)
        if (!copy[fIdx][name]) {
          copy[fIdx][name] = []
        }
      })
      return copy
    })
    setNewPostName("")
    setNewPostLimit(1)
    toast.success(`Posto ${name} adicionado com sucesso!`)
  }

  const handleAddFixedOfficer = () => {
    const selectedPP = basePoliciais.find(p => p.matricula === fixedMatricula)
    if (!selectedPP) {
      toast.error("Selecione um policial válido.")
      return
    }
    if (!fixedPosto) {
      toast.error("Selecione um posto.")
      return
    }
    const alreadyExists = policiaisFixos.some(
      f => f.matricula === selectedPP.matricula && f.faixa === fixedFaixa && f.posto === fixedPosto
    )
    if (alreadyExists) {
      toast.error("Este policial já está fixado neste posto e faixa.")
      return
    }
    const newFixed: PolicialFixo = {
      matricula: selectedPP.matricula,
      nome: selectedPP.nome,
      posto: fixedPosto,
      faixa: fixedFaixa
    }
    setPoliciaisFixos(prev => [...prev, newFixed])
    setFixedMatricula("")
    setFixedNome("")
    toast.success("Policial fixado com sucesso!")
  }

  const handleSaveScaleSettings = async () => {
    setIsSavingConfig(true)
    try {
      const res = await saveScaleConfigAction(
        tipo,
        JSON.stringify(policiaisFixos),
        JSON.stringify(postosConfig),
        horaInicio,
        horaFim,
        String(numFaixas)
      )
      if (res.success) {
        toast.success("Configurações da escala salvas no banco de dados!")
        setShowConfig(false)
      } else {
        toast.error(res.error || "Erro ao salvar configurações no banco.")
      }
    } catch (error: any) {
      toast.error(error.message || "Erro de conexão ao salvar.")
    } finally {
      setIsSavingConfig(false)
    }
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

    const keys = Object.keys(postosConfig)
    const excessPost = keys.includes("CONTROLE") 
      ? "CONTROLE" 
      : keys.includes("POSTO DE CONTROLE") 
      ? "POSTO DE CONTROLE" 
      : keys[0] || "CONTROLE"

    const novoEstado: Record<number, Record<string, string[]>> = {}
    for (let f = 0; f < numFaixas; f++) {
      novoEstado[f] = { POOL: [] }
      for (const posto of keys) {
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
      for (const [posto, limit] of Object.entries(postosConfig)) {
        if (posto === excessPost) continue // excessPost handles excess

        const currentCount = novoEstado[f][posto].length
        const slotsNeeded = limit - currentCount

        for (let i = 0; i < slotsNeeded; i++) {
          while (ppIndex < totalPP) {
            const pp = activePPs[ppIndex]
            const token = tokenId(pp.matricula, f)

            // Check if this PP is already allocated in any post for slot f
            const isAlreadyAllocated = Object.entries(novoEstado[f]).some(([otherPosto, list]) => {
              if (otherPosto === "POOL") return false
              if (list.includes(token)) {
                if (isPostPairAllowed(posto, otherPosto)) {
                  return false
                }
                return true
              }
              return false
            })

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

    // Remaining PPs go to excessPost round-robin
    let fControle = 0
    for (let i = ppIndex; i < totalPP; i++) {
      const pp = activePPs[i]
      
      // Find the next slot f where this PP is not already allocated to something else
      let targetSlot = fControle
      let found = false
      
      for (let attempt = 0; attempt < numFaixas; attempt++) {
        const s = (fControle + attempt) % numFaixas
        const token = tokenId(pp.matricula, s)
        const isAlreadyAllocated = Object.entries(novoEstado[s]).some(([otherPosto, list]) => {
          if (otherPosto === "POOL") return false
          if (list.includes(token)) {
            if (isPostPairAllowed(excessPost, otherPosto)) {
              return false
            }
            return true
          }
          return false
        })
        if (!isAlreadyAllocated) {
          targetSlot = s
          found = true
          break
        }
      }
      
      const token = tokenId(pp.matricula, targetSlot)
      if (novoEstado[targetSlot][excessPost]) {
        novoEstado[targetSlot][excessPost].push(token)
      }
      fControle = (targetSlot + 1) % numFaixas
    }

    // Repopulate POOL for all slots with missing PPs
    for (let s = 0; s < numFaixas; s++) {
      const allocated = new Set<string>()
      for (const p of keys) {
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

    const isDestIndependent = tipo === "noturna" && INDEPENDENT_POSTS.includes(destPosto)
    const destToken = (token.includes("_F" + destSlot) && !token.startsWith("GLOBAL_PP_"))
      ? token 
      : `PP_${parsed.matricula}_F${destSlot}_MOVE_${Math.random().toString(36).substr(2, 5)}`

    // Remove token from previous locations in standard slots
    setEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((sKey) => {
        const s = Number(sKey)
        next[s] = {}
        Object.keys(prev[s]).forEach((pKey) => {
          next[s][pKey] = (prev[s][pKey] || []).filter((t) => {
            if (t === token) return false
            if (s === destSlot) {
              const p = parseToken(t)
              if (p && p.matricula === parsed.matricula) {
                if (isPostPairAllowed(destPosto, pKey)) {
                  return true
                }
                return false
              }
            }
            return true
          })
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
          next[pKey][s] = (prev[pKey][s] || []).filter((t) => {
            if (t === token) return false
            if (s === destSlot) {
              const p = parseToken(t)
              if (p && p.matricula === parsed.matricula) {
                if (isPostPairAllowed(destPosto, pKey)) {
                  return true
                }
                return false
              }
            }
            return true
          })
        })
      })

      if (isDestIndependent) {
        if (!next[destPosto]) next[destPosto] = {}
        const currentList = next[destPosto][destSlot] || []
        next[destPosto][destSlot] = [...currentList, destToken]
      }
      return next
    })

    setDraggedToken(null)
  }

  const handleDropIntoGlobalPool = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOverPool(false)
    const token = e.dataTransfer.getData("text/plain") || draggedToken
    if (!token) return
    const parsed = parseToken(token)
    if (!parsed) return

    // Remove the officer's presence in all slots of standard state
    setEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((sKey) => {
        const s = Number(sKey)
        next[s] = {}
        Object.keys(prev[s]).forEach((pKey) => {
          next[s][pKey] = (prev[s][pKey] || []).filter((t) => {
            const p = parseToken(t)
            return p ? p.matricula !== parsed.matricula : true
          })
        })
      })
      return next
    })

    // Remove the officer's presence in all slots of independent state
    setIndependentEstado((prev) => {
      const next = {} as typeof prev
      Object.keys(prev).forEach((pKey) => {
        next[pKey] = {}
        Object.keys(prev[pKey]).forEach((sKey) => {
          const s = Number(sKey)
          next[pKey][s] = (prev[pKey][s] || []).filter((t) => {
            const p = parseToken(t)
            return p ? p.matricula !== parsed.matricula : true
          })
        })
      })
      return next
    })

    setDraggedToken(null)
    toast.success(`Policial ${parsed.nome} removido de todas as faixas.`)
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
              onClick={() => setShowConfig(!showConfig)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer ${
                showConfig 
                  ? "bg-slate-600 hover:bg-slate-700 text-white" 
                  : "bg-slate-800 hover:bg-slate-750 text-white border border-slate-700"
              }`}
            >
              <Settings size={14} /> Configurações
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-slate-800 hover:bg-slate-100 rounded-xl shadow-sm transition cursor-pointer"
            >
              <Printer size={14} /> Imprimir Escala
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
              Turnos/Subdivisões
            </label>
            <select
              value={numFaixas}
              onChange={(e) => setNumFaixas(Number(e.target.value))}
              disabled={tipo === "almoco" || tipo === "alvorada"}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white disabled:bg-slate-50 disabled:text-slate-400"
            >
              {tipo === "alvorada" ? (
                <option value={1}>1 Turno</option>
              ) : tipo === "almoco" ? (
                <option value={2}>2 Turnos</option>
              ) : (
                <>
                  <option value={1}>1 Turno</option>
                  <option value={2}>2 Turnos</option>
                  <option value={3}>3 Turnos</option>
                  <option value={4}>4 Turnos</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Collapsible config settings panel */}
        {showConfig && (
          <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <Settings size={18} className="text-slate-600" />
                Configurações da Escala ({tipo.toUpperCase()})
              </h2>
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Fechar ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Section: Service Posts Management */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Postos de Serviço
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {Object.entries(postosConfig).map(([postoName, limit]) => (
                    <div
                      key={postoName}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-250 bg-white text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-850">{postoName}</span>
                        <span className="text-[10px] text-slate-450 font-mono">
                          (Qtd Padrão: {limit} PP)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(postoName)}
                        className="p-1 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                        title="Excluir Posto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new post form */}
                <div className="flex flex-col sm:flex-row gap-2 items-end pt-2 border-t border-slate-200">
                  <div className="flex-1 space-y-1 w-full">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Nome do Posto
                    </label>
                    <input
                      type="text"
                      placeholder="EX: GUARDA EXTERNA"
                      value={newPostName}
                      onChange={(e) => setNewPostName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <div className="w-full sm:w-28 space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">
                      Qtd Policiais
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newPostLimit}
                      onChange={(e) => setNewPostLimit(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPost}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition h-[30px]"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>
              </div>

              {/* Section: Fixed Officers Management */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Policiais Fixados nesta Escala
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                  {policiaisFixos.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400 italic bg-white border border-slate-200 rounded-xl">
                      Nenhum policial fixo configurado.
                    </div>
                  ) : (
                    policiaisFixos.map((fixed, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-250 bg-white text-xs font-semibold"
                      >
                        <div>
                          <div className="font-extrabold text-slate-850">
                            {fixed.nome} <span className="font-mono font-normal text-slate-400">({fixed.matricula})</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Posto: <span className="font-bold">{fixed.posto}</span> | {fixed.faixa.replace("Faixa", "Turno")}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPoliciaisFixos(prev => prev.filter((_, i) => i !== idx))
                            toast.success("Policial fixo desvinculado.")
                          }}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded-lg transition"
                          title="Remover Vinculação"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Add fixed officer form */}
                <div className="space-y-3 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        Policial
                      </label>
                      <select
                        value={fixedMatricula}
                        onChange={(e) => {
                          const pp = basePoliciais.find(p => p.matricula === e.target.value)
                          setFixedMatricula(e.target.value)
                          setFixedNome(pp?.nome || "")
                        }}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                      >
                        <option value="">Selecione...</option>
                        {basePoliciais
                          .slice()
                          .sort((a, b) => (a.qra || a.nome).localeCompare(b.qra || b.nome))
                          .map((pp) => (
                            <option key={pp.matricula} value={pp.matricula}>
                              {pp.qra || pp.nome} ({pp.matricula})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        Posto
                      </label>
                      <select
                        value={fixedPosto}
                        onChange={(e) => setFixedPosto(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                      >
                        <option value="">Selecione...</option>
                        {Object.keys(postosConfig).map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                        {tipo === "noturna" && INDEPENDENT_POSTS.map((p) => (
                          <option key={p} value={p}>
                            {p} (Especial)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase">
                        Turno
                      </label>
                      <select
                        value={fixedFaixa}
                        onChange={(e) => setFixedFaixa(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                      >
                        {Array.from({ length: tipo === "noturna" ? 4 : numFaixas }).map((_, idx) => (
                          <option key={idx} value={`Faixa ${idx + 1}`}>
                            Turno {idx + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddFixedOfficer}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition"
                    >
                      <Plus size={14} /> Vincular Policial Fixo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom save button */}
            <div className="sticky bottom-0 -mx-6 -mb-6 bg-slate-50/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-4 rounded-b-2xl z-10 flex justify-end gap-2 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
              <button
                type="button"
                onClick={() => setShowConfig(false)}
                className="px-4 py-2 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isSavingConfig}
                onClick={handleSaveScaleSettings}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition disabled:opacity-50"
              >
                {isSavingConfig ? (
                  <>
                    <Loader2 className="animate-spin" size={14} />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Salvar Configurações no Banco
                  </>
                )}
              </button>
            </div>
          </div>
        )}

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
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs font-semibold cursor-pointer transition select-none group/card ${
                        isPresent
                          ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border shrink-0 transition ${
                          isPresent
                            ? "bg-white border-white text-slate-900"
                            : "border-slate-300 bg-white"
                        }`}>
                          {isPresent && <span className="text-[10px] leading-none">✓</span>}
                        </div>
                        <div className="truncate">
                          <div className="truncate text-[11px] leading-tight font-extrabold">{pp.qra || pp.nome}</div>
                          <div className={`text-[9px] font-mono leading-none ${isPresent ? "text-slate-400" : "text-slate-400"}`}>{pp.matricula}</div>
                        </div>
                      </div>


                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timeline Quick View Card */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
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
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
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
                    Não Alocados ({getUnallocatedOfficers().length})
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
                    Todos ({basePoliciais.filter(p => presenceMap[p.matricula] !== false).length})
                  </button>
                </div>

                {/* Roster List */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {(() => {
                    const presentOfficers = basePoliciais.filter(p => presenceMap[p.matricula] !== false)
                    const filteredList = (poolFilter === "unallocated" ? getUnallocatedOfficers() : presentOfficers)
                      .filter(p => {
                        const search = poolSearch.toLowerCase().trim()
                        if (!search) return true
                        return (p.qra || p.nome).toLowerCase().includes(search) || p.nome.toLowerCase().includes(search) || p.matricula.includes(search)
                      })

                    if (filteredList.length === 0) {
                      return (
                        <div className="text-center py-8 text-[11px] text-slate-350 italic">
                          Nenhum policial encontrado
                        </div>
                      )
                    }

                    return filteredList.map((pp) => {
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
                              <span className={`w-2 h-2 rounded-full ${isAllocated ? "bg-blue-550" : "bg-emerald-555"}`} title={isAllocated ? "Alocado" : "Livre"} />
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
              <div className="xl:col-span-3 space-y-6">
                <div className={`grid gap-6 grid-cols-1 md:grid-cols-${numFaixas}`}>
                  {Array.from({ length: numFaixas }).map((_, f) => {
                    const slotTime = faixasHorario[f] || { inicio: "--:--", fim: "--:--" }

                    return (
                      <div key={f} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col space-y-4">
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
                            const limit = postosConfig[posto]
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
                                    {allocatedIds.length} PP
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
                                              {pp.qra || pp.nome} {isFixed && <Shield size={10} className="fill-white/20 text-white" />}
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition cursor-pointer select-none"
                title="Limpar todos os postos"
              >
                <Trash2 size={13} />
                Limpar Postos
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer select-none"
                title="Gravar a escala no navegador"
              >
                <Save size={13} />
                Gravar Escala
              </button>
            </div>

            {/* Postos Especiais (Guaritas) */}
            {tipo === "noturna" && (
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
                                          {pp.qra || pp.nome} {isFixed && <Shield size={8} />}
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
            )}
            </div>
          )}
        </div>

      {/* -------------------- PREMIUM TABULAR PRINT LAYOUT (HIDDEN ON SCREEN, ONLY SHOWN ON PRINT) -------------------- */}
      <div className="print-container">
              <style dangerouslySetInnerHTML={{ __html: `
                .print-container {
                  display: none;
                }
                @media print {
                  @page {
                    size: A4 portrait;
                    margin: 6mm 8mm 6mm 8mm;
                  }
                  body {
                    background-color: #ffffff !important;
                    color: #16191f !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                    font-size: 10.5px !important;
                    margin: 0 !important;
                    padding: 0 !important;
                  }
                  .print-container {
                    display: flex !important;
                    flex-direction: column !important;
                    min-height: 268mm !important;
                    max-width: 100% !important;
                    margin: 0 auto !important;
                    padding: 0 !important;
                  }
                  .print-spacer {
                    flex-grow: 1 !important;
                  }
                  .print-header {
                    border-bottom: 2px solid #232f3e !important;
                    padding-bottom: 6px !important;
                    margin-bottom: 10px !important;
                    text-align: center !important;
                  }
                  .print-header h3 {
                    font-size: 11px !important;
                    font-weight: 700 !important;
                    color: #545b64 !important;
                    margin: 0 0 2px 0 !important;
                    text-transform: uppercase !important;
                  }
                  .print-header h4 {
                    font-size: 14px !important;
                    font-weight: 800 !important;
                    color: #232f3e !important;
                    margin: 0 !important;
                    letter-spacing: 0.5px !important;
                  }
                  .print-meta-grid {
                    display: grid !important;
                    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
                    border: 1px solid #cbd5e1 !important;
                    background-color: #f2f3f3 !important;
                    margin-top: 6px !important;
                    padding: 4px 8px !important;
                    border-radius: 2px !important;
                    text-align: left !important;
                    font-size: 10px !important;
                  }
                  .print-section-title {
                    font-size: 10.5px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase !important;
                    color: #232f3e !important;
                    border-left: 3px solid #ec7211 !important; /* AWS Orange accent */
                    padding-left: 6px !important;
                    margin-bottom: 4px !important;
                    margin-top: 8px !important;
                    letter-spacing: 0.25px !important;
                  }
                  .print-table {
                    width: 100% !important;
                    border-collapse: collapse !important;
                    margin-bottom: 8px !important;
                    font-size: 10px !important;
                  }
                  .print-table th {
                    background-color: #f2f3f3 !important; /* AWS Cloudscape header gray */
                    color: #16191f !important;
                    font-weight: 700 !important;
                    border: 1px solid #cbd5e1 !important;
                    padding: 3px 5px !important;
                    text-transform: uppercase !important;
                    font-size: 9.5px !important;
                    letter-spacing: 0.25px !important;
                    text-align: center !important;
                  }
                  .print-table td {
                    border: 1px solid #cbd5e1 !important;
                    padding: 3px 5px !important;
                    vertical-align: middle !important;
                    text-align: center !important;
                  }
                  .print-cell-active {
                    background-color: #ffffff !important;
                    padding: 0 !important;
                  }
                  .print-cell-group {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 8px !important;
                    flex-wrap: wrap !important;
                  }
                  .print-cell-divider {
                    width: 1px !important;
                    height: 14px !important;
                    background-color: #a8b2c1 !important; /* Stylish grey divider */
                    align-self: center !important;
                  }
                  .print-cell-active div:first-child {
                    font-weight: 700 !important;
                    color: #16191f !important;
                    font-size: 10.5px !important;
                  }
                  .print-cell-subtext {
                    font-size: 8.5px !important;
                    color: #334155 !important; /* Darker slate gray for better physical print contrast */
                    font-family: monospace !important;
                    margin-top: 0.5px !important;
                  }
                  .print-cell-empty {
                    color: #94a3b8 !important;
                    font-style: italic !important;
                    font-size: 9px !important;
                  }
                  .print-signatures {
                    margin-top: 14px !important;
                    display: grid !important;
                    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                    gap: 20px !important;
                    text-align: center !important;
                    page-break-inside: avoid !important;
                    font-size: 10px !important;
                  }
                  .print-signature-line {
                    border-top: 1px solid #545b64 !important;
                    width: 85% !important;
                    margin: 24px auto 3px auto !important;
                  }
                }
              ` }} />

              <div className="print-header">
                <h3>{nomeUnidade} — Localidade: {localidade}</h3>
                <h4>ESCALA DE PLANTÃO</h4>
                <div className="print-meta-grid uppercase font-semibold">
                  <div><strong>Chefe de Equipe:</strong> {chefe || "______________________"}</div>
                  <div className="text-center"><strong>Equipe:</strong> {equipe || "______________________"}</div>
                  <div className="text-right"><strong>Data do Plantão:</strong> {dataEscala ? new Date(dataEscala + "T00:00:00").toLocaleDateString("pt-BR") : "____/____/______"}</div>
                </div>
              </div>

              <div>
                <h3 className="print-section-title">Postos Operacionais (Divisão de Turnos)</h3>
                <table className="print-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Posto / Turno</th>
                      {Array.from({ length: numFaixas }).map((_, f) => {
                        const time = faixasHorario[f] || { inicio: "--:--", fim: "--:--" }
                        return <th key={f}>Turno {f + 1} ({time.inicio} - {time.fim})</th>
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(postosConfig).map((posto) => (
                      <tr key={posto}>
                        <td className="font-bold text-slate-800 text-center uppercase">{posto}</td>
                        {Array.from({ length: numFaixas }).map((_, f) => {
                          const tokens = estado[f]?.[posto] || []
                          return (
                            <td key={f} className="text-center">
                              {tokens.length > 0 ? (
                                <div className="print-cell-group">
                                  {tokens.map((tid, idx) => {
                                    const pp = parseToken(tid)
                                    if (!pp) return null
                                    return (
                                      <Fragment key={tid}>
                                        {idx > 0 && <div className="print-cell-divider"></div>}
                                        <div className="print-cell-active">
                                          <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                          <div className="print-cell-subtext">Matrícula: {pp.matricula}</div>
                                        </div>
                                      </Fragment>
                                    )
                                  })}
                                </div>
                              ) : <span className="print-cell-empty">— VAGO —</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {tipo === "noturna" && (
                <div>
                  <h3 className="print-section-title">Postos de Segurança (Guaritas Operacionais)</h3>
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
                                <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                                {tokens.length > 0 ? (
                                  <div className="print-cell-group">
                                    {tokens.map((tid, idx) => {
                                      const pp = parseToken(tid)
                                      if (!pp) return null
                                      return (
                                        <Fragment key={tid}>
                                          {idx > 0 && <div className="print-cell-divider"></div>}
                                          <div className="print-cell-active">
                                            <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                            <div className="print-cell-subtext">{pp.matricula}</div>
                                          </div>
                                        </Fragment>
                                      )
                                    })}
                                  </div>
                                ) : <span className="print-cell-empty">— VAGO —</span>}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {tipo === "noturna" && (
                <div>
                  <h3 className="print-section-title">Postos de Segurança (Tenda Operacional)</h3>
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
                                <div className="text-[7.5px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-1">{timeVal}</div>
                                {tokens.length > 0 ? (
                                  <div className="print-cell-group">
                                    {tokens.map((tid, idx) => {
                                      const pp = parseToken(tid)
                                      if (!pp) return null
                                      return (
                                        <Fragment key={tid}>
                                          {idx > 0 && <div className="print-cell-divider"></div>}
                                          <div className="print-cell-active">
                                            <div className="font-semibold text-slate-900">{pp.qra || pp.nome}</div>
                                            <div className="print-cell-subtext">{pp.matricula}</div>
                                          </div>
                                        </Fragment>
                                      )
                                    })}
                                  </div>
                                ) : <span className="print-cell-empty">— VAGO —</span>}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}

              <div className="print-spacer"></div>

              <div className="print-signatures">
                <div>
                  <div className="print-signature-line"></div>
                  <div>Responsável pela Confecção (UPI-4)</div>
                </div>
                <div>
                  <div className="print-signature-line"></div>
                  <div>Direção / Supervisão Geral</div>
                </div>
              </div>
            </div>

            <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
              <AlertDialogContent className="bg-white border border-slate-200 shadow-2xl p-6 rounded-2xl max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg font-bold text-slate-900">Limpar toda a escala?</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-slate-500">
                    Esta ação removerá todos os policiais e postos alocados na escala atual. Você não poderá desfazer esta ação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4 gap-2">
                  <AlertDialogCancel className="rounded-xl font-semibold">Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmClear} variant="destructive" className="rounded-xl font-semibold text-white">
                    Sim, Limpar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )
      }

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { saveScaleConfigAction } from "@/app/actions/configuracoes"
import { getChefesAction } from "@/app/actions/chefes"
import {
  Policial,
  PolicialFixo,
  PolicialEquipe,
  ChefeEquipe,
  INDEPENDENT_POSTS,
  DEFAULT_INDEPENDENT_HORARIOS,
  DEFAULT_INDEPENDENT_ESTADO,
  calcularFaixas
} from "./types"
import { useEscalaPostos } from "./hooks/useEscalaPostos"
import { useEscalaPoliciais } from "./hooks/useEscalaPoliciais"
import { useEscalaGrid } from "./hooks/useEscalaGrid"

export const tokenId = (matricula: string, slotIdx: number) => {
  return `PP_${matricula.replace(/\s/g, "")}_F${slotIdx}`
}

export const generateMoveToken = (matricula: string, destSlot: number) => {
  return `PP_${matricula}_F${destSlot}_MOVE_${Math.random().toString(36).substring(2, 7)}`
}

export const generateDupToken = (matricula: string, slotIdx: number) => {
  return `PP_${matricula}_F${slotIdx}_DUP_${Math.random().toString(36).substring(2, 7)}`
}

export const isPostPairAllowed = (postA: string, postB: string): boolean => {
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

interface UseEscalaStateProps {
  tipo: "diurna" | "almoco" | "janta" | "noturna" | "alvorada"
  initialPoliciaisFixos: PolicialFixo[]
  currentUser: { username: string; name: string; role: string } | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  initialPostosConfig?: string
  initialHoraInicio?: string
  initialHoraFim?: string
  initialNumFaixas?: string
}

export function useEscalaState({
  tipo,
  initialPoliciaisFixos,
  currentUser,
  equipeAlfa,
  equipeBravo,
  equipeEcho,
  equipeFox,
  initialPostosConfig = "",
  initialHoraInicio = "",
  initialHoraFim = "",
  initialNumFaixas = ""
}: UseEscalaStateProps) {
  const LS_KEY = `escalaUPI4_${tipo}_v2`

  // ============================
  // ESTADO RAIZ (TOP-LEVEL)
  // ============================
  const [chefe, setChefe] = useState("")
  const [isManualChefe, setIsManualChefe] = useState(false)
  const [equipe, setEquipe] = useState("")
  const [dataEscala, setDataEscala] = useState("")
  const [availableChefes, setAvailableChefes] = useState<ChefeEquipe[]>([])

  const [horaInicio, setHoraInicio] = useState(() => initialHoraInicio || (tipo === "diurna" ? "06:00" : tipo === "almoco" ? "11:00" : tipo === "janta" ? "17:00" : tipo === "noturna" ? "18:00" : "06:00"))
  const [horaFim, setHoraFim] = useState(() => initialHoraFim || (tipo === "diurna" ? "18:00" : tipo === "almoco" ? "13:30" : tipo === "janta" ? "19:30" : tipo === "noturna" ? "06:00" : "08:00"))
  const [numFaixas, setNumFaixas] = useState(() => {
    if (tipo === "almoco") return 2
    if (tipo === "alvorada") return 1
    return Number(initialNumFaixas || "2")
  })

  const [policiaisFixos, setPoliciaisFixos] = useState<PolicialFixo[]>(initialPoliciaisFixos)
  const [basePoliciais, setBasePoliciais] = useState<Policial[]>([])
  const [estado, setEstado] = useState<Record<number, Record<string, string[]>>>({})
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({})
  const [removedFixedTokens, setRemovedFixedTokens] = useState<string[]>([])
  const [unlockedFixedTokens, setUnlockedFixedTokens] = useState<string[]>([])
  
  const [poolFilter, setPoolFilter] = useState<"unallocated" | "all">("unallocated")
  const [poolSearch, setPoolSearch] = useState("")
  const [showConfig, setShowConfig] = useState(false)
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const [independentHorarios, setIndependentHorarios] = useState<Record<string, string[]>>(DEFAULT_INDEPENDENT_HORARIOS)
  const [independentEstado, setIndependentEstado] = useState<Record<string, Record<number, string[]>>>(DEFAULT_INDEPENDENT_ESTADO)
  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false)
  const faixasHorario = calcularFaixas(horaInicio, horaFim, numFaixas)

  const parseToken = (tid: string): (Policial & { slotIdx: number }) | null => {
    if (tid.startsWith("GLOBAL_PP_")) {
      const matricula = tid.replace("GLOBAL_PP_", "")
      const pp = basePoliciais.find((p) => p.matricula === matricula)
      return { nome: pp?.nome || "Policial", qra: pp?.qra || pp?.nome || "Policial", matricula, slotIdx: -1 }
    }
    const match = tid.match(/^PP_(.+?)_F(\d+)(?:_.*)?$/)
    if (!match) return null
    const matricula = match[1]
    const slotIdx = Number(match[2])
    const pp = basePoliciais.find((p) => p.matricula === matricula)
    return { nome: pp?.nome || "Policial", qra: pp?.qra || pp?.nome || "Policial", matricula, slotIdx }
  }

  // ============================
  // HOOKS ESPECIALIZADOS
  // ============================
  const postosLogic = useEscalaPostos({
    tipo,
    initialPostosConfig,
    setEstado,
    setPoliciaisFixos
  })
  
  const gridLogic = useEscalaGrid({
    tipo,
    numFaixas,
    postosConfig: postosLogic.postosConfig,
    basePoliciais,
    presenceMap,
    estado, setEstado,
    independentEstado, setIndependentEstado,
    removedFixedTokens, setRemovedFixedTokens,
    isPostPairAllowed,
    tokenId,
    generateMoveToken,
    generateDupToken,
    parseToken
  })

  const policiaisLogic = useEscalaPoliciais({
    basePoliciais, setBasePoliciais,
    policiaisFixos, setPoliciaisFixos,
    presenceMap, setPresenceMap,
    removedFixedTokens, setRemovedFixedTokens,
    handleRemoveToken: gridLogic.handleRemoveToken,
    autoOcupar: gridLogic.autoOcupar,
    tokenId
  })

  // ============================
  // EFEITOS DE INICIALIZAÇÃO
  // ============================
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const timer = setTimeout(() => {
      setDataEscala(today)
      getChefesAction().then((data) => setAvailableChefes(data))
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const didAutoLoadTeam = useRef(false)
  useEffect(() => {
    if (!currentUser || didAutoLoadTeam.current) return
    const uname = currentUser.username.toLowerCase()
    
    let selectedTeamList: PolicialEquipe[] = []
    let teamName = ""
    
    if (uname === "alfa") { selectedTeamList = equipeAlfa; teamName = "ALFA" }
    else if (uname === "bravo") { selectedTeamList = equipeBravo; teamName = "BRAVO" }
    else if (uname === "charlie") { selectedTeamList = equipeEcho; teamName = "ECHO" }
    else if (uname === "delta") { selectedTeamList = equipeFox; teamName = "FOX" }
    
    if (selectedTeamList.length > 0) {
      didAutoLoadTeam.current = true
      const timer = setTimeout(() => {
        setEquipe(teamName)
        const localData = localStorage.getItem(LS_KEY)
        if (!localData) {
          setBasePoliciais(selectedTeamList)
          const initPresence: Record<string, boolean> = {}
          selectedTeamList.forEach(p => { initPresence[p.matricula] = true })
          setPresenceMap(initPresence)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [currentUser, equipeAlfa, equipeBravo, equipeEcho, equipeFox, LS_KEY])

  // Lógica de fixação noturna e alocação inicial (grid hydration)
  useEffect(() => {
    if (tipo !== "noturna" || basePoliciais.length === 0) return
    const timer = setTimeout(() => {
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
            const fixedForFaixa = policiaisFixos.filter((f) => f.posto === gId && f.faixa === faixaName)
            const currentList = [...(novo[gId][sIdx] || [])]
            let listChanged = false
            
            fixedForFaixa.forEach((fixed) => {
              const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
              if (pp) {
                const token = tokenId(pp.matricula, sIdx)
                let isAllocatedElsewhere = false
                if (estado[sIdx]) {
                  for (const pKey of Object.keys(estado[sIdx])) {
                    if (pKey !== "POOL" && estado[sIdx][pKey] && estado[sIdx][pKey].includes(token)) {
                      isAllocatedElsewhere = true
                      break
                    }
                  }
                }
                for (const otherGId of INDEPENDENT_POSTS) {
                  if (otherGId !== gId && prev[otherGId]?.[sIdx] && prev[otherGId][sIdx].includes(token)) {
                    isAllocatedElsewhere = true
                    break
                  }
                }

                if (!isAllocatedElsewhere && !removedFixedTokens.includes(token) && !unlockedFixedTokens.includes(token) && !currentList.includes(token)) {
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
    }, 0)
    return () => clearTimeout(timer)
  }, [basePoliciais, policiaisFixos, tipo, removedFixedTokens, estado])

  useEffect(() => {
    const timer = setTimeout(() => {
      setEstado((prev) => {
        const novo: Record<number, Record<string, string[]>> = {}
        for (let f = 0; f < numFaixas; f++) {
          novo[f] = { POOL: [] }
          for (const posto of Object.keys(postosLogic.postosConfig)) {
            novo[f][posto] = prev[f]?.[posto] || []
          }

          const faixaName = `Faixa ${f + 1}`
          policiaisFixos.forEach((fixed) => {
            if (fixed.faixa === faixaName) {
              const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
              if (pp) {
                const token = tokenId(pp.matricula, f)
                let isAllocatedElsewhere = false
                for (const pKey of Object.keys(novo[f])) {
                  if (pKey !== "POOL" && pKey !== fixed.posto && novo[f][pKey] && novo[f][pKey].includes(token)) {
                    isAllocatedElsewhere = true
                    break
                  }
                }
                if (tipo === "noturna") {
                  for (const otherGId of INDEPENDENT_POSTS) {
                    if (independentEstado[otherGId]?.[f] && independentEstado[otherGId][f].includes(token)) {
                      isAllocatedElsewhere = true
                      break
                    }
                  }
                }

                if (!isAllocatedElsewhere && !removedFixedTokens.includes(token) && !unlockedFixedTokens.includes(token) && !novo[f][fixed.posto].includes(token)) {
                  novo[f][fixed.posto].push(token)
                }
              }
            }
          })

          const allocatedMatriculas = new Set<string>()
          Object.keys(novo[f]).forEach((posto) => {
            if (posto === "POOL") return
            const list = novo[f][posto] || []
            list.forEach((tok) => {
              const p = parseToken(tok)
              if (p) allocatedMatriculas.add(p.matricula)
            })
          })

          if (tipo === "noturna") {
            INDEPENDENT_POSTS.forEach((gId) => {
              const list = independentEstado[gId]?.[f] || []
              list.forEach((tok) => {
                const p = parseToken(tok)
                if (p) allocatedMatriculas.add(p.matricula)
              })
            })
          }

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
    }, 0)
    return () => clearTimeout(timer)
  }, [numFaixas, basePoliciais, policiaisFixos, independentEstado, presenceMap, postosLogic.postosConfig, tipo, removedFixedTokens])

  // ============================
  // LOCAL STORAGE E PERSISTÊNCIA
  // ============================
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const timer = setTimeout(() => {
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
          if (parsed.removedFixedTokens) setRemovedFixedTokens(parsed.removedFixedTokens)
          if (parsed.postosConfig) postosLogic.setPostosConfig(parsed.postosConfig)
        }, 0)
        return () => clearTimeout(timer)
      } catch {}
    }
    const timer2 = setTimeout(() => setIsLoadedFromStorage(true), 0)
    return () => clearTimeout(timer2)
  }, [LS_KEY])

  useEffect(() => {
    if (!isLoadedFromStorage) return
    const timer = setTimeout(() => {
      const payload = {
        chefe, equipe, data: dataEscala, horaInicio, horaFim, faixas: numFaixas,
        basePoliciais, estado, independentEstado, independentHorarios,
        presenceMap, removedFixedTokens, postosConfig: postosLogic.postosConfig,
      }
      localStorage.setItem(LS_KEY, JSON.stringify(payload))
    }, 600)
    return () => clearTimeout(timer)
  }, [
    isLoadedFromStorage, chefe, equipe, dataEscala, horaInicio, horaFim, numFaixas,
    basePoliciais, estado, independentEstado, independentHorarios, presenceMap, 
    removedFixedTokens, postosLogic.postosConfig, LS_KEY
  ])

  // Limpeza de pps ausentes
  useEffect(() => {
    const absentMatriculas = new Set<string>()
    basePoliciais.forEach((p) => {
      if (presenceMap[p.matricula] === false) absentMatriculas.add(p.matricula)
    })
    if (absentMatriculas.size === 0) return

    const timer = setTimeout(() => {
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
            if (changed) novo[fIdx][posto] = filtered
          }
        }
        return changed ? novo : prev
      })
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
            if (changed) novo[gId][fIdx] = filtered
          }
        }
        return changed ? novo : prev
      })
    }, 0)
    return () => clearTimeout(timer)
  }, [presenceMap, basePoliciais])

  // ============================
  // FUNÇÕES CORE DE ROOT
  // ============================
  const handleSave = () => {
    const payload = {
      chefe, equipe, data: dataEscala, horaInicio, horaFim, faixas: numFaixas,
      basePoliciais, estado, independentEstado, independentHorarios,
      presenceMap, removedFixedTokens, postosConfig: postosLogic.postosConfig,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
    toast.success("Escala gravada no navegador!")
  }

  const handleClear = () => setShowClearConfirm(true)

  const confirmClear = () => {
    setEstado({})
    setIndependentEstado(DEFAULT_INDEPENDENT_ESTADO)
    setRemovedFixedTokens([])
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.estado = {}
        parsed.independentEstado = DEFAULT_INDEPENDENT_ESTADO
        parsed.removedFixedTokens = []
        localStorage.setItem(LS_KEY, JSON.stringify(parsed))
      }
    } catch {}
    setShowClearConfirm(false)
    toast.success("Grade da escala limpa com sucesso.")
  }

  const handleSaveScaleSettings = async () => {
    setIsSavingConfig(true)
    try {
      const res = await saveScaleConfigAction(
        tipo,
        JSON.stringify(policiaisFixos),
        JSON.stringify(postosLogic.postosConfig),
        horaInicio, horaFim, String(numFaixas)
      )
      if (res.success) {
        toast.success("Configurações da escala salvas no banco de dados!")
        setShowConfig(false)
      } else {
        toast.error(res.error || "Erro ao salvar configurações no banco.")
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Erro de conexão.")
    } finally {
      setIsSavingConfig(false)
    }
  }

  const toggleFixedOfficerLock = (token: string) => {
    setUnlockedFixedTokens((prev) => {
      if (prev.includes(token)) {
        return prev.filter((t) => t !== token)
      } else {
        return [...prev, token]
      }
    })
  }

  return {
    LS_KEY,
    chefe, setChefe,
    isManualChefe, setIsManualChefe,
    equipe, setEquipe,
    dataEscala, setDataEscala,
    availableChefes,
    horaInicio, setHoraInicio,
    horaFim, setHoraFim,
    numFaixas, setNumFaixas,
    policiaisFixos, setPoliciaisFixos,
    basePoliciais, setBasePoliciais,
    estado, setEstado,
    presenceMap, setPresenceMap,
    poolFilter, setPoolFilter,
    poolSearch, setPoolSearch,
    showConfig, setShowConfig,
    isSavingConfig,
    showClearConfirm, setShowClearConfirm,
    removedFixedTokens, setRemovedFixedTokens,
    unlockedFixedTokens, setUnlockedFixedTokens,
    toggleFixedOfficerLock,
    independentHorarios, setIndependentHorarios,
    independentEstado, setIndependentEstado,
    isLoadedFromStorage,
    faixasHorario,
    parseToken,
    tokenId,
    handleSave,
    handleClear,
    confirmClear,
    handleSaveScaleSettings,
    
    // Exports from postosLogic
    ...postosLogic,
    
    // Exports from policiaisLogic
    ...policiaisLogic,
    
    // Exports from gridLogic
    ...gridLogic
  }
}

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

// Helpers definidos fora do hook/componente para pureza e conformidade com o linter
const tokenId = (matricula: string, slotIdx: number) => {
  return `PP_${matricula.replace(/\s/g, "")}_F${slotIdx}`
}

const generateMoveToken = (matricula: string, destSlot: number) => {
  return `PP_${matricula}_F${destSlot}_MOVE_${Math.random().toString(36).substring(2, 7)}`
}

const generateDupToken = (matricula: string, slotIdx: number) => {
  return `PP_${matricula}_F${slotIdx}_DUP_${Math.random().toString(36).substring(2, 7)}`
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

  const [chefe, setChefe] = useState("")
  const [isManualChefe, setIsManualChefe] = useState(false)
  const [equipe, setEquipe] = useState("")
  const [dataEscala, setDataEscala] = useState("")
  const [availableChefes, setAvailableChefes] = useState<ChefeEquipe[]>([])

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
    } else {
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
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({})

  const [poolFilter, setPoolFilter] = useState<"unallocated" | "all">("unallocated")
  const [poolSearch, setPoolSearch] = useState("")
  const [isDragOverPool, setIsDragOverPool] = useState(false)

  const [showConfig, setShowConfig] = useState(false)
  const [, setFixedNome] = useState("")
  const [fixedMatricula, setFixedMatricula] = useState("")
  const [fixedPosto, setFixedPosto] = useState("")
  const [fixedFaixa, setFixedFaixa] = useState("Faixa 1")

  const [newPostName, setNewPostName] = useState("")
  const [newPostLimit, setNewPostLimit] = useState(1)
  const [isSavingConfig, setIsSavingConfig] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [newPPNome, setNewPPNome] = useState("")
  const [newPPMatricula, setNewPPMatricula] = useState("")
  const [draggedPostName, setDraggedPostName] = useState<string | null>(null)
  const [dragOverPostName, setDragOverPostName] = useState<string | null>(null)
  const [removedFixedTokens, setRemovedFixedTokens] = useState<string[]>([])

  const [editingOfficerMatricula, setEditingOfficerMatricula] = useState<string | null>(null)
  const [editOfficerNome, setEditOfficerNome] = useState("")
  const [editOfficerMatricula, setEditOfficerMatricula] = useState("")
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([])

  const didAutoLoadTeam = useRef(false)
  useEffect(() => {
    if (!currentUser || didAutoLoadTeam.current) return
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
      selectedTeamList = equipeEcho
      teamName = "ECHO"
    } else if (uname === "delta") {
      selectedTeamList = equipeFox
      teamName = "FOX"
    }
    
    if (selectedTeamList.length > 0) {
      didAutoLoadTeam.current = true
      const timer = setTimeout(() => {
        setEquipe(teamName)
        const localData = localStorage.getItem(LS_KEY)
        if (!localData) {
          setBasePoliciais(selectedTeamList)
          const initPresence: Record<string, boolean> = {}
          selectedTeamList.forEach(p => {
            initPresence[p.matricula] = true
          })
          setPresenceMap(initPresence)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [currentUser, equipeAlfa, equipeBravo, equipeEcho, equipeFox, LS_KEY])

  const [independentHorarios, setIndependentHorarios] = useState<Record<string, string[]>>(DEFAULT_INDEPENDENT_HORARIOS)
  const [independentEstado, setIndependentEstado] = useState<Record<string, Record<number, string[]>>>(DEFAULT_INDEPENDENT_ESTADO)

  const faixasHorario = calcularFaixas(horaInicio, horaFim, numFaixas)

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

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const timer = setTimeout(() => {
      setDataEscala(today)
      getChefesAction().then((data) => {
        setAvailableChefes(data)
      })
    }, 0)
    return () => clearTimeout(timer)
  }, [])

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
            const fixedForFaixa = policiaisFixos.filter(
              (f) => f.posto === gId && f.faixa === faixaName
            )
            const currentList = [...(novo[gId][sIdx] || [])]
            let listChanged = false
            
            fixedForFaixa.forEach((fixed) => {
              const pp = basePoliciais.find((p) => p.matricula === fixed.matricula)
              if (pp) {
                const token = tokenId(pp.matricula, sIdx)
                let isAllocatedElsewhere = false
                if (estado[sIdx]) {
                  for (const pKey of Object.keys(estado[sIdx])) {
                    if (estado[sIdx][pKey] && estado[sIdx][pKey].includes(token)) {
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

                if (!isAllocatedElsewhere && !removedFixedTokens.includes(token) && !currentList.includes(token)) {
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
          for (const posto of Object.keys(postosConfig)) {
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
                  if (pKey !== fixed.posto && novo[f][pKey] && novo[f][pKey].includes(token)) {
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

                if (!isAllocatedElsewhere && !removedFixedTokens.includes(token) && !novo[f][fixed.posto].includes(token)) {
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
  }, [numFaixas, basePoliciais, policiaisFixos, independentEstado, presenceMap, postosConfig, tipo, removedFixedTokens])

  const [isLoadedFromStorage, setIsLoadedFromStorage] = useState(false)

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
          if (parsed.postosConfig) setPostosConfig(parsed.postosConfig)
        }, 0)
        return () => clearTimeout(timer)
      } catch {}
    }
    const timer2 = setTimeout(() => {
      setIsLoadedFromStorage(true)
    }, 0)
    return () => clearTimeout(timer2)
  }, [LS_KEY])

  useEffect(() => {
    if (!isLoadedFromStorage) return
    const timer = setTimeout(() => {
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
        removedFixedTokens,
        postosConfig,
      }
      localStorage.setItem(LS_KEY, JSON.stringify(payload))
    }, 600)
    return () => clearTimeout(timer)
  }, [
    isLoadedFromStorage, chefe, equipe, dataEscala, horaInicio, horaFim, numFaixas,
    basePoliciais, estado, independentEstado, independentHorarios, presenceMap, removedFixedTokens, postosConfig, LS_KEY
  ])

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
      removedFixedTokens,
      postosConfig,
    }
    localStorage.setItem(LS_KEY, JSON.stringify(payload))
    toast.success("Escala gravada no navegador!")
  }

  useEffect(() => {
    const absentMatriculas = new Set<string>()
    basePoliciais.forEach((p) => {
      if (presenceMap[p.matricula] === false) {
        absentMatriculas.add(p.matricula)
      }
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
            if (changed) {
              novo[fIdx][posto] = filtered
            }
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
            if (changed) {
              novo[gId][fIdx] = filtered
            }
          }
        }
        return changed ? novo : prev
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [presenceMap, basePoliciais])

  const handleClear = () => {
    setShowClearConfirm(true)
  }

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

  const handleDeletePost = (posto: string) => {
    setPostosConfig(prev => {
      const copy = { ...prev }
      delete copy[posto]
      return copy
    })
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
    toast.success(`Posto ${posto} removido com sucesso.`)
  }

  const handleAddPost = () => {
    const name = newPostName.trim().toUpperCase()
    if (!name) {
      toast.error("Nome do posto é obrigatório.")
      return
    }
    if (postosConfig[name]) {
      toast.error("Posto já cadastrado.")
      return
    }
    setPostosConfig(prev => ({
      ...prev,
      [name]: newPostLimit
    }))
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

    const alreadyFixed = policiaisFixos.find(
      f => f.posto === fixedPosto && f.faixa === fixedFaixa
    )
    if (alreadyFixed) {
      toast.error(`Já existe policial fixado para ${fixedPosto} na ${fixedFaixa}. Remova o existente primeiro.`)
      return
    }

    const newFixed: PolicialFixo = {
      matricula: selectedPP.matricula,
      nome: selectedPP.qra || selectedPP.nome,
      posto: fixedPosto,
      faixa: fixedFaixa
    }

    const slotIdx = Number(fixedFaixa.replace("Faixa ", "")) - 1
    const token = tokenId(selectedPP.matricula, slotIdx)
    setRemovedFixedTokens(prev => prev.filter(t => t !== token))

    setPoliciaisFixos(prev => [...prev, newFixed])
    setFixedMatricula("")
    setFixedNome("")
    toast.success("Policial inicializado no posto com sucesso!")
  }

  const handleRemoveFixedOfficer = (idx: number) => {
    const target = policiaisFixos[idx]
    if (!target) return
    const slotIdx = Number(target.faixa.replace("Faixa ", "")) - 1
    const token = tokenId(target.matricula, slotIdx)
    setRemovedFixedTokens(prev => [...prev, token])

    setPoliciaisFixos(prev => prev.filter((_, i) => i !== idx))
    handleRemoveToken(token)
    toast.success("Policial fixo desvinculado com sucesso.")
  }

  const handleAddPolicial = () => {
    const nome = newPPNome.trim().toUpperCase()
    const matricula = newPPMatricula.trim().toUpperCase()
    if (!nome || !matricula) {
      toast.error("Nome e matrícula são obrigatórios.")
      return
    }
    if (basePoliciais.some((p) => p.matricula === matricula)) {
      toast.error("Policial já cadastrado com esta matrícula.")
      return
    }
    const newPP: Policial = { nome, matricula, qra: nome }
    setBasePoliciais((prev) => [...prev, newPP])
    setPresenceMap((prev) => ({ ...prev, [matricula]: true }))
    setNewPPNome("")
    setNewPPMatricula("")
    toast.success("Policial adicionado ao efetivo do dia!")
  }

  const handleStartEditOfficer = (pp: Policial) => {
    setEditingOfficerMatricula(pp.matricula)
    setEditOfficerNome(pp.qra || pp.nome)
    setEditOfficerMatricula(pp.matricula)
  }

  const handleSaveEditOfficer = (oldMatricula: string) => {
    const nome = editOfficerNome.trim().toUpperCase()
    const matricula = editOfficerMatricula.trim().toUpperCase()
    if (!nome || !matricula) {
      toast.error("Nome e matrícula são obrigatórios.")
      return
    }
    if (matricula !== oldMatricula && basePoliciais.some(p => p.matricula === matricula)) {
      toast.error("Outro policial já usa esta matrícula.")
      return
    }
    setBasePoliciais(prev => prev.map(p => p.matricula === oldMatricula ? { ...p, nome, qra: nome, matricula } : p))
    setPresenceMap(prev => {
      const copy = { ...prev }
      if (oldMatricula !== matricula) {
        copy[matricula] = copy[oldMatricula] ?? true
        delete copy[oldMatricula]
      }
      return copy
    })
    setEditingOfficerMatricula(null)
    toast.success("Dados do policial atualizados.")
  }

  const handleDeleteOfficer = (matricula: string) => {
    setBasePoliciais(prev => prev.filter(p => p.matricula !== matricula))
    setPresenceMap(prev => {
      const copy = { ...prev }
      delete copy[matricula]
      return copy
    })
    toast.success("Policial removido do efetivo.")
  }

  const handleDeleteSelectedOfficers = () => {
    if (selectedForDeletion.length === 0) return
    setBasePoliciais(prev => prev.filter(p => !selectedForDeletion.includes(p.matricula)))
    setPresenceMap(prev => {
      const copy = { ...prev }
      selectedForDeletion.forEach(m => delete copy[m])
      return copy
    })
    setSelectedForDeletion([])
    toast.success("Policiais selecionados removidos do efetivo.")
  }

  const handlePostReorder = (targetPostName: string) => {
    if (!draggedPostName || draggedPostName === targetPostName) return
    const keys = Object.keys(postosConfig)
    const draggedIdx = keys.indexOf(draggedPostName)
    const targetIdx = keys.indexOf(targetPostName)
    if (draggedIdx === -1 || targetIdx === -1) return
    const reorderedKeys = [...keys]
    reorderedKeys.splice(draggedIdx, 1)
    reorderedKeys.splice(targetIdx, 0, draggedPostName)
    const newConfig: Record<string, number> = {}
    reorderedKeys.forEach(k => {
      newConfig[k] = postosConfig[k]
    })
    setPostosConfig(newConfig)
    setDraggedPostName(null)
    setDragOverPostName(null)
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
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro de conexão ao salvar."
      toast.error(message)
    } finally {
      setIsSavingConfig(false)
    }
  }

  const autoOcupar = (pps: Policial[], customPresence?: Record<string, boolean>) => {
    const activePresence = customPresence || presenceMap
    const allPPs = pps.length > 0 ? pps : basePoliciais
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

    for (let f = 0; f < numFaixas; f++) {
      for (const [posto, limit] of Object.entries(postosConfig)) {
        if (posto === excessPost) continue

        const currentCount = novoEstado[f][posto].length
        const slotsNeeded = limit - currentCount

        for (let i = 0; i < slotsNeeded; i++) {
          while (ppIndex < totalPP) {
            const pp = activePPs[ppIndex]
            const token = tokenId(pp.matricula, f)

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

    let fControle = 0
    for (let i = ppIndex; i < totalPP; i++) {
      const pp = activePPs[i]
      let targetSlot = fControle
      
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
          break
        }
      }
      
      const token = tokenId(pp.matricula, targetSlot)
      if (novoEstado[targetSlot][excessPost]) {
        novoEstado[targetSlot][excessPost].push(token)
      }
      fControle = (targetSlot + 1) % numFaixas
    }

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

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return
      const lines = text.split("\n")
      const imported: Policial[] = []
      lines.forEach((line) => {
        const parts = line.split(",")
        if (parts.length >= 2) {
          const nome = parts[0].trim().toUpperCase()
          const matricula = parts[1].trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, "")
          if (nome && matricula && !basePoliciais.some(p => p.matricula === matricula)) {
            imported.push({ nome, matricula, qra: nome })
          }
        }
      })
      if (imported.length > 0) {
        setBasePoliciais((prev) => [...prev, ...imported])
        const next: Record<string, boolean> = { ...presenceMap }
        imported.forEach((p) => {
          next[p.matricula] = true
        })
        setPresenceMap(next)
        toast.success(`${imported.length} policiais importados com sucesso!`)

        // Auto assign after parsing
        setTimeout(() => autoOcupar(imported, next), 50)
      } else {
        toast.error("Nenhum policial novo encontrado no CSV. Verifique a formatação (Nome, Matricula).")
      }
    }
    reader.readAsText(file)
  }

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
      : generateMoveToken(parsed.matricula, destSlot)

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
    if (!token.includes("_DUP_")) {
      setRemovedFixedTokens((prev) => [...prev, token])
    }
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

    const dupToken = generateDupToken(parsed.matricula, slotIdx)

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
    postosConfig, setPostosConfig,
    basePoliciais, setBasePoliciais,
    estado, setEstado,
    presenceMap, setPresenceMap,
    poolFilter, setPoolFilter,
    poolSearch, setPoolSearch,
    isDragOverPool, setIsDragOverPool,
    showConfig, setShowConfig,
    fixedMatricula, setFixedMatricula,
    fixedPosto, setFixedPosto,
    fixedFaixa, setFixedFaixa,
    newPostName, setNewPostName,
    newPostLimit, setNewPostLimit,
    isSavingConfig,
    showClearConfirm, setShowClearConfirm,
    newPPNome, setNewPPNome,
    newPPMatricula, setNewPPMatricula,
    draggedPostName, setDraggedPostName,
    dragOverPostName, setDragOverPostName,
    removedFixedTokens, setRemovedFixedTokens,
    editingOfficerMatricula, setEditingOfficerMatricula,
    editOfficerNome, setEditOfficerNome,
    editOfficerMatricula, setEditOfficerMatricula,
    selectedForDeletion, setSelectedForDeletion,
    independentHorarios, setIndependentHorarios,
    independentEstado, setIndependentEstado,
    isLoadedFromStorage,
    faixasHorario,
    parseToken,
    tokenId,
    handleSave,
    handleClear,
    confirmClear,
    handleDeletePost,
    handleAddPost,
    handleAddFixedOfficer,
    handleRemoveFixedOfficer,
    handleAddPolicial,
    handleStartEditOfficer,
    handleSaveEditOfficer,
    handleDeleteOfficer,
    handleDeleteSelectedOfficers,
    handlePostReorder,
    handleSaveScaleSettings,
    handleCSVUpload,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDropIntoGlobalPool,
    handleRemoveToken,
    handleDuplicateToken,
    autoOcupar
  }
}

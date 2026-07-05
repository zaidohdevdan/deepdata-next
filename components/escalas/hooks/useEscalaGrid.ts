import { useState } from "react"
import { toast } from "sonner"
import { Policial, INDEPENDENT_POSTS, PolicialFixo } from "../types"

interface UseEscalaGridProps {
  tipo: string
  numFaixas: number
  postosConfig: Record<string, number>
  basePoliciais: Policial[]
  presenceMap: Record<string, boolean>
  estado: Record<number, Record<string, string[]>>
  setEstado: React.Dispatch<React.SetStateAction<Record<number, Record<string, string[]>>>>
  independentEstado: Record<string, Record<number, string[]>>
  setIndependentEstado: React.Dispatch<React.SetStateAction<Record<string, Record<number, string[]>>>>
  removedFixedTokens: string[]
  setRemovedFixedTokens: React.Dispatch<React.SetStateAction<string[]>>
  policiaisFixos: PolicialFixo[]
  isPostPairAllowed: (postA: string, postB: string) => boolean
  tokenId: (matricula: string, slotIdx: number) => string
  generateMoveToken: (matricula: string, destSlot: number) => string
  generateDupToken: (matricula: string, slotIdx: number) => string
  parseToken: (tid: string) => (Policial & { slotIdx: number }) | null
}

export function useEscalaGrid({
  tipo, numFaixas, postosConfig, basePoliciais, presenceMap,
  estado, setEstado, independentEstado, setIndependentEstado,
  removedFixedTokens, setRemovedFixedTokens, policiaisFixos,
  isPostPairAllowed, tokenId, generateMoveToken, generateDupToken, parseToken
}: UseEscalaGridProps) {
  const [draggedToken, setDraggedToken] = useState<string | null>(null)
  const [isDragOverPool, setIsDragOverPool] = useState(false)

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
    }

    // Pre-populate fixed officers (if they are present)
    policiaisFixos.forEach((fixed) => {
      const f = Number(fixed.faixa.replace("Faixa ", "")) - 1
      if (f >= 0 && f < numFaixas) {
        const token = tokenId(fixed.matricula, f)
        const isPresent = activePresence[fixed.matricula] !== false
        if (isPresent && !removedFixedTokens.includes(token) && novoEstado[f] && novoEstado[f][fixed.posto]) {
          if (!novoEstado[f][fixed.posto].includes(token)) {
            novoEstado[f][fixed.posto].push(token)
          }
        }
      }
    })

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
    draggedToken, setDraggedToken,
    isDragOverPool, setIsDragOverPool,
    autoOcupar,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDropIntoGlobalPool,
    handleRemoveToken,
    handleDuplicateToken
  }
}

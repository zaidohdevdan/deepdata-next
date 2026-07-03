import { useState } from "react"
import { toast } from "sonner"
import { PolicialFixo } from "../types"

interface UseEscalaPostosProps {
  tipo: string
  initialPostosConfig?: string
  setEstado: React.Dispatch<React.SetStateAction<Record<number, Record<string, string[]>>>>
  setPoliciaisFixos: React.Dispatch<React.SetStateAction<PolicialFixo[]>>
}

export function useEscalaPostos({
  tipo,
  initialPostosConfig,
  setEstado,
  setPoliciaisFixos
}: UseEscalaPostosProps) {
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

  const [newPostName, setNewPostName] = useState("")
  const [newPostLimit, setNewPostLimit] = useState(1)
  const [draggedPostName, setDraggedPostName] = useState<string | null>(null)
  const [dragOverPostName, setDragOverPostName] = useState<string | null>(null)

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

  const handleEditPost = (oldName: string, newNameStr: string, newLimit: number) => {
    const newName = newNameStr.trim().toUpperCase()
    if (!newName) {
      toast.error("Nome do posto é obrigatório.")
      return
    }
    if (isNaN(newLimit) || newLimit < 1) {
      toast.error("O limite deve ser um número maior que 0.")
      return
    }
    if (oldName !== newName && postosConfig[newName]) {
      toast.error("Já existe um posto com este nome.")
      return
    }

    setPostosConfig(prev => {
      const newConfig: Record<string, number> = {}
      for (const key of Object.keys(prev)) {
        if (key === oldName) {
          newConfig[newName] = newLimit
        } else {
          newConfig[key] = prev[key]
        }
      }
      return newConfig
    })

    if (oldName !== newName) {
      setEstado(prev => {
        const copy = { ...prev }
        Object.keys(copy).forEach(f => {
          const fIdx = Number(f)
          if (copy[fIdx][oldName] !== undefined) {
            copy[fIdx][newName] = copy[fIdx][oldName]
            delete copy[fIdx][oldName]
          }
        })
        return copy
      })

      setPoliciaisFixos(prev =>
        prev.map(p => p.posto === oldName ? { ...p, posto: newName } : p)
      )
    }

    toast.success(`Posto atualizado com sucesso.`)
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

  return {
    postosConfig, setPostosConfig,
    newPostName, setNewPostName,
    newPostLimit, setNewPostLimit,
    draggedPostName, setDraggedPostName,
    dragOverPostName, setDragOverPostName,
    handleAddPost,
    handleDeletePost,
    handleEditPost,
    handlePostReorder
  }
}

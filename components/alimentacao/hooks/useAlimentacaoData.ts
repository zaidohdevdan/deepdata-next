import { useState, useEffect, useRef, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AlaDistribData, saveAlimentacaoData, clearAlimentacaoData, addAlaAction, deleteAlaAction } from "@/app/actions/alimentacao"

interface UseAlimentacaoDataArgs {
  modulo: "ALIMENTACAO" | "CAFE" | "BISCOITO"
  initialData: AlaDistribData[]
}

export function useAlimentacaoData({ modulo, initialData }: UseAlimentacaoDataArgs) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [data, setData] = useState<AlaDistribData[]>(() => {
    if (typeof window === "undefined") return initialData
    const stored = localStorage.getItem(`alimentacao_data_${modulo}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AlaDistribData[]
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      } catch {
        // fallback to initialData
      }
    }
    return initialData
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [alaToDelete, setAlaToDelete] = useState<{ id: string; name: string } | null>(null)

  const lastInitialDataRef = useRef<AlaDistribData[]>(initialData)

  useEffect(() => {
    const lastInitialData = lastInitialDataRef.current
    const initialDataChanged = initialData.length !== lastInitialData.length || !initialData.every((p, i) =>
      p.id === lastInitialData[i].id && p.internos === lastInitialData[i].internos && p.dietas === lastInitialData[i].dietas
    )

    if (initialDataChanged) {
      setData(initialData)
      lastInitialDataRef.current = initialData
    }
  }, [initialData])

  useEffect(() => {
    if (typeof window === "undefined") return
    if (data.length > 0) {
      localStorage.setItem(`alimentacao_data_${modulo}`, JSON.stringify(data))
    } else {
      localStorage.removeItem(`alimentacao_data_${modulo}`)
    }
  }, [data, modulo])

  const handleCellChange = (id: string, field: "internos" | "dietas", value: string) => {
    const numericValue = value === "" ? 0 : Math.max(0, parseInt(value, 10) || 0)
    setData((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: numericValue }
        
        if (field === "internos" && updated.dietas > numericValue) {
          updated.dietas = numericValue
        } else if (field === "dietas" && numericValue > updated.internos) {
          updated.dietas = updated.internos
        }
        return updated
      })
    )
  }

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveAlimentacaoData(modulo, data)
      if (res.success) {
        toast.success("Dados salvos com sucesso!", {
          description: "Os dados foram armazenados no banco de dados.",
        })
        router.refresh()
      } else {
        toast.error("Erro ao salvar", {
          description: res.error || "Ocorreu um erro ao salvar.",
        })
      }
    })
  }

  const handleClear = () => {
    startTransition(async () => {
      const res = await clearAlimentacaoData(modulo)
      if (res.success) {
        setData((prev) => prev.map((item) => ({ ...item, internos: 0, dietas: 0 })))
        toast.success("Dados resetados para zero.")
        setShowClearModal(false)
        router.refresh()
      } else {
        toast.error("Erro ao limpar dados.")
      }
    })
  }

  const handleAddAla = (name: string) => {
    startTransition(async () => {
      const res = await addAlaAction(name)
      if (res.success) {
        toast.success(`Ala "${name.toUpperCase()}" criada com sucesso!`)
        setShowAddModal(false)
        router.refresh()
      } else {
        toast.error("Erro ao criar ala", {
          description: res.error || "Verifique se o nome é único.",
        })
      }
    })
  }

  const handleDeleteAla = (id: string, name: string) => {
    setAlaToDelete({ id, name })
  }

  const confirmDeleteAla = () => {
    if (!alaToDelete) return
    const { id, name } = alaToDelete
    setAlaToDelete(null)

    startTransition(async () => {
      const res = await deleteAlaAction(id)
      if (res.success) {
        toast.success(`Ala "${name}" removida com sucesso.`)
        setData((prev) => prev.filter((item) => item.id !== id))
        router.refresh()
      } else {
        toast.error("Erro ao remover ala.")
      }
    })
  }

  return {
    data,
    setData,
    isPending,
    showAddModal, setShowAddModal,
    showClearModal, setShowClearModal,
    alaToDelete, setAlaToDelete,
    handleCellChange,
    handleSave,
    handleClear,
    handleAddAla,
    handleDeleteAla,
    confirmDeleteAla
  }
}

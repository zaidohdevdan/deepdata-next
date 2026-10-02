import { useState, useEffect, useTransition } from "react"
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

  const [data, setData] = useState<AlaDistribData[]>(initialData)
  const [prevInitialData, setPrevInitialData] = useState<AlaDistribData[]>(initialData)

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData)
    setData(initialData)
  }

  const [showAddModal, setShowAddModal] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  const [alaToDelete, setAlaToDelete] = useState<{ id: string; name: string } | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(`alimentacao_data_${modulo}`)
    }
  }, [modulo])

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

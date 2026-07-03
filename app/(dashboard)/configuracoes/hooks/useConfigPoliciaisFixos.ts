import { useState } from "react"
import { toast } from "sonner"
import { ConfigValues } from "@/lib/calculation"

export interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

export function useConfigPoliciaisFixos(initialConfig: ConfigValues) {
  const [policiaisFixos, setPoliciaisFixos] = useState<PolicialFixo[]>(() => {
    try { return JSON.parse(initialConfig.escalaPoliciaisFixos || "[]") } catch { return [] }
  })
  const [newNome, setNewNome] = useState("")
  const [newMatricula, setNewMatricula] = useState("")
  const [newPosto, setNewPosto] = useState("P2")
  const [newFaixa, setNewFaixa] = useState("Faixa 1")

  const handleAddPolicialFixo = () => {
    if (!newNome.trim() || !newMatricula.trim()) {
      toast.error("Nome e Matrícula são obrigatórios.")
      return
    }

    const dup = policiaisFixos.find(p => p.matricula === newMatricula.trim() && p.faixa === newFaixa)
    if (dup) {
      toast.error("Este policial já possui uma regra fixada para esta mesma faixa horária.")
      return
    }

    const item: PolicialFixo = {
      nome: newNome.trim().toUpperCase(),
      matricula: newMatricula.trim(),
      posto: newPosto,
      faixa: newFaixa,
    }

    setPoliciaisFixos(prev => [...prev, item])
    setNewNome("")
    setNewMatricula("")
    toast.success("Regra de policial fixo adicionada temporariamente. Grave as configurações.")
  }

  const handleRemovePolicialFixo = (idx: number) => {
    setPoliciaisFixos(prev => prev.filter((_, i) => i !== idx))
    toast.success("Regra removida temporariamente. Grave as configurações.")
  }

  return {
    policiaisFixos,
    setPoliciaisFixos,
    newNome,
    setNewNome,
    newMatricula,
    setNewMatricula,
    newPosto,
    setNewPosto,
    newFaixa,
    setNewFaixa,
    handleAddPolicialFixo,
    handleRemovePolicialFixo
  }
}

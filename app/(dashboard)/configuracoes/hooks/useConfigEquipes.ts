import { useState } from "react"
import { toast } from "sonner"
import { ConfigValues } from "@/lib/calculation"

export interface PolicialEquipe {
  nome: string
  qra: string
  matricula: string
}

export function useConfigEquipes(initialConfig: ConfigValues) {
  const [equipeAlfa, setEquipeAlfa] = useState<PolicialEquipe[]>(() => {
    try {
      const parsed = JSON.parse(initialConfig.equipeAlfa || "[]")
      return parsed.map((p: PolicialEquipe) => ({
        nome: p.nome,
        qra: p.qra || p.nome,
        matricula: p.matricula
      }))
    } catch { return [] }
  })
  const [equipeBravo, setEquipeBravo] = useState<PolicialEquipe[]>(() => {
    try {
      const parsed = JSON.parse(initialConfig.equipeBravo || "[]")
      return parsed.map((p: PolicialEquipe) => ({
        nome: p.nome,
        qra: p.qra || p.nome,
        matricula: p.matricula
      }))
    } catch { return [] }
  })
  const [equipeEcho, setEquipeEcho] = useState<PolicialEquipe[]>(() => {
    try {
      const parsed = JSON.parse(initialConfig.equipeEcho || "[]")
      return parsed.map((p: PolicialEquipe) => ({
        nome: p.nome,
        qra: p.qra || p.nome,
        matricula: p.matricula
      }))
    } catch { return [] }
  })
  const [equipeFox, setEquipeFox] = useState<PolicialEquipe[]>(() => {
    try {
      const parsed = JSON.parse(initialConfig.equipeFox || "[]")
      return parsed.map((p: PolicialEquipe) => ({
        nome: p.nome,
        qra: p.qra || p.nome,
        matricula: p.matricula
      }))
    } catch { return [] }
  })

  const [selectedEquipeToEdit, setSelectedEquipeToEdit] = useState<"Alfa" | "Bravo" | "Echo" | "Fox">("Alfa")
  const [newEquipeNome, setNewEquipeNome] = useState("")
  const [newEquipeQRA, setNewEquipeQRA] = useState("")
  const [newEquipeMatricula, setNewEquipeMatricula] = useState("")

  const [editingMatricula, setEditingMatricula] = useState<string | null>(null)
  const [editingNome, setEditingNome] = useState("")
  const [editingQRA, setEditingQRA] = useState("")

  const handleStartEdit = (matricula: string, nome: string, qra: string) => {
    setEditingMatricula(matricula)
    setEditingNome(nome)
    setEditingQRA(qra)
  }

  const handleCancelEdit = () => {
    setEditingMatricula(null)
    setEditingNome("")
    setEditingQRA("")
  }

  const handleSaveEdit = () => {
    const trimmedNome = editingNome.trim().toUpperCase()
    const trimmedQRA = editingQRA.trim().toUpperCase()
    if (!trimmedNome) {
      toast.error("O nome completo não pode ser vazio.")
      return
    }

    const finalQRA = trimmedQRA || trimmedNome
    const updater = (prev: PolicialEquipe[]) =>
      prev.map((p) => (p.matricula === editingMatricula ? { ...p, nome: trimmedNome, qra: finalQRA } : p))

    if (selectedEquipeToEdit === "Alfa") setEquipeAlfa(updater)
    else if (selectedEquipeToEdit === "Bravo") setEquipeBravo(updater)
    else if (selectedEquipeToEdit === "Echo") setEquipeEcho(updater)
    else setEquipeFox(updater)

    setEditingMatricula(null)
    setEditingNome("")
    setEditingQRA("")
    toast.success("Dados do policial atualizados temporariamente. Grave as configurações para salvar definitivamente.")
  }

  const getActiveEquipeList = () => {
    if (selectedEquipeToEdit === "Alfa") return equipeAlfa
    if (selectedEquipeToEdit === "Bravo") return equipeBravo
    if (selectedEquipeToEdit === "Echo") return equipeEcho
    return equipeFox
  }

  const handleAddEquipePolicial = () => {
    if (!newEquipeNome.trim() || !newEquipeMatricula.trim()) {
      toast.error("Nome e Matrícula são obrigatórios.")
      return
    }

    const currentList = getActiveEquipeList()
    const dup = currentList.find(p => p.matricula === newEquipeMatricula.trim())
    if (dup) {
      toast.error("Este policial já está cadastrado nesta equipe.")
      return
    }

    const item: PolicialEquipe = {
      nome: newEquipeNome.trim().toUpperCase(),
      qra: (newEquipeQRA.trim() || newEquipeNome.trim()).toUpperCase(),
      matricula: newEquipeMatricula.trim()
    }

    const updater = (prev: PolicialEquipe[]) => [...prev, item]
    if (selectedEquipeToEdit === "Alfa") setEquipeAlfa(updater)
    else if (selectedEquipeToEdit === "Bravo") setEquipeBravo(updater)
    else if (selectedEquipeToEdit === "Echo") setEquipeEcho(updater)
    else setEquipeFox(updater)

    setNewEquipeNome("")
    setNewEquipeQRA("")
    setNewEquipeMatricula("")
    toast.success(`Policial adicionado à Equipe ${selectedEquipeToEdit} temporariamente. Grave as configurações.`)
  }

  const handleRemoveEquipePolicial = (matricula: string) => {
    const filter = (prev: PolicialEquipe[]) => prev.filter(p => p.matricula !== matricula)
    if (selectedEquipeToEdit === "Alfa") setEquipeAlfa(filter)
    else if (selectedEquipeToEdit === "Bravo") setEquipeBravo(filter)
    else if (selectedEquipeToEdit === "Echo") setEquipeEcho(filter)
    else setEquipeFox(filter)
    toast.success("Policial removido temporariamente. Grave as configurações.")
  }

  return {
    equipeAlfa,
    equipeBravo,
    equipeEcho,
    equipeFox,
    selectedEquipeToEdit,
    setSelectedEquipeToEdit,
    newEquipeNome,
    setNewEquipeNome,
    newEquipeQRA,
    setNewEquipeQRA,
    newEquipeMatricula,
    setNewEquipeMatricula,
    editingMatricula,
    setEditingMatricula,
    editingNome,
    setEditingNome,
    editingQRA,
    setEditingQRA,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    getActiveEquipeList,
    handleAddEquipePolicial,
    handleRemoveEquipePolicial
  }
}

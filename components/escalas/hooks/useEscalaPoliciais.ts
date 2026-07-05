import { useState } from "react"
import { toast } from "sonner"
import { Policial, PolicialFixo } from "../types"

// Assume we import or pass tokenId, autoOcupar, handleRemoveToken
interface UseEscalaPoliciaisProps {
  basePoliciais: Policial[]
  setBasePoliciais: React.Dispatch<React.SetStateAction<Policial[]>>
  policiaisFixos: PolicialFixo[]
  setPoliciaisFixos: React.Dispatch<React.SetStateAction<PolicialFixo[]>>
  presenceMap: Record<string, boolean>
  setPresenceMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  removedFixedTokens: string[]
  setRemovedFixedTokens: React.Dispatch<React.SetStateAction<string[]>>
  handleRemoveToken: (token: string) => void
  autoOcupar: (pps: Policial[], customPresence?: Record<string, boolean>) => void
  tokenId: (matricula: string, slotIdx: number) => string
}

export function useEscalaPoliciais({
  basePoliciais, setBasePoliciais,
  policiaisFixos, setPoliciaisFixos,
  presenceMap, setPresenceMap,
  setRemovedFixedTokens,
  handleRemoveToken,
  autoOcupar,
  tokenId
}: UseEscalaPoliciaisProps) {
  const [fixedMatricula, setFixedMatricula] = useState("")
  const [fixedPosto, setFixedPosto] = useState("")
  const [fixedFaixa, setFixedFaixa] = useState("Faixa 1")
  const [newPPNome, setNewPPNome] = useState("")
  const [newPPMatricula, setNewPPMatricula] = useState("")
  const [editingOfficerMatricula, setEditingOfficerMatricula] = useState<string | null>(null)
  const [editOfficerNome, setEditOfficerNome] = useState("")
  const [editOfficerMatricula, setEditOfficerMatricula] = useState("")
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([])
  
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
      f => f.matricula === selectedPP.matricula && f.posto === fixedPosto && f.faixa === fixedFaixa
    )
    if (alreadyFixed) {
      toast.error(`Este policial já está fixado para ${fixedPosto} na ${fixedFaixa}.`)
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

  return {
    fixedMatricula, setFixedMatricula,
    fixedPosto, setFixedPosto,
    fixedFaixa, setFixedFaixa,
    newPPNome, setNewPPNome,
    newPPMatricula, setNewPPMatricula,
    editingOfficerMatricula, setEditingOfficerMatricula,
    editOfficerNome, setEditOfficerNome,
    editOfficerMatricula, setEditOfficerMatricula,
    selectedForDeletion, setSelectedForDeletion,
    handleAddFixedOfficer,
    handleRemoveFixedOfficer,
    handleAddPolicial,
    handleStartEditOfficer,
    handleSaveEditOfficer,
    handleDeleteOfficer,
    handleDeleteSelectedOfficers,
    handleCSVUpload
  }
}

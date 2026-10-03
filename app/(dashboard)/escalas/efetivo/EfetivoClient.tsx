"use client"

import { useState, useEffect } from "react"
import { Users } from "lucide-react"
import EfetivoChecklist from "@/components/escalas/EfetivoChecklist"
import { Policial, PolicialEquipe } from "@/components/escalas/types"

interface CurrentUser {
  username: string
  name: string
  role: string
}

interface EfetivoClientProps {
  currentUser: CurrentUser | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
}

const SHARED_PRESENCE_KEY = "escalaUPI4_shared_presence_v2"

export default function EfetivoClient(props: EfetivoClientProps) {
  const [basePoliciais, setBasePoliciais] = useState<Policial[]>([])
  const [presenceMap, setPresenceMap] = useState<Record<string, boolean>>({})

  // Local state for CRUD operations in checklist
  const [selectedForDeletion, setSelectedForDeletion] = useState<string[]>([])
  const [editingOfficerMatricula, setEditingOfficerMatricula] = useState<string | null>(null)
  const [editOfficerNome, setEditOfficerNome] = useState("")
  const [editOfficerMatricula, setEditOfficerMatricula] = useState("")
  const [newPPNome, setNewPPNome] = useState("")
  const [newPPMatricula, setNewPPMatricula] = useState("")

  // Load from shared storage
  useEffect(() => {
    const rawShared = localStorage.getItem(SHARED_PRESENCE_KEY)
    const timer = setTimeout(() => {
      if (rawShared) {
        try {
          const parsed = JSON.parse(rawShared)
          if (parsed.basePoliciais) setBasePoliciais(parsed.basePoliciais)
          if (parsed.presenceMap) setPresenceMap(parsed.presenceMap)
        } catch {}
      } else {
        // Auto load user's team as fallback
        if (props.currentUser) {
          const uname = props.currentUser.username.toLowerCase()
          let selectedTeamList: PolicialEquipe[] = []
          if (uname === "alfa") selectedTeamList = props.equipeAlfa
          else if (uname === "bravo") selectedTeamList = props.equipeBravo
          else if (uname === "echo" || uname === "charlie") selectedTeamList = props.equipeEcho
          else if (uname === "fox" || uname === "delta") selectedTeamList = props.equipeFox

          if (selectedTeamList.length > 0) {
            setBasePoliciais(selectedTeamList)
            const initPresence: Record<string, boolean> = {}
            selectedTeamList.forEach(p => { initPresence[p.matricula] = true })
            setPresenceMap(initPresence)
            
            localStorage.setItem(SHARED_PRESENCE_KEY, JSON.stringify({
              basePoliciais: selectedTeamList,
              presenceMap: initPresence
            }))
          }
        }
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [props.currentUser, props.equipeAlfa, props.equipeBravo, props.equipeEcho, props.equipeFox])

  // Sync to shared storage
  const syncToStorage = (updatedBase: Policial[], updatedPresence: Record<string, boolean>) => {
    localStorage.setItem(SHARED_PRESENCE_KEY, JSON.stringify({
      basePoliciais: updatedBase,
      presenceMap: updatedPresence
    }))
  }

  // Handlers for Checklist operations
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const text = evt.target?.result as string
      if (!text) return
      const lines = text.split("\n")
      const parsed: Policial[] = []
      const initPresence: Record<string, boolean> = {}
      lines.forEach((line) => {
        const parts = line.split(",")
        if (parts.length >= 2) {
          const nome = parts[0].trim().toUpperCase()
          const matricula = parts[1].trim().toUpperCase()
          if (nome && matricula) {
            parsed.push({ nome, matricula })
            initPresence[matricula] = true
          }
        }
      })
      if (parsed.length > 0) {
        setBasePoliciais(parsed)
        setPresenceMap(initPresence)
        syncToStorage(parsed, initPresence)
      }
    }
    reader.readAsText(file)
  }

  const handleAddPolicial = () => {
    const nome = newPPNome.trim().toUpperCase()
    const matricula = newPPMatricula.trim().toUpperCase()
    if (!nome || !matricula) return
    const exists = basePoliciais.some((p) => p.matricula === matricula)
    if (exists) return
    const updatedBase = [...basePoliciais, { nome, matricula }]
    const updatedPresence = { ...presenceMap, [matricula]: true }
    setBasePoliciais(updatedBase)
    setPresenceMap(updatedPresence)
    setNewPPNome("")
    setNewPPMatricula("")
    syncToStorage(updatedBase, updatedPresence)
  }

  const handleDeleteOfficer = (matricula: string) => {
    const updatedBase = basePoliciais.filter((p) => p.matricula !== matricula)
    const updatedPresence = { ...presenceMap }
    delete updatedPresence[matricula]
    setBasePoliciais(updatedBase)
    setPresenceMap(updatedPresence)
    syncToStorage(updatedBase, updatedPresence)
  }

  const handleDeleteSelectedOfficers = () => {
    const toDelete = new Set(selectedForDeletion)
    const updatedBase = basePoliciais.filter((p) => !toDelete.has(p.matricula))
    const updatedPresence = { ...presenceMap }
    toDelete.forEach((m) => delete updatedPresence[m])
    setBasePoliciais(updatedBase)
    setPresenceMap(updatedPresence)
    setSelectedForDeletion([])
    syncToStorage(updatedBase, updatedPresence)
  }

  const handleStartEditOfficer = (pp: Policial) => {
    setEditingOfficerMatricula(pp.matricula)
    setEditOfficerNome(pp.nome)
    setEditOfficerMatricula(pp.matricula)
  }

  const handleSaveEditOfficer = (oldMatricula: string) => {
    const nome = editOfficerNome.trim().toUpperCase()
    const matricula = editOfficerMatricula.trim().toUpperCase()
    if (!nome || !matricula) return
    const updatedBase = basePoliciais.map((p) =>
      p.matricula === oldMatricula ? { nome, matricula } : p
    )
    const updatedPresence = { ...presenceMap }
    if (oldMatricula !== matricula) {
      updatedPresence[matricula] = presenceMap[oldMatricula] ?? true
      delete updatedPresence[oldMatricula]
    }
    setBasePoliciais(updatedBase)
    setPresenceMap(updatedPresence)
    setEditingOfficerMatricula(null)
    syncToStorage(updatedBase, updatedPresence)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wide uppercase">
                <Users size={12} className="text-blue-600" />
                Contingente • UPI-4
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Controle de Contingente e Efetivo
            </h1>
            <p className="text-xs md:text-sm text-slate-500 max-w-2xl font-medium leading-relaxed">
              Carregue a relação por CSV ou gerencie manualmente os servidores presentes. O contingente ativo é sincronizado automaticamente entre todas as escalas (Diurna, Revezamento e Noturna).
            </p>
          </div>
        </div>
      </div>

      <EfetivoChecklist
        basePoliciais={basePoliciais}
        setBasePoliciais={(updated) => {
          setBasePoliciais(updated)
          syncToStorage(updated, presenceMap)
        }}
        presenceMap={presenceMap}
        setPresenceMap={(updated) => {
          setPresenceMap(updated)
          syncToStorage(basePoliciais, updated)
        }}
        currentUser={props.currentUser}
        equipeAlfa={props.equipeAlfa}
        equipeBravo={props.equipeBravo}
        equipeEcho={props.equipeEcho}
        equipeFox={props.equipeFox}
        selectedForDeletion={selectedForDeletion}
        setSelectedForDeletion={setSelectedForDeletion}
        handleDeleteSelectedOfficers={handleDeleteSelectedOfficers}
        editingOfficerMatricula={editingOfficerMatricula}
        setEditingOfficerMatricula={setEditingOfficerMatricula}
        editOfficerNome={editOfficerNome}
        setEditOfficerNome={setEditOfficerNome}
        editOfficerMatricula={editOfficerMatricula}
        setEditOfficerMatricula={setEditOfficerMatricula}
        handleSaveEditOfficer={handleSaveEditOfficer}
        handleStartEditOfficer={handleStartEditOfficer}
        handleDeleteOfficer={handleDeleteOfficer}
        newPPNome={newPPNome}
        setNewPPNome={setNewPPNome}
        newPPMatricula={newPPMatricula}
        setNewPPMatricula={setNewPPMatricula}
        handleAddPolicial={handleAddPolicial}
        handleCSVUpload={handleCSVUpload}
      />
    </div>
  )
}

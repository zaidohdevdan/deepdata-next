"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Search, Edit, Trash2, Shield, User, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getChefesAction, saveChefesAction, ChefeEquipe } from "@/app/actions/chefes"

export default function ChefesPage() {
  const [chefes, setChefes] = useState<ChefeEquipe[]>([])
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedChefe, setSelectedChefe] = useState<ChefeEquipe | null>(null)

  // Form inputs
  const [nomeInput, setNomeInput] = useState("")
  const [matriculaInput, setMatriculaInput] = useState("")
  const [equipesInput, setEquipesInput] = useState<string[]>([])

  const loadChefes = () => {
    startTransition(async () => {
      const data = await getChefesAction()
      setChefes(data)
    })
  }

  useEffect(() => {
    loadChefes()
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const nome = nomeInput.trim().toUpperCase()
    const matricula = matriculaInput.trim().toUpperCase()

    if (!nome || !matricula) {
      toast.error("Nome e matrícula são obrigatórios.")
      return
    }

    if (chefes.some(c => c.matricula === matricula)) {
      toast.error("Já existe um chefe com esta matrícula.")
      return
    }

    startTransition(async () => {
      const newChefe: ChefeEquipe = {
        id: "chefe_" + Math.random().toString(36).substr(2, 9),
        nome,
        matricula,
        equipes: equipesInput,
      }
      const updatedList = [...chefes, newChefe]
      const res = await saveChefesAction(updatedList)

      if (res.success) {
        toast.success("Chefe de equipe cadastrado com sucesso!")
        setShowAddModal(false)
        setNomeInput("")
        setMatriculaInput("")
        setEquipesInput([])
        loadChefes()
      } else {
        toast.error(res.error || "Erro ao cadastrar")
      }
    })
  }

  const handleEditOpen = (chefe: ChefeEquipe) => {
    setSelectedChefe(chefe)
    setNomeInput(chefe.nome)
    setMatriculaInput(chefe.matricula)
    setEquipesInput(chefe.equipes)
    setShowEditModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChefe) return
    const nome = nomeInput.trim().toUpperCase()
    const matricula = matriculaInput.trim().toUpperCase()

    if (!nome || !matricula) {
      toast.error("Nome e matrícula são obrigatórios.")
      return
    }

    if (chefes.some(c => c.matricula === matricula && c.id !== selectedChefe.id)) {
      toast.error("Já existe outro chefe com esta matrícula.")
      return
    }

    startTransition(async () => {
      const updatedList = chefes.map(c =>
        c.id === selectedChefe.id
          ? { ...c, nome, matricula, equipes: equipesInput }
          : c
      )
      const res = await saveChefesAction(updatedList)

      if (res.success) {
        toast.success("Chefe de equipe atualizado com sucesso!")
        setShowEditModal(false)
        setNomeInput("")
        setMatriculaInput("")
        setEquipesInput([])
        setSelectedChefe(null)
        loadChefes()
      } else {
        toast.error(res.error || "Erro ao atualizar")
      }
    })
  }

  const handleDelete = (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o chefe de equipe "${nome}"?`)) return

    startTransition(async () => {
      const updatedList = chefes.filter(c => c.id !== id)
      const res = await saveChefesAction(updatedList)

      if (res.success) {
        toast.success(`Chefe "${nome}" removido com sucesso.`)
        loadChefes()
      } else {
        toast.error(res.error || "Erro ao remover")
      }
    })
  }

  const toggleEquipeInput = (team: string) => {
    setEquipesInput(prev =>
      prev.includes(team)
        ? prev.filter(t => t !== team)
        : [...prev, team]
    )
  }

  const filteredChefes = chefes.filter(
    (c) =>
      c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.matricula.toLowerCase().includes(search.toLowerCase())
  )

  const TEAM_LABELS: Record<string, string> = {
    alfa: "Equipe Alfa",
    bravo: "Equipe Bravo",
    charlie: "Equipe Charlie (Echo)",
    delta: "Equipe Delta (Fox)",
  }

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">👮</span>
            <h1 className="text-2xl font-bold tracking-tight">Chefes de Equipe</h1>
          </div>
          <p className="text-white/80 text-sm mt-1">
            Gerencie os chefes de equipe e vincule-os às respectivas equipes de plantão do sistema DeepData.
          </p>
        </div>

        <button
          onClick={() => {
            setNomeInput("")
            setMatriculaInput("")
            setEquipesInput([])
            setShowAddModal(true)
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-violet-700 hover:bg-slate-100 rounded-xl shadow-sm transition cursor-pointer"
        >
          <Plus size={14} /> Novo Chefe
        </button>
      </div>

      {/* Search and Table block */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700"
            />
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold text-xs bg-slate-50/40 uppercase tracking-wider">
                <th className="py-3.5 px-4">Nome Completo</th>
                <th className="py-3.5 px-4">Matrícula</th>
                <th className="py-3.5 px-4">Equipes Vinculadas</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {isPending && chefes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-violet-600 mb-2" />
                    Carregando chefes de equipe...
                  </td>
                </tr>
              ) : filteredChefes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Nenhum chefe de equipe cadastrado.
                  </td>
                </tr>
              ) : (
                filteredChefes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">{c.nome}</td>
                    <td className="py-3 px-4 font-mono text-slate-600 font-bold">{c.matricula}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {c.equipes.length === 0 ? (
                          <span className="text-slate-400 italic text-xs">Sem vinculações</span>
                        ) : (
                          c.equipes.map((team) => (
                            <span key={team} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 uppercase">
                              {TEAM_LABELS[team] || team}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditOpen(c)}
                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition cursor-pointer"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.nome)}
                          className="p-1 hover:bg-rose-50 text-rose-600 rounded transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Novo Chefe de Equipe</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                  placeholder="EX: POLICIAL PENAL ALMEIDA"
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Matrícula</label>
                <input
                  type="text"
                  required
                  value={matriculaInput}
                  onChange={(e) => setMatriculaInput(e.target.value)}
                  placeholder="EX: 3048881A"
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700 uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Equipes Vinculadas</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  {Object.entries(TEAM_LABELS).map(([value, label]) => {
                    const checked = equipesInput.includes(value)
                    return (
                      <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipeInput(value)}
                          className="w-3.5 h-3.5 border border-slate-300 rounded cursor-pointer accent-violet-600"
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow transition cursor-pointer"
                >
                  {isPending ? "Cadastrando..." : "Cadastrar Chefe"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedChefe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Editar Chefe de Equipe</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700 uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Matrícula</label>
                <input
                  type="text"
                  required
                  value={matriculaInput}
                  onChange={(e) => setMatriculaInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-700 uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Equipes Vinculadas</label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  {Object.entries(TEAM_LABELS).map(([value, label]) => {
                    const checked = equipesInput.includes(value)
                    return (
                      <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipeInput(value)}
                          className="w-3.5 h-3.5 border border-slate-300 rounded cursor-pointer accent-violet-600"
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow transition cursor-pointer"
                >
                  {isPending ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

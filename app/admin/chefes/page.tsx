"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Search, Edit, Trash2, Loader2, UserCheck } from "lucide-react"
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
        id: crypto.randomUUID(),
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
    charlie: "Equipe Charlie",
    delta: "Equipe Delta",
  }

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wide uppercase">
              <UserCheck size={12} className="text-blue-600" />
              Liderança Operacional • UPI-4
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Chefes de Equipe
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
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
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus size={14} /> Novo Chefe
        </button>
      </div>

      {/* Search and Table block */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] overflow-hidden flex flex-col">
        {/* Search header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Pesquisar por nome ou matrícula..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
            />
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-500 font-black text-[11px] bg-slate-50/70 uppercase tracking-wider">
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
                    <Loader2 size={24} className="animate-spin mx-auto text-blue-600 mb-2" />
                    Carregando chefes de equipe...
                  </td>
                </tr>
              ) : filteredChefes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    Nenhum chefe de equipe cadastrado.
                  </td>
                </tr>
              ) : (
                filteredChefes.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{c.nome}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 font-bold">{c.matricula}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {c.equipes.length === 0 ? (
                          <span className="text-slate-400 italic text-xs">Sem vinculações</span>
                        ) : (
                          c.equipes.map((team) => (
                            <span key={team} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 uppercase">
                              {TEAM_LABELS[team] || team}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEditOpen(c)}
                          className="p-1.5 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition cursor-pointer"
                          title="Editar"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.nome)}
                          className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-full transition cursor-pointer"
                          title="Excluir"
                        >
                          <Trash2 size={15} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] rounded-3xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-5">Novo Chefe de Equipe</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                  placeholder="EX: POLICIAL PENAL ALMEIDA"
                  className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 uppercase bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Matrícula</label>
                <input
                  type="text"
                  required
                  value={matriculaInput}
                  onChange={(e) => setMatriculaInput(e.target.value)}
                  placeholder="EX: 3048881A"
                  className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 uppercase bg-white transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Equipes Vinculadas</label>
                <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  {Object.entries(TEAM_LABELS).map(([value, label]) => {
                    const checked = equipesInput.includes(value)
                    return (
                      <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipeInput(value)}
                          className="w-3.5 h-3.5 border border-slate-300 rounded cursor-pointer accent-blue-600"
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] rounded-3xl max-w-lg w-full p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-5">Editar Chefe de Equipe</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={nomeInput}
                  onChange={(e) => setNomeInput(e.target.value)}
                  className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 uppercase bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Matrícula</label>
                <input
                  type="text"
                  required
                  value={matriculaInput}
                  onChange={(e) => setMatriculaInput(e.target.value)}
                  className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 uppercase bg-white transition"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">Equipes Vinculadas</label>
                <div className="grid grid-cols-2 gap-2 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                  {Object.entries(TEAM_LABELS).map(([value, label]) => {
                    const checked = equipesInput.includes(value)
                    return (
                      <label key={value} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleEquipeInput(value)}
                          className="w-3.5 h-3.5 border border-slate-300 rounded cursor-pointer accent-blue-600"
                        />
                        <span>{label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-5 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
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

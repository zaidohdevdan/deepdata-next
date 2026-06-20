"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Search, Edit2, CheckCircle, XCircle, KeyRound, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { getUsersAction, createUserAction, updateUserAction, toggleUserStatusAction } from "@/app/actions/usuarios"

interface SystemUser {
  id: string
  username: string
  name: string
  role: "ADMIN" | "USER"
  active: boolean
  createdAt: Date
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<SystemUser[]>([])
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)

  // Form inputs
  const [usernameInput, setUsernameInput] = useState("")
  const [nameInput, setNameInput] = useState("")
  const [passwordInput, setPasswordInput] = useState("")
  const [roleInput, setRoleInput] = useState<"ADMIN" | "USER">("USER")

  const loadUsers = () => {
    startTransition(async () => {
      const data = await getUsersAction()
      setUsers(data as SystemUser[])
    })
  }

  // Load users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      const res = await createUserAction({
        username: usernameInput,
        name: nameInput,
        password: passwordInput,
        role: roleInput,
      })

      if (res.success) {
        toast.success("Usuário cadastrado com sucesso!")
        setShowAddModal(false)
        setUsernameInput("")
        setNameInput("")
        setPasswordInput("")
        setRoleInput("USER")
        loadUsers()
      } else {
        toast.error("Erro ao cadastrar", { description: res.error })
      }
    })
  }

  const handleEditOpen = (user: SystemUser) => {
    setSelectedUser(user)
    setNameInput(user.name)
    setRoleInput(user.role)
    setPasswordInput("") // keep empty to not change
    setShowEditModal(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    startTransition(async () => {
      const updatePayload: { name: string; role: "ADMIN" | "USER"; password?: string } = {
        name: nameInput,
        role: roleInput,
      }
      if (passwordInput.trim()) {
        updatePayload.password = passwordInput
      }

      const res = await updateUserAction(selectedUser.id, updatePayload)
      if (res.success) {
        toast.success("Usuário atualizado com sucesso!")
        setShowEditModal(false)
        setNameInput("")
        setPasswordInput("")
        setSelectedUser(null)
        loadUsers()
      } else {
        toast.error("Erro ao atualizar", { description: res.error })
      }
    })
  }

  const handleToggleStatus = (id: string, currentStatus: boolean, name: string) => {
    startTransition(async () => {
      const res = await toggleUserStatusAction(id, !currentStatus)
      if (res.success) {
        toast.success(`Usuário "${name}" ${!currentStatus ? "ativado" : "desativado"}.`)
        loadUsers()
      } else {
        toast.error("Erro ao alterar status", { description: res.error })
      }
    })
  }

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h1>
          </div>
          <p className="text-white/80 text-sm mt-1">
            Cadastre novos policiais penais ou edite as permissões de acesso ao sistema DeepData.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-violet-700 hover:bg-slate-100 rounded-xl shadow-sm transition"
        >
          <Plus size={14} /> Novo Usuário
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
              placeholder="Pesquisar por nome ou usuário..."
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
                <th className="py-3.5 px-4">Nome de Usuário</th>
                <th className="py-3.5 px-4">Permissão</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
              {isPending && users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto text-violet-600 mb-2" />
                    Carregando usuários...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Nenhum usuário cadastrado com estes termos.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.username}</td>
                    <td className="py-3 px-4">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                          Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Segurança/User
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle size={14} className="text-emerald-500" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                          <XCircle size={14} className="text-red-500" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.active, u.name)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                          u.active
                            ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {u.active ? "Desativar" : "Reativar"}
                      </button>
                      <button
                        onClick={() => handleEditOpen(u)}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md hover:bg-slate-100 transition"
                        title="Editar Usuário"
                      >
                        <Edit2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Cadastrar Novo Usuário</h3>
            <p className="text-sm text-slate-500 mb-4">
              Crie um novo login para policiais penais ou outros membros da equipe operacional.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="EX: POLICIAL ALMEIDA"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nome de Usuário (login)
                </label>
                <input
                  type="text"
                  required
                  placeholder="EX: almeida_upi4"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-800 lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Senha Provisória
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Permissão
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as "ADMIN" | "USER")}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="USER">Segurança / Usuário</option>
                  <option value="ADMIN">Administrador (Root)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow transition flex items-center gap-1.5"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Editar Usuário</h3>
            <p className="text-sm text-slate-500 mb-4">
              Atualize as permissões ou redefina a senha de <strong>{selectedUser.username}</strong>.
            </p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Alterar Senha (opcional)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Deixe em branco para manter a atual"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Permissão
                </label>
                <select
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value as "ADMIN" | "USER")}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="USER">Segurança / Usuário</option>
                  <option value="ADMIN">Administrador (Root)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedUser(null)
                  }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow transition flex items-center gap-1.5"
                >
                  {isPending && <Loader2 size={14} className="animate-spin" />}
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

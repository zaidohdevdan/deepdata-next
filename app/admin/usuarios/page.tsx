"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Search, Edit2, CheckCircle, XCircle, Loader2, Users } from "lucide-react"
import { toast } from "sonner"
import { getUsersAction, createUserAction, updateUserAction, toggleUserStatusAction } from "@/app/actions/usuarios"
import UserAddModal from "@/components/admin/usuarios/UserAddModal"
import UserEditModal from "@/components/admin/usuarios/UserEditModal"

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
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 tracking-wide uppercase">
              <Users size={12} className="text-blue-600" />
              Gestão de Acessos • UPI-4
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Gerenciamento de Usuários
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
            Cadastre novos policiais penais ou configure as permissões de acesso ao sistema DeepData.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus size={14} /> Novo Usuário
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
              placeholder="Pesquisar por nome ou usuário..."
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80">
                          Administrador
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                          Operador
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full px-2.5 py-0.5">
                          <CheckCircle size={12} className="text-emerald-500" /> Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 bg-slate-100 border border-slate-200/80 rounded-full px-2.5 py-0.5">
                          <XCircle size={12} className="text-slate-400" /> Inativo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleStatus(u.id, u.active, u.name)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border transition cursor-pointer ${
                          u.active
                            ? "bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50 hover:text-rose-600 shadow-2xs"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {u.active ? "Desativar" : "Reativar"}
                      </button>
                      <button
                        onClick={() => handleEditOpen(u)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition cursor-pointer"
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
      <UserAddModal 
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        handleCreate={handleCreate}
        nameInput={nameInput}
        setNameInput={setNameInput}
        usernameInput={usernameInput}
        setUsernameInput={setUsernameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        roleInput={roleInput}
        setRoleInput={setRoleInput}
        isPending={isPending}
      />

      {/* Edit User Modal */}
      <UserEditModal 
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        handleUpdate={handleUpdate}
        nameInput={nameInput}
        setNameInput={setNameInput}
        passwordInput={passwordInput}
        setPasswordInput={setPasswordInput}
        roleInput={roleInput}
        setRoleInput={setRoleInput}
        isPending={isPending}
      />
    </div>
  )
}

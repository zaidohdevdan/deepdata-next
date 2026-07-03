import { KeyRound, Loader2 } from "lucide-react"
import React from "react"

interface SystemUser {
  id: string
  username: string
  name: string
  role: "ADMIN" | "USER"
  active: boolean
  createdAt: Date
}

interface UserEditModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  selectedUser: SystemUser | null
  setSelectedUser: (user: SystemUser | null) => void
  handleUpdate: (e: React.FormEvent) => void
  nameInput: string
  setNameInput: (val: string) => void
  passwordInput: string
  setPasswordInput: (val: string) => void
  roleInput: "ADMIN" | "USER"
  setRoleInput: (val: "ADMIN" | "USER") => void
  isPending: boolean
}

export default function UserEditModal({
  showModal,
  setShowModal,
  selectedUser,
  setSelectedUser,
  handleUpdate,
  nameInput,
  setNameInput,
  passwordInput,
  setPasswordInput,
  roleInput,
  setRoleInput,
  isPending
}: UserEditModalProps) {
  if (!showModal || !selectedUser) return null

  return (
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
                setShowModal(false)
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
  )
}

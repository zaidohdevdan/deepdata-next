import { KeyRound, Loader2 } from "lucide-react"
import React from "react"

interface UserAddModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  handleCreate: (e: React.FormEvent) => void
  nameInput: string
  setNameInput: (val: string) => void
  usernameInput: string
  setUsernameInput: (val: string) => void
  passwordInput: string
  setPasswordInput: (val: string) => void
  roleInput: "ADMIN" | "USER"
  setRoleInput: (val: "ADMIN" | "USER") => void
  isPending: boolean
}

export default function UserAddModal({
  showModal,
  setShowModal,
  handleCreate,
  nameInput,
  setNameInput,
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  roleInput,
  setRoleInput,
  isPending
}: UserAddModalProps) {
  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] animate-in fade-in zoom-in-95 duration-150">
        <h3 className="text-lg font-black text-slate-900 mb-1.5">Cadastrar Novo Usuário</h3>
        <p className="text-xs text-slate-500 font-medium mb-5">
          Crie um novo login para policiais penais ou outros membros da equipe operacional.
        </p>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Nome Completo
            </label>
            <input
              type="text"
              required
              placeholder="EX: POLICIAL ALMEIDA"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Nome de Usuário (login)
            </label>
            <input
              type="text"
              required
              placeholder="EX: almeida_upi4"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value.toLowerCase())}
              className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 lowercase bg-white transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Senha Provisória
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              Permissão
            </label>
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value as "ADMIN" | "USER")}
              className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
            >
              <option value="USER">Operador / Segurança</option>
              <option value="ADMIN">Administrador (Root)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Cadastrar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

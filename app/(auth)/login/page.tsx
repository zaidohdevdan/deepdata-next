"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, LogIn, ShieldCheck, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = new FormData(e.currentTarget)
    const username = form.get("username") as string
    const password = form.get("password") as string

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Usuário ou senha incorretos. Verifique suas credenciais.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      {/* Card de Login no estilo Enterprise Hero / SaaS */}
      <div className="relative bg-white border border-slate-200/80 rounded-[28px] p-7 sm:p-9 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.09)] overflow-hidden">
        {/* Marcador superior sutil com gradiente azul */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

        {/* Header do Card */}
        <div className="text-center mb-7 relative pt-2">
          {/* Ícone com gradiente Royal Blue */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-black mb-3 shadow-lg shadow-blue-600/25 font-mono">
            D
          </div>

          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            DeepData Operacional
          </h1>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SISTEMA ADMINISTRATIVO</span>
          </div>

          <p className="text-xs text-slate-400 font-medium mt-2">
            Informe suas credenciais funcionais para acessar o painel
          </p>
        </div>

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Usuário */}
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-xs font-bold text-slate-700 block pl-0.5"
            >
              Usuário / Matrícula
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Ex: operador ou admin"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 transition-all duration-150"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-slate-700 block pl-0.5"
            >
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 bg-slate-50/60 text-slate-800 text-xs font-semibold outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400 transition-all duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? "Ocultar senha" : "Ver senha"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="flex items-start gap-2.5 text-xs text-rose-700 bg-rose-50 border border-rose-200/80 rounded-xl p-3 font-semibold transition-all">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white text-xs font-extrabold shadow-md shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 mt-5 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Entrar no Sistema</span>
              </>
            )}
          </button>
        </form>

        {/* Rodapé do Card */}
        <div className="mt-7 pt-4 border-t border-slate-100 text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <ShieldCheck size={13} className="text-blue-600" />
            <span>Acesso Seguro • SISTEMA ADMINISTRATIVO</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            DeepData v2.3 • Unidade Prisional de Itaitinga
          </p>
        </div>
      </div>
    </div>
  )
}

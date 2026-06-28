"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react"

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
      setError("Usuário ou senha incorretos.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card de Login */}
      <div className="glass border border-slate-200/50 dark:border-slate-800/80 card-shadow rounded-[28px] p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white text-2xl mb-4 shadow-lg shadow-blue-500/30">
            🔒
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">DeepData</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Administrativo — Acesso Restrito</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
              Usuário
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Digite seu usuário"
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-950/80 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition-all duration-200 font-semibold"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-12 py-2.5 rounded-full border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-400/20 dark:focus:ring-blue-500/10 focus:bg-white dark:focus:bg-slate-950/80 placeholder:text-slate-400 dark:placeholder:text-slate-650 transition-all duration-200 font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl px-3 py-2.5 font-semibold">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-blue-500/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all duration-150 mt-2 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Sistema desenvolvido por{" "}
            <span className="font-semibold text-blue-500 dark:text-blue-400">Daniel de Almeida</span>
          </p>
        </div>
      </div>
    </div>
  )
}

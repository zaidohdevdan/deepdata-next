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
    <div className="w-full max-w-md px-4">
      {/* Card de Login */}
      <div className="relative bg-slate-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-[32px] p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] overflow-hidden">
        {/* Decorative corner brackets for tech/military UI */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500/40"></div>
        <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500/40"></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500/40"></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500/40"></div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-2xl mb-4 shadow-[0_0_20px_rgba(16,185,129,0.15)] font-mono">
            {"{D}"}
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest uppercase">DeepData</h1>
          <div className="text-[10px] text-emerald-400/80 font-bold tracking-widest uppercase mt-1.5 flex items-center justify-center gap-1.5 bg-emerald-950/30 border border-emerald-900/30 rounded-lg py-1 px-3 w-fit mx-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            SISTEMA RESTRITO // ACESSO SEGURO
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">
              LOGIN_ID
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="USER_NAME"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-950 bg-slate-950 text-emerald-400 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-800 transition-all duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">
              ACCESS_KEY
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500/60" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-emerald-950 bg-slate-950 text-emerald-400 text-xs font-bold outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 placeholder:text-slate-800 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500/40 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-[10px] text-rose-400 bg-rose-950/20 border border-rose-900/40 rounded-xl px-3 py-2.5 font-bold uppercase tracking-wider">
              <span>[!] ERROR:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                VERIFYING...
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                ESTABLISH_SESSION
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[9px] text-slate-650 tracking-wider">
            AUTHOR_REF:{" "}
            <span className="font-bold text-slate-400">DANIEL DE ALMEIDA</span>
          </p>
        </div>
      </div>
    </div>
  )
}

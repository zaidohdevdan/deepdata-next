import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (session) redirect("/")

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-950 overflow-hidden font-mono select-none">
      {/* Background Matrix/Scanner line effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      
      {/* Laser line scanner sweep */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.5)] animate-[bounce_8s_infinite] pointer-events-none"></div>

      {/* Cyberpunk glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}

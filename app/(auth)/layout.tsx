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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden select-none">
      {/* Background Grid Pattern - Soft enterprise SaaS lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Ambient gradient glows (Royal blue & Indigo) */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Main card wrapper */}
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}

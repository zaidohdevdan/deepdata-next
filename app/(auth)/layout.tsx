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
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-tr from-slate-100 via-slate-50 to-blue-55 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20 overflow-hidden">
      {/* Soft ambient glows for premium design */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[120px] pointer-events-none"></div>
      
      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  )
}

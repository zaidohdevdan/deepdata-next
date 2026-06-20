import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) redirect("/login")
  if (session.user.role !== "ADMIN") redirect("/")

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.user.role} userName={session.user.name} />

      {/* Main content - offset by sidebar width */}
      <main className="flex-1 ml-16 lg:ml-56 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8">
          <div className="hidden lg:block">
            <span className="text-xs font-extrabold uppercase text-violet-600 tracking-wider">
              Painel Administrativo Restrito
            </span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{session.user.name}</span>
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-700">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

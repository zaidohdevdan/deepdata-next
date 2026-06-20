import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="flex min-h-screen">
      <Sidebar role={session.user.role} userName={session.user.name} />

      {/* Main content - offset by sidebar width */}
      <main className="flex-1 ml-16 lg:ml-56 min-h-screen print:ml-0 print:min-h-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-slate-200/60 flex items-center justify-between px-4 lg:px-8 print:hidden">
          <div className="hidden lg:block">
            {/* Breadcrumb placeholder - populated per page */}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{session.user.name}</span>
              {session.user.role === "ADMIN" && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
                  Admin
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-8 print:p-0">
          {children}
        </div>
      </main>
    </div>
  )
}

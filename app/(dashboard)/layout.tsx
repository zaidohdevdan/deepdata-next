import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/layout/DashboardShell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const dataHoje = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).toUpperCase()

  return (
    <DashboardShell
      role={session.user.role}
      userName={session.user.name || "Operador"}
      dataHoje={dataHoje}
    >
      {children}
    </DashboardShell>
  )
}

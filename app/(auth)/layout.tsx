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
    <div className="min-h-screen flex items-center justify-center p-4">
      {children}
    </div>
  )
}

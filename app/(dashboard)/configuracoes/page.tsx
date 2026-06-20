import { getConfigValues } from "@/lib/calculation"
import { ConfigForm } from "./ConfigForm"
import { auth } from "@/lib/auth"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-800 text-white shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-3xl">⚙️</span>
          <h1 className="text-2xl font-bold tracking-tight">Configurações Globais</h1>
        </div>
        <p className="text-white/80 text-sm mt-1">
          Ajuste as constantes matemáticas e de localização usadas em toda a lógica operacional e relatórios da unidade.
        </p>
      </div>

      <ConfigForm initialConfig={globalConfig} currentUserRole={session?.user?.role} />
    </div>
  )
}

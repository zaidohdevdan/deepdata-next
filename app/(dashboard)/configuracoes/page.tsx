import { getConfigValues } from "@/lib/calculation"
import { ConfigForm } from "./ConfigForm"
import { auth } from "@/lib/auth"
import { Settings } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ConfiguracoesPage() {
  const globalConfig = await getConfigValues()
  const session = await auth()

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner estilo Enterprise Hero */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SISTEMA ADMINISTRATIVO • UPI-4</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Settings size={18} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Parâmetros e Configurações
            </h1>
          </div>
          <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">
            Ajuste os parâmetros matemáticos, capacidades de acondicionamento (quentinhas, pães, café e biscoitos) e identificação da unidade.
          </p>
        </div>
      </div>

      <ConfigForm initialConfig={globalConfig} currentUserRole={session?.user?.role} />
    </div>
  )
}

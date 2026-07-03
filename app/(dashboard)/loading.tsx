import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">
        Carregando dados...
      </p>
    </div>
  )
}

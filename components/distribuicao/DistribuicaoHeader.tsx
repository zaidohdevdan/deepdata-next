import { useRef } from "react"
import { Upload, Download, Printer, RefreshCw } from "lucide-react"
import { DistribuicaoConfig, ConfigValues } from "@/lib/calculation"

interface DistribuicaoHeaderProps {
  config: DistribuicaoConfig
  globalConfig: ConfigValues
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onClearClick: () => void
}

export function DistribuicaoHeader({ config, globalConfig, onImport, onExport, onClearClick }: DistribuicaoHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-r ${config.headerColor} text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 print:bg-none print:text-black print:p-0 print:shadow-none print:border-b-2 print:border-slate-900 print:pb-4 print:mb-6`}>
      <div className="space-y-1 w-full">
        <div className="flex items-center gap-2">
          <span className="text-3xl print:hidden">{config.emoji}</span>
          <h1 className="text-2xl font-bold tracking-tight print:text-xl print:font-extrabold print:uppercase">{config.titulo}</h1>
        </div>
        <p className="text-white/80 text-sm print:text-slate-600 print:text-xs print:mt-1 font-semibold">
          {globalConfig.localidade || "Itaitinga"}, {globalConfig.nomeUnidade || "UPI-4"} — {new Date().toLocaleDateString("pt-BR")}
        </p>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap gap-2 print:hidden">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 backdrop-blur transition"
        >
          <Upload size={14} /> Importar Planilha
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImport}
          accept=".xlsx, .xls"
          className="hidden"
        />

        <button
          onClick={onExport}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-white hover:bg-slate-50 text-slate-900 rounded-lg shadow-md border border-transparent transition"
        >
          <Download size={14} /> Exportar Planilha
        </button>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 backdrop-blur transition"
        >
          <Printer size={14} /> Imprimir
        </button>

        <button
          onClick={onClearClick}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-500/25 hover:bg-red-500/40 text-red-100 rounded-lg border border-red-500/30 backdrop-blur transition"
        >
          <RefreshCw size={14} /> Limpar
        </button>
      </div>
    </div>
  )
}

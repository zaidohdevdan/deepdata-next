import { Upload, FileSpreadsheet, Shield } from "lucide-react"

interface UploadAreaProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function UploadArea({ onFileChange, fileInputRef }: UploadAreaProps) {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 hover:border-blue-400/80 rounded-3xl p-10 sm:p-14 text-center transition-all duration-200 flex flex-col items-center justify-center space-y-5 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.05)]">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
        <Upload size={28} />
      </div>

      <div className="space-y-1.5 max-w-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80 mb-1">
          <Shield size={12} className="text-blue-600" />
          <span>TRIAGEM DE RELATÓRIOS • UPI-4</span>
        </div>
        <h3 className="font-extrabold text-slate-800 text-lg sm:text-xl tracking-tight">
          Importar Relatório de Visitas
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed font-medium">
          Arraste uma planilha <strong>.xlsx / .xls</strong> ou relatório oficial em formato <strong>.pdf</strong> gerado pelo sistema penitenciário para processamento e filtragem imediata.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".xlsx, .xls, .pdf"
        className="hidden"
      />

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-full shadow-md shadow-blue-600/25 transition cursor-pointer"
        >
          <FileSpreadsheet size={15} />
          <span>Selecionar Arquivo do Computador</span>
        </button>
      </div>

      <div className="text-[11px] text-slate-400 font-medium">
        Processamento seguro executado 100% no seu navegador
      </div>
    </div>
  )
}

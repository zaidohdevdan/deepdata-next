import { Upload } from "lucide-react"

interface UploadAreaProps {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export function UploadArea({ onFileChange, fileInputRef }: UploadAreaProps) {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-3xl p-12 text-center transition flex flex-col items-center justify-center space-y-4">
      <div className="p-4 bg-purple-50 rounded-full text-purple-600">
        <Upload size={32} />
      </div>
      <div className="space-y-1 max-w-md">
        <h3 className="font-bold text-slate-800 text-base">Arraste ou Selecione Relatório de Visitas</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Suporta planilhas <strong>.xlsx / .xls</strong> ou relatórios oficiais em formato <strong>.pdf</strong> gerados pelo sistema. Apenas internos das alas da UPI-4 serão extraídos.
        </p>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".xlsx, .xls, .pdf"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-5 py-2 text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow transition"
      >
        Selecionar Arquivo
      </button>
    </div>
  )
}

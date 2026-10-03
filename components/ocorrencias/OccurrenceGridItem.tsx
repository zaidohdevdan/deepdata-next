import React from "react"
import { Copy, Edit, Printer } from "lucide-react"
import { toast } from "sonner"
import { handlePrintOcorrencia } from "./utils/print-ocorrencia"

interface DBInstance {
  id: string
  titulo: string
  categoria: string
  texto: string
  servidor: string
}

interface OccurrenceGridItemProps {
  occurrence: DBInstance
  onEdit: (item: DBInstance) => void
}

export default function OccurrenceGridItem({ occurrence, onEdit }: OccurrenceGridItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(occurrence.texto)
      toast.success("Ocorrência copiada!", {
        description: "Texto copiado para a área de transferência.",
      })
    } catch {
      toast.error("Falha ao copiar.")
    }
  }

  return (
    <div
      className="group relative p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all cursor-pointer"
      onClick={handleCopy}
      onDoubleClick={() => onEdit(occurrence)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{occurrence.categoria === "Saúde" ? "👨‍⚕️" : "📄"}</span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCopy()
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Copiar Texto"
          >
            <Copy size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handlePrintOcorrencia(occurrence)
            }}
            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Imprimir Ocorrência (Ficha A4)"
          >
            <Printer size={13} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(occurrence)
            }}
            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
            title="Editar"
          >
            <Edit size={13} />
          </button>
        </div>
      </div>
      <h4 className="font-extrabold text-slate-800 text-xs truncate" title={occurrence.titulo}>
        {occurrence.titulo}
      </h4>
      <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5" title={occurrence.servidor}>
        {occurrence.servidor}
      </p>
    </div>
  )
}

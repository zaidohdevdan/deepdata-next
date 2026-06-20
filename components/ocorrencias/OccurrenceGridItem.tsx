// "use client"

import React from "react";
import { Copy, Check, Edit } from "lucide-react";
import { toast } from "sonner";

interface DBInstance {
  id: string;
  titulo: string;
  categoria: string;
  texto: string;
  servidor: string;
}

interface OccurrenceGridItemProps {
  occurrence: DBInstance;
  onEdit: (item: DBInstance) => void;
}

export default function OccurrenceGridItem({ occurrence, onEdit }: OccurrenceGridItemProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(occurrence.texto);
      toast.success("Ocorrência copiada!", {
        description: "Texto copiado para a área de transferência.",
      });
    } catch (error) {
      toast.error("Falha ao copiar.");
    }
  };

  return (
    <div
      className="group relative p-4 bg-white/80 backdrop-blur-md rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={handleCopy}
      onDoubleClick={() => onEdit(occurrence)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{occurrence.categoria === "Saúde" ? "👨‍⚕️" : "📄"}</span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleCopy();
            }}
            className="text-slate-500 hover:text-slate-700"
            title="Copiar"
          >
            <Copy size={14} />
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onEdit(occurrence);
            }}
            className="text-slate-500 hover:text-blue-600"
            title="Editar"
          >
            <Edit size={14} />
          </button>
        </div>
      </div>
      <h4 className="font-semibold text-gray-800 truncate" title={occurrence.titulo}>
        {occurrence.titulo}
      </h4>
      <p className="text-xs text-gray-500 truncate" title={occurrence.servidor}>
        {occurrence.servidor}
      </p>
    </div>
  );
}

// "use client"

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddOccurrenceCardProps {
  onAdd: () => void;
}

export default function AddOccurrenceCard({ onAdd }: AddOccurrenceCardProps) {
  return (
    <div
      className="flex items-center justify-center p-4 bg-white/80 backdrop-blur-md rounded-xl border border-dashed border-gray-300 cursor-pointer hover:shadow-lg transition"
      onClick={onAdd}
    >
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
      >
        <Plus size={20} />
        <span>Adicionar Ocorrência</span>
      </Button>
    </div>
  );
}

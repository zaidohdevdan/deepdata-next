"use client"
import { useState } from "react"
import EscalasContainer from "@/components/escalas/EscalasContainer"

interface DiurnaClientProps {
  currentUser: any
  equipeAlfa: any[]
  equipeBravo: any[]
  equipeEcho: any[]
  equipeFox: any[]
  nomeUnidade: string
  localidade: string
  // Diurna
  initialPoliciaisFixosDiurna: any[]
  initialPostosConfigDiurna?: string
  initialHoraInicioDiurna?: string
  initialHoraFimDiurna?: string
  initialNumFaixasDiurna?: string
  // Alvorada
  initialPoliciaisFixosAlvorada: any[]
  initialPostosConfigAlvorada?: string
  initialHoraInicioAlvorada?: string
  initialHoraFimAlvorada?: string
  initialNumFaixasAlvorada?: string
}

export default function DiurnaClient(props: DiurnaClientProps) {
  const [activeTab, setActiveTab] = useState<"diurna" | "alvorada">("diurna")

  return (
    <div className="space-y-6">
      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab("diurna")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === "diurna"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          ☀️ Escala Diurna
        </button>
        <button
          onClick={() => setActiveTab("alvorada")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === "alvorada"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🌅 Alvorada
        </button>
      </div>

      <div>
        {activeTab === "diurna" ? (
          <EscalasContainer
            key="diurna"
            tipo="diurna"
            initialPoliciaisFixos={props.initialPoliciaisFixosDiurna}
            currentUser={props.currentUser}
            equipeAlfa={props.equipeAlfa}
            equipeBravo={props.equipeBravo}
            equipeEcho={props.equipeEcho}
            equipeFox={props.equipeFox}
            nomeUnidade={props.nomeUnidade}
            localidade={props.localidade}
            initialPostosConfig={props.initialPostosConfigDiurna}
            initialHoraInicio={props.initialHoraInicioDiurna}
            initialHoraFim={props.initialHoraFimDiurna}
            initialNumFaixas={props.initialNumFaixasDiurna}
          />
        ) : (
          <EscalasContainer
            key="alvorada"
            tipo="alvorada"
            initialPoliciaisFixos={props.initialPoliciaisFixosAlvorada}
            currentUser={props.currentUser}
            equipeAlfa={props.equipeAlfa}
            equipeBravo={props.equipeBravo}
            equipeEcho={props.equipeEcho}
            equipeFox={props.equipeFox}
            nomeUnidade={props.nomeUnidade}
            localidade={props.localidade}
            initialPostosConfig={props.initialPostosConfigAlvorada}
            initialHoraInicio={props.initialHoraInicioAlvorada}
            initialHoraFim={props.initialHoraFimAlvorada}
            initialNumFaixas={props.initialNumFaixasAlvorada}
          />
        )}
      </div>
    </div>
  )
}

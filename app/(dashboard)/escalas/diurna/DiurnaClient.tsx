"use client"
import { useState } from "react"
import EscalasContainer from "@/components/escalas/EscalasContainer"

interface PolicialEquipe {
  nome: string
  matricula: string
}

interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

interface CurrentUser {
  username: string
  name: string
  role: string
}

interface DiurnaClientProps {
  currentUser: CurrentUser | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  nomeUnidade: string
  localidade: string
  // Diurna
  initialPoliciaisFixosDiurna: PolicialFixo[]
  initialPostosConfigDiurna?: string
  initialHoraInicioDiurna?: string
  initialHoraFimDiurna?: string
  initialNumFaixasDiurna?: string
  // Alvorada
  initialPoliciaisFixosAlvorada: PolicialFixo[]
  initialPostosConfigAlvorada?: string
  initialHoraInicioAlvorada?: string
  initialHoraFimAlvorada?: string
  initialNumFaixasAlvorada?: string
}

export default function DiurnaClient(props: DiurnaClientProps) {
  const [activeTab, setActiveTab] = useState<"diurna" | "alvorada">("diurna")

  return (
    <div className="space-y-6">
      {/* Tabs Selector estilo Enterprise Hero */}
      <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs w-fit print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("diurna")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "diurna"
              ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>☀️</span>
          <span>Escala Diurna</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("alvorada")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "alvorada"
              ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>🌅</span>
          <span>Alvorada</span>
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

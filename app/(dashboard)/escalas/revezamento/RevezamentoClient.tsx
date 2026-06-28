"use client"
import { useState } from "react"
import EscalasContainer from "@/components/escalas/EscalasContainer"

interface RevezamentoClientProps {
  currentUser: any
  equipeAlfa: any[]
  equipeBravo: any[]
  equipeEcho: any[]
  equipeFox: any[]
  nomeUnidade: string
  localidade: string
  // Almoco
  initialPoliciaisFixosAlmoco: any[]
  initialPostosConfigAlmoco?: string
  initialHoraInicioAlmoco?: string
  initialHoraFimAlmoco?: string
  initialNumFaixasAlmoco?: string
  // Janta
  initialPoliciaisFixosJanta: any[]
  initialPostosConfigJanta?: string
  initialHoraInicioJanta?: string
  initialHoraFimJanta?: string
  initialNumFaixasJanta?: string
}

export default function RevezamentoClient(props: RevezamentoClientProps) {
  const [activeTab, setActiveTab] = useState<"almoco" | "janta">("almoco")

  return (
    <div className="space-y-6">
      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 print:hidden">
        <button
          onClick={() => setActiveTab("almoco")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === "almoco"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🍴 Revezamento Almoço
        </button>
        <button
          onClick={() => setActiveTab("janta")}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition ${
            activeTab === "janta"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          🍲 Revezamento Janta
        </button>
      </div>

      <div>
        {activeTab === "almoco" ? (
          <EscalasContainer
            key="almoco"
            tipo="almoco"
            initialPoliciaisFixos={props.initialPoliciaisFixosAlmoco}
            currentUser={props.currentUser}
            equipeAlfa={props.equipeAlfa}
            equipeBravo={props.equipeBravo}
            equipeEcho={props.equipeEcho}
            equipeFox={props.equipeFox}
            nomeUnidade={props.nomeUnidade}
            localidade={props.localidade}
            initialPostosConfig={props.initialPostosConfigAlmoco}
            initialHoraInicio={props.initialHoraInicioAlmoco}
            initialHoraFim={props.initialHoraFimAlmoco}
            initialNumFaixas={props.initialNumFaixasAlmoco}
          />
        ) : (
          <EscalasContainer
            key="janta"
            tipo="janta"
            initialPoliciaisFixos={props.initialPoliciaisFixosJanta}
            currentUser={props.currentUser}
            equipeAlfa={props.equipeAlfa}
            equipeBravo={props.equipeBravo}
            equipeEcho={props.equipeEcho}
            equipeFox={props.equipeFox}
            nomeUnidade={props.nomeUnidade}
            localidade={props.localidade}
            initialPostosConfig={props.initialPostosConfigJanta}
            initialHoraInicio={props.initialHoraInicioJanta}
            initialHoraFim={props.initialHoraFimJanta}
            initialNumFaixas={props.initialNumFaixasJanta}
          />
        )}
      </div>
    </div>
  )
}

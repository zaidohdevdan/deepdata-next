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

interface RevezamentoClientProps {
  currentUser: CurrentUser | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  nomeUnidade: string
  localidade: string
  // Almoco
  initialPoliciaisFixosAlmoco: PolicialFixo[]
  initialPostosConfigAlmoco?: string
  initialHoraInicioAlmoco?: string
  initialHoraFimAlmoco?: string
  initialNumFaixasAlmoco?: string
  // Janta
  initialPoliciaisFixosJanta: PolicialFixo[]
  initialPostosConfigJanta?: string
  initialHoraInicioJanta?: string
  initialHoraFimJanta?: string
  initialNumFaixasJanta?: string
}

export default function RevezamentoClient(props: RevezamentoClientProps) {
  const [activeTab, setActiveTab] = useState<"almoco" | "janta">("almoco")

  return (
    <div className="space-y-6">
      {/* Tabs Selector estilo Enterprise Hero */}
      <div className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-2xl p-1.5 shadow-2xs w-fit print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("almoco")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "almoco"
              ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>🍴</span>
          <span>Revezamento Almoço</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("janta")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "janta"
              ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>🍲</span>
          <span>Revezamento Janta</span>
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

import { useState } from "react"
import { Settings, Printer, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ChefeEquipe, Policial, PolicialFixo } from "./types"
import EscalasConfigPanel from "./EscalasConfigPanel"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface EscalasHeaderProps {
  tipo: string
  chefe: string
  setChefe: (c: string) => void
  isManualChefe: boolean
  setIsManualChefe: (m: boolean) => void
  equipe: string
  setEquipe: (e: string) => void
  dataEscala: string
  setDataEscala: (d: string) => void
  horaInicio: string
  setHoraInicio: (h: string) => void
  horaFim: string
  setHoraFim: (h: string) => void
  numFaixas: number
  setNumFaixas: (n: number) => void
  availableChefes: ChefeEquipe[]
  showConfig: boolean
  setShowConfig: (s: boolean) => void
  handleSave: () => void
  handleClear: () => void
  showClearConfirm: boolean
  setShowClearConfirm: (s: boolean) => void
  confirmClear: () => void
  // Configs Panel Props
  newPostName: string
  setNewPostName: (n: string) => void
  newPostLimit: number
  setNewPostLimit: (l: number) => void
  handleAddPost: () => void
  handleDeletePost: (p: string) => void
  postosConfig: Record<string, number>
  fixedMatricula: string
  setFixedMatricula: (m: string) => void
  fixedPosto: string
  setFixedPosto: (p: string) => void
  fixedFaixa: string
  setFixedFaixa: (f: string) => void
  handleAddFixedOfficer: () => void
  handleRemoveFixedOfficer: (i: number) => void
  policiaisFixos: PolicialFixo[]
  basePoliciais: Policial[]
  handleSaveScaleSettings: () => void
  isSavingConfig: boolean
  handleEditPost?: (oldName: string, newName: string, newLimit: number) => void
  handlePostReorder?: (targetPostName: string) => void
  draggedPostName?: string | null
  setDraggedPostName?: (name: string | null) => void
  dragOverPostName?: string | null
  setDragOverPostName?: (name: string | null) => void
}

export default function EscalasHeader({
  tipo,
  chefe,
  setChefe,
  isManualChefe,
  setIsManualChefe,
  equipe,
  setEquipe,
  dataEscala,
  setDataEscala,
  horaInicio,
  setHoraInicio,
  horaFim,
  setHoraFim,
  numFaixas,
  setNumFaixas,
  availableChefes,
  showConfig,
  setShowConfig,
  handleSave,
  handleClear,
  showClearConfirm,
  setShowClearConfirm,
  confirmClear,
  newPostName,
  setNewPostName,
  newPostLimit,
  setNewPostLimit,
  handleAddPost,
  handleDeletePost,
  postosConfig,
  fixedMatricula,
  setFixedMatricula,
  fixedPosto,
  setFixedPosto,
  fixedFaixa,
  setFixedFaixa,
  handleAddFixedOfficer,
  handleRemoveFixedOfficer,
  policiaisFixos,
  basePoliciais,
  handleSaveScaleSettings,
  isSavingConfig,
  handleEditPost,
  handlePostReorder,
  draggedPostName,
  setDraggedPostName,
  dragOverPostName,
  setDragOverPostName
}: EscalasHeaderProps) {
  const [editingPostName, setEditingPostName] = useState<string | null>(null)
  const [editPostNewName, setEditPostNewName] = useState("")
  const [editPostNewLimit, setEditPostNewLimit] = useState(1)

  return (
    <div className="print:hidden space-y-5">
      {/* Roster Header Toolbar estilo Enterprise Hero */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SISTEMA ADMINISTRATIVO • UPI-4</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Escalas de Plantão ({tipo.toUpperCase()})
          </h1>
          <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">
            Configure os postos e a presença dos servidores, defina faixas horárias e arraste para organizar o plantão da equipe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full shadow-2xs transition cursor-pointer ${
              showConfig 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80"
            }`}
          >
            <Settings size={14} />
            <span>Postos & Regras</span>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.dismiss()
              window.print()
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80 rounded-full shadow-2xs transition cursor-pointer"
          >
            <Printer size={14} />
            <span>Imprimir Escala</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <span>Gravar Escala</span>
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 rounded-full shadow-2xs transition cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Configuration Settings Box */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
              Chefe de Equipe
            </label>
            {availableChefes.length > 0 && isManualChefe && (
              <button
                type="button"
                onClick={() => {
                  setIsManualChefe(false)
                  setChefe("")
                }}
                className="text-[9px] font-bold text-blue-600 hover:text-blue-800 transition bg-transparent border-0 cursor-pointer"
              >
                Usar Lista
              </button>
            )}
          </div>
          {availableChefes.length > 0 && !isManualChefe ? (
            <select
              value={chefe}
              onChange={(e) => {
                const val = e.target.value
                if (val === "__manual__") {
                  setIsManualChefe(true)
                  setChefe("")
                } else {
                  setChefe(val)
                  const matched = availableChefes.find(c => c.nome === val)
                  if (matched && matched.equipes.length > 0) {
                    const firstTeam = matched.equipes[0]
                    setEquipe(firstTeam.charAt(0).toUpperCase() + firstTeam.slice(1))
                  }
                }
              }}
              className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
            >
              <option value="">Selecione...</option>
              {availableChefes.map(c => (
                <option key={c.id} value={c.nome}>
                  {c.nome} ({c.matricula})
                </option>
              ))}
              <option value="__manual__">Digitar manualmente...</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder="Nome do Chefe"
              value={chefe}
              onChange={(e) => setChefe(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white transition"
            />
          )}
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Nome da Equipe
          </label>
          <input
            type="text"
            placeholder="EX: EQUIPE A"
            value={equipe}
            onChange={(e) => setEquipe(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Data do Plantão
          </label>
          <input
            type="date"
            value={dataEscala}
            onChange={(e) => setDataEscala(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Hora Início
          </label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Hora Fim
          </label>
          <input
            type="time"
            value={horaFim}
            onChange={(e) => setHoraFim(e.target.value)}
            className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 transition"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Turnos / Subdivisões
          </label>
          <select
            value={numFaixas}
            onChange={(e) => setNumFaixas(Number(e.target.value))}
            disabled={tipo === "almoco" || tipo === "alvorada"}
            className="w-full px-3.5 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-700 bg-white disabled:bg-slate-50 disabled:text-slate-400 transition"
          >
            {tipo === "alvorada" ? (
              <option value={1}>1 Turno</option>
            ) : tipo === "almoco" ? (
              <option value={2}>2 Turnos</option>
            ) : (
              <>
                <option value={1}>1 Turno</option>
                <option value={2}>2 Turnos</option>
                <option value={3}>3 Turnos</option>
                <option value={4}>4 Turnos</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Collapsible config settings panel */}
      <EscalasConfigPanel
        tipo={tipo}
        numFaixas={numFaixas}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        newPostName={newPostName}
        setNewPostName={setNewPostName}
        newPostLimit={newPostLimit}
        setNewPostLimit={setNewPostLimit}
        handleAddPost={handleAddPost}
        handleDeletePost={handleDeletePost}
        postosConfig={postosConfig}
        fixedMatricula={fixedMatricula}
        setFixedMatricula={setFixedMatricula}
        fixedPosto={fixedPosto}
        setFixedPosto={setFixedPosto}
        fixedFaixa={fixedFaixa}
        setFixedFaixa={setFixedFaixa}
        handleAddFixedOfficer={handleAddFixedOfficer}
        handleRemoveFixedOfficer={handleRemoveFixedOfficer}
        policiaisFixos={policiaisFixos}
        basePoliciais={basePoliciais}
        handleSaveScaleSettings={handleSaveScaleSettings}
        isSavingConfig={isSavingConfig}
        handleEditPost={handleEditPost}
        handlePostReorder={handlePostReorder}
        draggedPostName={draggedPostName}
        setDraggedPostName={setDraggedPostName}
        dragOverPostName={dragOverPostName}
        setDragOverPostName={setDragOverPostName}
        editingPostName={editingPostName}
        setEditingPostName={setEditingPostName}
        editPostNewName={editPostNewName}
        setEditPostNewName={setEditPostNewName}
        editPostNewLimit={editPostNewLimit}
        setEditPostNewLimit={setEditPostNewLimit}
      />

      {/* Clear confirmation Dialog */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800 font-extrabold">Limpar Grade da Escala</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-500 font-semibold">
              Isto removerá a distribuição atual de servidores em todos os postos. Os policiais continuarão no efetivo de hoje para nova organização.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl text-xs font-bold border border-slate-200">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClear}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              Sim, Limpar Grade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

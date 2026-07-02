import { Settings, Printer, Trash2, X, Plus } from "lucide-react"
import { ChefeEquipe, Policial, PolicialFixo } from "./types"
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
  isSavingConfig
}: EscalasHeaderProps) {
  return (
    <div className="print:hidden space-y-6">
      {/* Roster Header Toolbar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-2xl font-bold tracking-tight">Escalas de Plantão UPI-4</h1>
          </div>
          <p className="text-white/80 text-sm">
            Configure os postos e a presença dos servidores nas Configurações da Escala, defina as faixas horárias e arraste para organizar o plantão.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-sm transition cursor-pointer ${
              showConfig 
                ? "bg-slate-600 hover:bg-slate-700 text-white" 
                : "bg-slate-800 hover:bg-slate-750 text-white border border-slate-700"
            }`}
          >
            <Settings size={14} /> Configurações
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white text-slate-800 hover:bg-slate-100 rounded-xl shadow-sm transition cursor-pointer"
          >
            <Printer size={14} /> Imprimir Escala
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition cursor-pointer"
          >
            Gravar Escala
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition cursor-pointer"
          >
            <Trash2 size={14} /> Limpar
          </button>
        </div>
      </div>

      {/* Configuration Settings Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 transition bg-transparent border-0 cursor-pointer"
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
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
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
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
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
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
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
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
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
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
            Turnos/Subdivisões
          </label>
          <select
            value={numFaixas}
            onChange={(e) => setNumFaixas(Number(e.target.value))}
            disabled={tipo === "almoco" || tipo === "alvorada"}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white disabled:bg-slate-50 disabled:text-slate-400"
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
      {showConfig && (
        <div className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Settings size={18} className="text-slate-600" />
              Configurações da Escala ({tipo.toUpperCase()})
            </h2>
            <button
              onClick={() => setShowConfig(false)}
              className="text-slate-400 hover:text-slate-600 transition bg-transparent border-0 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Posts limits config */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                1. Limite de Servidores por Posto
              </h3>
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">
                    Novo Posto
                  </label>
                  <input
                    type="text"
                    placeholder="EX: GUARIFA 2"
                    value={newPostName}
                    onChange={(e) => setNewPostName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700"
                  />
                </div>
                <div className="w-24 space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">
                    Limite/Turno
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={newPostLimit}
                    onChange={(e) => setNewPostLimit(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700"
                  />
                </div>
                <button
                  onClick={handleAddPost}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="border border-slate-100 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                      <th className="p-2 pl-4">Posto</th>
                      <th className="p-2 w-20 text-center">Limite</th>
                      <th className="p-2 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(postosConfig).map((posto) => (
                      <tr key={posto} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                        <td className="p-2 pl-4 font-bold text-slate-750">{posto}</td>
                        <td className="p-2 text-center font-bold text-slate-600">{postosConfig[posto]}</td>
                        <td className="p-2 text-right pr-4">
                          <button
                            onClick={() => handleDeletePost(posto)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Fixed/Default officers setup */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-800">
                2. Servidores Iniciais / Fixos por Posto
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">
                    Policial
                  </label>
                  <select
                    value={fixedMatricula}
                    onChange={(e) => setFixedMatricula(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {basePoliciais.map((p) => (
                      <option key={p.matricula} value={p.matricula}>
                        {p.qra || p.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">
                    Posto
                  </label>
                  <select
                    value={fixedPosto}
                    onChange={(e) => setFixedPosto(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                  >
                    <option value="">Selecione...</option>
                    {Object.keys(postosConfig).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase">
                    Turno/Faixa
                  </label>
                  <select
                    value={fixedFaixa}
                    onChange={(e) => setFixedFaixa(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
                  >
                    {Array.from({ length: numFaixas }).map((_, fIdx) => (
                      <option key={fIdx} value={`Faixa ${fIdx + 1}`}>
                        Faixa {fIdx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAddFixedOfficer}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm transition"
                >
                  Adicionar Vinculação
                </button>
              </div>

              <div className="border border-slate-100 rounded-lg overflow-hidden max-h-40 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100">
                      <th className="p-2 pl-4">Policial</th>
                      <th className="p-2">Posto</th>
                      <th className="p-2">Faixa</th>
                      <th className="p-2 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {policiaisFixos.map((f, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50">
                        <td className="p-2 pl-4 font-bold text-slate-700">{f.nome}</td>
                        <td className="p-2 text-slate-600 font-semibold">{f.posto}</td>
                        <td className="p-2 text-slate-500 font-semibold">{f.faixa}</td>
                        <td className="p-2 text-right pr-4">
                          <button
                            onClick={() => handleRemoveFixedOfficer(i)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 pt-4">
            <p className="text-[10px] text-slate-400 font-medium italic">
              * Salvar como padrão armazena estas configurações no banco de dados para os próximos plantões.
            </p>
            <button
              onClick={handleSaveScaleSettings}
              disabled={isSavingConfig}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition cursor-pointer disabled:bg-slate-350 disabled:cursor-not-allowed"
            >
              Salvar como Padrão da Escala
            </button>
          </div>
        </div>
      )}

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

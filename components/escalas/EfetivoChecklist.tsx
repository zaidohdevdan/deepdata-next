import { Plus, Check, X, Edit, Trash2, Upload } from "lucide-react"
import { Policial, PolicialEquipe } from "./types"
import { toast } from "sonner"

interface EfetivoChecklistProps {
  basePoliciais: Policial[]
  setBasePoliciais: (p: Policial[]) => void
  presenceMap: Record<string, boolean>
  setPresenceMap: (m: Record<string, boolean>) => void
  currentUser: { username: string; name: string; role: string } | null
  equipeAlfa: PolicialEquipe[]
  equipeBravo: PolicialEquipe[]
  equipeEcho: PolicialEquipe[]
  equipeFox: PolicialEquipe[]
  selectedForDeletion: string[]
  setSelectedForDeletion: (s: string[]) => void
  handleDeleteSelectedOfficers: () => void
  editingOfficerMatricula: string | null
  setEditingOfficerMatricula: (m: string | null) => void
  editOfficerNome: string
  setEditOfficerNome: (n: string) => void
  editOfficerMatricula: string
  setEditOfficerMatricula: (m: string) => void
  handleSaveEditOfficer: (oldMatricula: string) => void
  handleStartEditOfficer: (pp: Policial) => void
  handleDeleteOfficer: (matricula: string) => void
  newPPNome: string
  setNewPPNome: (n: string) => void
  newPPMatricula: string
  setNewPPMatricula: (m: string) => void
  handleAddPolicial: () => void
  handleCSVUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EfetivoChecklist({
  basePoliciais,
  setBasePoliciais,
  presenceMap,
  setPresenceMap,
  currentUser,
  equipeAlfa,
  equipeBravo,
  equipeEcho,
  equipeFox,
  selectedForDeletion,
  setSelectedForDeletion,
  handleDeleteSelectedOfficers,
  editingOfficerMatricula,
  setEditingOfficerMatricula,
  editOfficerNome,
  setEditOfficerNome,
  editOfficerMatricula,
  setEditOfficerMatricula,
  handleSaveEditOfficer,
  handleStartEditOfficer,
  handleDeleteOfficer,
  newPPNome,
  setNewPPNome,
  newPPMatricula,
  setNewPPMatricula,
  handleAddPolicial,
  handleCSVUpload
}: EfetivoChecklistProps) {
  return (
    <div className="space-y-6">
      {/* CSV Drag and Drop Upload Area */}
      {basePoliciais.length === 0 && (
        <div className="bg-white border-2 border-dashed border-blue-200/80 hover:border-blue-400 rounded-3xl p-10 text-center transition flex flex-col items-center justify-center space-y-4 print:hidden shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)]">
          <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Upload size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-slate-900 text-base">Carregar Policiais Penais</h3>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed mx-auto font-medium">
              Selecione um arquivo <strong>.csv</strong> contendo a lista dos servidores escalados para o plantão.
            </p>
            <span className="inline-block text-[11px] text-blue-700 bg-blue-50 border border-blue-200/80 rounded-full px-3 py-0.5 font-mono mt-1 font-semibold">
              Formato: nome_do_policial,matricula_do_policial (por linha)
            </span>
          </div>
          <input
            type="file"
            onChange={handleCSVUpload}
            accept=".csv, text/csv"
            className="hidden"
            id="csv-file-input"
          />
          <button
            onClick={() => document.getElementById("csv-file-input")?.click()}
            className="px-6 py-2.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            Selecionar CSV
          </button>
        </div>
      )}

      {/* Presence Checklist Box */}
      {basePoliciais.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] space-y-5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Controle de Presença do Efetivo
                <span className="px-2.5 py-0.5 text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full">
                  {basePoliciais.filter(p => presenceMap[p.matricula] !== false).length} / {basePoliciais.length} Presentes
                </span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Desmarque os policiais que faltaram ou estão de licença antes de realizar a auto-ocupação.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const allOn: Record<string, boolean> = {}
                  basePoliciais.forEach(p => allOn[p.matricula] = true)
                  setPresenceMap(allOn)
                  toast.success("Todos marcados como presentes.")
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full shadow-2xs transition cursor-pointer"
              >
                Marcar Todos
              </button>
              <button
                type="button"
                onClick={() => {
                  const allOff: Record<string, boolean> = {}
                  basePoliciais.forEach(p => allOff[p.matricula] = false)
                  setPresenceMap(allOff)
                  toast.success("Todos marcados como ausentes.")
                }}
                className="px-3.5 py-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-full shadow-2xs transition cursor-pointer"
              >
                Desmarcar Todos
              </button>
              {currentUser && (
                <button
                  type="button"
                  onClick={() => {
                    const uname = currentUser.username.toLowerCase()
                    let selectedTeamList: PolicialEquipe[] = []
                    if (uname === "alfa") selectedTeamList = equipeAlfa
                    else if (uname === "bravo") selectedTeamList = equipeBravo
                    else if (uname === "echo" || uname === "charlie") selectedTeamList = equipeEcho
                    else if (uname === "fox" || uname === "delta") selectedTeamList = equipeFox

                    if (selectedTeamList.length > 0) {
                      setBasePoliciais(selectedTeamList)
                      const initPresence: Record<string, boolean> = {}
                      selectedTeamList.forEach(p => {
                        initPresence[p.matricula] = true
                      })
                      setPresenceMap(initPresence)
                      toast.success("Escala recarregada com o efetivo padrão da equipe!")
                    } else {
                      toast.error("Nenhuma equipe vinculada a este usuário.")
                    }
                  }}
                  className="px-3.5 py-1.5 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Recarregar Efetivo
                </button>
              )}
              {selectedForDeletion.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteSelectedOfficers}
                  className="px-3.5 py-1.5 text-xs font-extrabold bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-md shadow-rose-600/20 transition cursor-pointer"
                >
                  Excluir Selecionados ({selectedForDeletion.length})
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 max-h-[420px] overflow-y-auto pr-1">
            {basePoliciais.map((pp) => {
              const isPresent = presenceMap[pp.matricula] !== false
              const isEditing = editingOfficerMatricula === pp.matricula
              const isSelectedForDel = selectedForDeletion.includes(pp.matricula)

              if (isEditing) {
                return (
                  <div
                    key={pp.matricula}
                    className="flex flex-col p-3 rounded-2xl border border-blue-400 bg-blue-50/20 text-xs font-semibold space-y-2 shadow-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        value={editOfficerNome}
                        onChange={(e) => setEditOfficerNome(e.target.value)}
                        className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[10px] font-extrabold uppercase outline-none focus:border-blue-500 text-slate-800 bg-white"
                        placeholder="Nome do Policial"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editOfficerMatricula}
                        onChange={(e) => setEditOfficerMatricula(e.target.value)}
                        className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-[10px] font-mono outline-none focus:border-blue-500 text-slate-800 bg-white"
                        placeholder="Matrícula"
                      />
                    </div>
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSaveEditOfficer(pp.matricula)}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer"
                        title="Salvar"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingOfficerMatricula(null)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition cursor-pointer"
                        title="Cancelar"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )
              }

              return (
                <div
                  key={pp.matricula}
                  onClick={() => {
                    setPresenceMap({
                      ...presenceMap,
                      [pp.matricula]: !isPresent
                    })
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs font-semibold cursor-pointer transition select-none group/card ${
                    isPresent
                      ? "bg-slate-900 border-slate-800 text-white shadow-xs"
                      : "bg-slate-50/80 border-slate-200 text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 transition ${
                      isPresent
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}>
                      {isPresent && <Check size={11} strokeWidth={3} />}
                    </div>
                    <div className="truncate">
                      <div className="truncate text-[11px] leading-tight font-extrabold">{pp.qra || pp.nome}</div>
                      <div className="text-[9px] font-mono leading-none text-slate-400 mt-0.5">{pp.matricula}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <input
                      type="checkbox"
                      checked={isSelectedForDel}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation()
                        setSelectedForDeletion(
                          e.target.checked
                            ? [...selectedForDeletion, pp.matricula]
                            : selectedForDeletion.filter(m => m !== pp.matricula)
                        )
                      }}
                      className="w-3.5 h-3.5 border border-slate-300 rounded cursor-pointer accent-rose-600 mr-0.5"
                      title="Selecionar para exclusão"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleStartEditOfficer(pp)
                      }}
                      className={`p-1 rounded transition hover:bg-white/20 cursor-pointer ${
                        isPresent ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-slate-800"
                      }`}
                      title="Editar policial"
                    >
                      <Edit size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteOfficer(pp.matricula)
                      }}
                      className={`p-1 rounded transition hover:bg-white/20 cursor-pointer ${
                        isPresent ? "text-rose-400 hover:text-rose-300" : "text-rose-500 hover:text-rose-600"
                      }`}
                      title="Excluir policial"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add New Policeman Form */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Nome do Policial
              </label>
              <input
                type="text"
                placeholder="EX: PP C. SILVA"
                value={newPPNome}
                onChange={(e) => setNewPPNome(e.target.value)}
                className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
              />
            </div>
            <div className="w-full sm:w-48 space-y-1.5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Matrícula
              </label>
              <input
                type="text"
                placeholder="EX: 4308884X"
                value={newPPMatricula}
                onChange={(e) => setNewPPMatricula(e.target.value)}
                className="w-full px-4 py-2 text-xs border border-slate-200/90 focus:border-blue-500 focus:ring-3 focus:ring-blue-100 rounded-full outline-none font-semibold text-slate-800 bg-white transition"
              />
            </div>
            <button
              onClick={handleAddPolicial}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-xs font-extrabold shadow-md shadow-blue-600/20 transition h-[36px] w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus size={14} /> Adicionar Servidor
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

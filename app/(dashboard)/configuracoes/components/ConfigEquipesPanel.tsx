import { Shield, Plus, Trash2, Edit2, Check, X } from "lucide-react"

interface EquipePolicial {
  matricula: string
  nome: string
  qra?: string
}

interface ConfigEquipes {
  equipeAlfa: EquipePolicial[]
  equipeBravo: EquipePolicial[]
  equipeEcho: EquipePolicial[]
  equipeFox: EquipePolicial[]
  selectedEquipeToEdit: "Alfa" | "Bravo" | "Echo" | "Fox"
  setSelectedEquipeToEdit: (v: "Alfa" | "Bravo" | "Echo" | "Fox") => void
  newEquipeNome: string
  setNewEquipeNome: (v: string) => void
  newEquipeQRA: string
  setNewEquipeQRA: (v: string) => void
  newEquipeMatricula: string
  setNewEquipeMatricula: (v: string) => void
  editingMatricula: string | null
  setEditingMatricula: (v: string | null) => void
  editingNome: string
  setEditingNome: (v: string) => void
  editingQRA: string
  setEditingQRA: (v: string) => void
  handleStartEdit: (matricula: string, nome: string, qra: string) => void
  handleCancelEdit: () => void
  handleSaveEdit: () => void
  getActiveEquipeList: () => EquipePolicial[]
  handleAddEquipePolicial: () => void
  handleRemoveEquipePolicial: (matricula: string) => void
}

export function ConfigEquipesPanel({ configEquipes }: { configEquipes: ConfigEquipes }) {
  const {
    equipeAlfa,
    equipeBravo,
    equipeEcho,
    equipeFox,
    selectedEquipeToEdit,
    setSelectedEquipeToEdit,
    newEquipeNome,
    setNewEquipeNome,
    newEquipeQRA,
    setNewEquipeQRA,
    newEquipeMatricula,
    setNewEquipeMatricula,
    editingMatricula,
    setEditingMatricula,
    editingNome,
    setEditingNome,
    editingQRA,
    setEditingQRA,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    getActiveEquipeList,
    handleAddEquipePolicial,
    handleRemoveEquipePolicial
  } = configEquipes

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Shield size={18} className="text-indigo-600" /> Cadastro de Policiais das Equipes (Alfa, Bravo, Echo, Fox)
      </h2>
      <p className="text-xs text-slate-500">
        Cadastre os policiais penais de cada uma das quatro equipes. Ao logar com a respectiva conta da equipe no sistema de escalas, a lista de servidores correspondente será carregada automaticamente na checklist de plantonistas.
      </p>

      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
        {(["Alfa", "Bravo", "Echo", "Fox"] as const).map((eq) => (
          <button
            key={eq}
            type="button"
            onClick={() => {
              setSelectedEquipeToEdit(eq)
              setNewEquipeNome("")
              setNewEquipeQRA("")
              setNewEquipeMatricula("")
              setEditingMatricula(null)
              setEditingNome("")
              setEditingQRA("")
            }}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${
              selectedEquipeToEdit === eq
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            Equipe {eq} ({
              eq === "Alfa" ? equipeAlfa.length :
              eq === "Bravo" ? equipeBravo.length :
              eq === "Echo" ? equipeEcho.length :
              equipeFox.length
            } PP)
          </button>
        ))}
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
        <div className="space-y-1.5 sm:col-span-1 md:col-span-2">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome Completo</label>
          <input
            type="text"
            placeholder="Ex: RAIMUNDO NONATO DA SILVA"
            value={newEquipeNome}
            onChange={(e) => setNewEquipeNome(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">QRA / Nome de Guerra</label>
          <input
            type="text"
            placeholder="Ex: R. SILVA"
            value={newEquipeQRA}
            onChange={(e) => setNewEquipeQRA(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Matrícula</label>
          <input
            type="text"
            placeholder="Ex: 543210"
            value={newEquipeMatricula}
            onChange={(e) => setNewEquipeMatricula(e.target.value)}
            className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
          />
        </div>

        <button
          type="button"
          onClick={handleAddEquipePolicial}
          className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition h-[34px] cursor-pointer"
        >
          <Plus size={14} /> Vincular Servidor
        </button>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-3">Policial Penal (Nome Completo)</th>
              <th className="p-3">QRA (Nome de Guerra)</th>
              <th className="p-3">Matrícula</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {getActiveEquipeList().length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400 italic">
                  Nenhum policial cadastrado para a Equipe {selectedEquipeToEdit}.
                </td>
              </tr>
            ) : (
              getActiveEquipeList().map((p: EquipePolicial, idx: number) => {
                const isEditing = editingMatricula === p.matricula
                return (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition font-semibold text-slate-700">
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingNome}
                          onChange={(e) => setEditingNome(e.target.value)}
                          className="px-2 py-1 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white w-full max-w-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit()
                            } else if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        p.nome
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingQRA}
                          onChange={(e) => setEditingQRA(e.target.value)}
                          placeholder="Ex: J. SILVA"
                          className="px-2 py-1 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white w-full max-w-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleSaveEdit()
                            } else if (e.key === "Escape") {
                              handleCancelEdit()
                            }
                          }}
                        />
                      ) : (
                        <span className={p.qra ? "text-slate-800" : "text-slate-400 italic font-normal"}>
                          {p.qra || p.nome}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono">{p.matricula}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={handleSaveEdit}
                              className="p-1 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition cursor-pointer"
                              title="Salvar"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition cursor-pointer"
                              title="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStartEdit(p.matricula, p.nome, p.qra || p.nome)}
                              className="p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition cursor-pointer"
                              title="Editar Nome / QRA"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveEquipePolicial(p.matricula)}
                              className="p-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { Settings, X, Plus, Edit2, Check, Trash2, GripVertical } from "lucide-react"
import { Policial, PolicialFixo } from "./types"

interface EscalasConfigPanelProps {
  tipo: string
  numFaixas: number
  showConfig: boolean
  setShowConfig: (s: boolean) => void
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
  editingPostName: string | null
  setEditingPostName: (n: string | null) => void
  editPostNewName: string
  setEditPostNewName: (n: string) => void
  editPostNewLimit: number
  setEditPostNewLimit: (n: number) => void
}

export default function EscalasConfigPanel({
  tipo,
  numFaixas,
  showConfig,
  setShowConfig,
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
  setDragOverPostName,
  editingPostName,
  setEditingPostName,
  editPostNewName,
  setEditPostNewName,
  editPostNewLimit,
  setEditPostNewLimit
}: EscalasConfigPanelProps) {
  if (!showConfig) return null;

  return (
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
                {Object.keys(postosConfig).map((posto) => {
                  const isEditing = editingPostName === posto
                  return (
                    <tr
                      key={posto}
                      draggable={!isEditing}
                      onDragStart={() => setDraggedPostName?.(posto)}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDragOverPostName?.(posto)
                      }}
                      onDragLeave={() => setDragOverPostName?.(null)}
                      onDrop={() => handlePostReorder?.(posto)}
                      className={`border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition ${
                        !isEditing ? "cursor-move" : ""
                      } ${
                        dragOverPostName === posto ? "bg-indigo-50 border-2 border-indigo-400" : ""
                      }`}
                    >
                      {isEditing ? (
                        <>
                          <td className="p-1 pl-4">
                            <input
                              type="text"
                              value={editPostNewName}
                              onChange={(e) => setEditPostNewName(e.target.value)}
                              className="w-full px-2 py-1 text-xs border border-slate-300 rounded outline-none font-bold text-slate-800"
                              autoFocus
                            />
                          </td>
                          <td className="p-1 text-center">
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={editPostNewLimit}
                              onChange={(e) => setEditPostNewLimit(Number(e.target.value))}
                              className="w-16 px-1 py-1 text-xs border border-slate-300 rounded outline-none text-center font-bold text-slate-800"
                            />
                          </td>
                          <td className="p-1 text-right pr-4 flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                handleEditPost?.(posto, editPostNewName, editPostNewLimit)
                                setEditingPostName(null)
                              }}
                              className="text-emerald-600 hover:text-emerald-800 p-1 cursor-pointer bg-transparent border-0"
                              title="Salvar edição"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPostName(null)}
                              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer bg-transparent border-0"
                              title="Cancelar"
                            >
                              <X size={14} />
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-2 pl-4 font-bold text-slate-750 flex items-center gap-2">
                            <GripVertical size={14} className="text-slate-300 shrink-0" />
                            {posto}
                          </td>
                          <td className="p-2 text-center font-bold text-slate-600">{postosConfig[posto]}</td>
                          <td className="p-2 text-right pr-4">
                            <div className="inline-flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPostName(posto)
                                  setEditPostNewName(posto)
                                  setEditPostNewLimit(postosConfig[posto])
                                }}
                                className="text-blue-500 hover:text-blue-700 p-1 cursor-pointer bg-transparent border-0"
                                title="Editar posto"
                              >
                                <Edit2 size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePost(posto)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer bg-transparent border-0"
                                title="Remover posto"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  )
                })}
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
  )
}

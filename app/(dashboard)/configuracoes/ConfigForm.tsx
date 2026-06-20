"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Save, Info, Landmark, Utensils, Coffee, Cookie, Loader2, Shield, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { saveGlobalConfigAction } from "@/app/actions/configuracoes"
import { ConfigValues } from "@/lib/calculation"

interface ConfigFormProps {
  initialConfig: ConfigValues
  currentUserRole?: string
}

interface PolicialFixo {
  matricula: string
  nome: string
  posto: string
  faixa: string
}

export function ConfigForm({ initialConfig, currentUserRole }: ConfigFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form State
  const [nomeUnidade, setNomeUnidade] = useState(initialConfig.nomeUnidade)
  const [localidade, setLocalidade] = useState(initialConfig.localidade)
  const [alimentacaoCaixaCapacidade, setAlimentacaoCaixaCapacidade] = useState(initialConfig.alimentacaoCaixaCapacidade)
  const [cafeCapacitePacote, setCafeCapacitePacote] = useState(initialConfig.cafeCapacitePacote)
  const [cafePaoesPorInterno, setCafePaoesPorInterno] = useState(initialConfig.cafePaoesPorInterno)
  const [cafeLitrosPorGarrafa, setCafeLitrosPorGarrafa] = useState(initialConfig.cafeLitrosPorGarrafa)
  const [biscoitoPorInterno, setBiscoitoPorInterno] = useState(initialConfig.biscoitoPorInterno)
  const [biscoitoCapacidadePacote, setBiscoitoCapacidadePacote] = useState(initialConfig.biscoitoCapacidadePacote)

  // Policiais Fixos states
  const [policiaisFixos, setPoliciaisFixos] = useState<PolicialFixo[]>(() => {
    try { return JSON.parse(initialConfig.escalaPoliciaisFixos || "[]") } catch { return [] }
  })
  const [newNome, setNewNome] = useState("")
  const [newMatricula, setNewMatricula] = useState("")
  const [newPosto, setNewPosto] = useState("P2")
  const [newFaixa, setNewFaixa] = useState("Faixa 1")

  // Policiais das Equipes states
  const [equipeAlfa, setEquipeAlfa] = useState<{ nome: string; matricula: string }[]>(() => {
    try { return JSON.parse(initialConfig.equipeAlfa || "[]") } catch { return [] }
  })
  const [equipeBravo, setEquipeBravo] = useState<{ nome: string; matricula: string }[]>(() => {
    try { return JSON.parse(initialConfig.equipeBravo || "[]") } catch { return [] }
  })
  const [equipeEcho, setEquipeEcho] = useState<{ nome: string; matricula: string }[]>(() => {
    try { return JSON.parse(initialConfig.equipeEcho || "[]") } catch { return [] }
  })
  const [equipeFox, setEquipeFox] = useState<{ nome: string; matricula: string }[]>(() => {
    try { return JSON.parse(initialConfig.equipeFox || "[]") } catch { return [] }
  })

  const [selectedEquipeToEdit, setSelectedEquipeToEdit] = useState<"Alfa" | "Bravo" | "Echo" | "Fox">("Alfa")
  const [newEquipeNome, setNewEquipeNome] = useState("")
  const [newEquipeMatricula, setNewEquipeMatricula] = useState("")

  const getActiveEquipeList = () => {
    if (selectedEquipeToEdit === "Alfa") return equipeAlfa
    if (selectedEquipeToEdit === "Bravo") return equipeBravo
    if (selectedEquipeToEdit === "Echo") return equipeEcho
    return equipeFox
  }

  const handleAddEquipePolicial = () => {
    if (!newEquipeNome.trim() || !newEquipeMatricula.trim()) {
      toast.error("Nome e Matrícula são obrigatórios.")
      return
    }

    const currentList = getActiveEquipeList()
    const dup = currentList.find(p => p.matricula === newEquipeMatricula.trim())
    if (dup) {
      toast.error("Este policial já está cadastrado nesta equipe.")
      return
    }

    const item = {
      nome: newEquipeNome.trim().toUpperCase(),
      matricula: newEquipeMatricula.trim()
    }

    const updater = (prev: typeof item[]) => [...prev, item]
    if (selectedEquipeToEdit === "Alfa") setEquipeAlfa(updater)
    else if (selectedEquipeToEdit === "Bravo") setEquipeBravo(updater)
    else if (selectedEquipeToEdit === "Echo") setEquipeEcho(updater)
    else setEquipeFox(updater)

    setNewEquipeNome("")
    setNewEquipeMatricula("")
    toast.success(`Policial adicionado à Equipe ${selectedEquipeToEdit} temporariamente. Grave as configurações.`)
  }

  const handleRemoveEquipePolicial = (matricula: string) => {
    const filter = (prev: { nome: string; matricula: string }[]) => prev.filter(p => p.matricula !== matricula)
    if (selectedEquipeToEdit === "Alfa") setEquipeAlfa(filter)
    else if (selectedEquipeToEdit === "Bravo") setEquipeBravo(filter)
    else if (selectedEquipeToEdit === "Echo") setEquipeEcho(filter)
    else setEquipeFox(filter)
    toast.success("Policial removido temporariamente. Grave as configurações.")
  }

  const handleAddPolicialFixo = () => {
    if (!newNome.trim() || !newMatricula.trim()) {
      toast.error("Nome e Matrícula são obrigatórios.")
      return
    }

    const dup = policiaisFixos.find(p => p.matricula === newMatricula.trim() && p.faixa === newFaixa)
    if (dup) {
      toast.error("Este policial já possui uma regra fixada para esta mesma faixa horária.")
      return
    }

    const item: PolicialFixo = {
      nome: newNome.trim().toUpperCase(),
      matricula: newMatricula.trim(),
      posto: newPosto,
      faixa: newFaixa,
    }

    setPoliciaisFixos(prev => [...prev, item])
    setNewNome("")
    setNewMatricula("")
    toast.success("Regra de policial fixo adicionada temporariamente. Grave as configurações.")
  }

  const handleRemovePolicialFixo = (idx: number) => {
    setPoliciaisFixos(prev => prev.filter((_, i) => i !== idx))
    toast.success("Regra removida temporariamente. Grave as configurações.")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(async () => {
      const res = await saveGlobalConfigAction({
        nomeUnidade,
        localidade,
        alimentacaoCaixaCapacidade,
        cafeCapacitePacote,
        cafePaoesPorInterno,
        cafeLitrosPorGarrafa,
        biscoitoPorInterno,
        biscoitoCapacidadePacote,
        escalaPoliciaisFixos: JSON.stringify(policiaisFixos),
        equipeAlfa: JSON.stringify(equipeAlfa),
        equipeBravo: JSON.stringify(equipeBravo),
        equipeEcho: JSON.stringify(equipeEcho),
        equipeFox: JSON.stringify(equipeFox),
      })

      if (res.success) {
        toast.success("Configurações atualizadas com sucesso!", {
          description: "Os novos valores já estão ativos no sistema e tabelas.",
        })
        router.refresh()
      } else {
        toast.error("Erro ao salvar configurações", {
          description: res.error,
        })
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. General Info & Locality */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Landmark size={18} className="text-violet-600" /> Identificação e Localidade
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Nome da Unidade Prisional
            </label>
            <input
              type="text"
              required
              value={nomeUnidade}
              onChange={(e) => setNomeUnidade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">EX: UPI-4, IPPOO II, etc. Exibido no cabeçalho das páginas e PDF.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Localidade / Cidade
            </label>
            <input
              type="text"
              required
              value={localidade}
              onChange={(e) => setLocalidade(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Cidade onde se localiza o estabelecimento. Exibido no rodapé impresso.</p>
          </div>
        </div>
      </div>

      {/* 2. Food / Meal constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Utensils size={18} className="text-emerald-600" /> Parâmetros de Alimentação (Almoço/Jantar)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Quentinhas por Caixa
            </label>
            <input
              type="number"
              min="1"
              required
              value={alimentacaoCaixaCapacidade}
              onChange={(e) => setAlimentacaoCaixaCapacidade(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade padrão de quentinhas normais acondicionadas em cada caixa de transporte.</p>
          </div>
        </div>
      </div>

      {/* 3. Cafe constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Coffee size={18} className="text-amber-700" /> Parâmetros de Café da Manhã
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Pães por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafePaoesPorInterno}
              onChange={(e) => setCafePaoesPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Média de pães consumidos por cada interno custodiado.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Pães por Pacote
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeCapacitePacote}
              onChange={(e) => setCafeCapacitePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade de pães contida em cada pacote fardo entregue pela panificadora.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Capacidade Garrafa Térmica (Litros)
            </label>
            <input
              type="number"
              min="1"
              required
              value={cafeLitrosPorGarrafa}
              onChange={(e) => setCafeLitrosPorGarrafa(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Relação de internos por garrafa térmica de café de grande porte (40 Litros).</p>
          </div>
        </div>
      </div>

      {/* 4. Biscuit constants */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Cookie size={18} className="text-yellow-600" /> Parâmetros de Biscoitos (Lanche)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Biscoitos por Interno
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoPorInterno}
              onChange={(e) => setBiscoitoPorInterno(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Quantidade de biscoitos unitários recomendada no cardápio diário por interno.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">
              Biscoitos por Pacote
            </label>
            <input
              type="number"
              min="1"
              required
              value={biscoitoCapacidadePacote}
              onChange={(e) => setBiscoitoCapacidadePacote(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-xl outline-none font-semibold text-slate-850"
            />
            <p className="text-[10px] text-slate-400">Capacidade de biscoitos individuais em cada fardo ou embalagem do fabricante.</p>
          </div>
        </div>
      </div>

      {/* 5. Cadastro e Elenco das Equipes */}
      {currentUserRole === "ADMIN" && (
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
                  setNewEquipeMatricula("")
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition ${
                  selectedEquipeToEdit === eq
                    ? "bg-slate-900 border-slate-900 text-white"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-55"
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

          {/* Form add policial da equipe */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1.5 sm:col-span-1 md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome do Policial da Equipe {selectedEquipeToEdit}</label>
              <input
                type="text"
                placeholder="Ex: PP RAIMUNDO SILVA"
                value={newEquipeNome}
                onChange={(e) => setNewEquipeNome(e.target.value)}
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
              className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-semibold shadow-sm transition h-[34px] cursor-pointer"
            >
              <Plus size={14} /> Vincular Servidor
            </button>
          </div>

          {/* List of members for selected team */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-55 border-b border-slate-200 font-bold text-slate-450 uppercase tracking-wider">
                  <th className="p-3">Policial Penal</th>
                  <th className="p-3">Matrícula</th>
                  <th className="p-3 text-right">Remover da Equipe {selectedEquipeToEdit}</th>
                </tr>
              </thead>
              <tbody>
                {getActiveEquipeList().length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-4 text-center text-slate-400 italic">
                      Nenhum policial cadastrado para a Equipe {selectedEquipeToEdit}.
                    </td>
                  </tr>
                ) : (
                  getActiveEquipeList().map((p, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition font-semibold text-slate-700">
                      <td className="p-3">{p.nome}</td>
                      <td className="p-3 font-mono">{p.matricula}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveEquipePolicial(p.matricula)}
                          className="p-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Policiais Fixos em Postos */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Shield size={18} className="text-blue-600" /> Policiais Fixos por Posto e Faixa
        </h2>
        <p className="text-xs text-slate-500">
          Configure policiais que devem ocupar postos fixos de forma obrigatória. Quando o CSV for importado ou a equipe for populada na escala, a atribuição do posto será feita automaticamente de acordo com as regras definidas abaixo.
        </p>

        {/* Form para adicionar novo */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome do Policial</label>
            <input
              type="text"
              placeholder="Ex: J. SILVA"
              value={newNome}
              onChange={(e) => setNewNome(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Matrícula</label>
            <input
              type="text"
              placeholder="Ex: 123456"
              value={newMatricula}
              onChange={(e) => setNewMatricula(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:ring-1 focus:ring-slate-400 rounded-lg outline-none font-semibold text-slate-700 bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Posto Fixo</label>
            <select
              value={newPosto}
              onChange={(e) => setNewPosto(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
            >
              <option value="P2">P2</option>
              <option value="VISOR">VISOR</option>
              <option value="CONTROLE">CONTROLE</option>
              <option value="SUP ABC">SUP ABC</option>
              <option value="SUP DEF">SUP DEF</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Faixa Horária</label>
            <select
              value={newFaixa}
              onChange={(e) => setNewFaixa(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none font-semibold text-slate-700 bg-white"
            >
              <option value="Faixa 1">Faixa 1 (1ª metade/turno)</option>
              <option value="Faixa 2">Faixa 2 (2ª metade/turno)</option>
              <option value="Faixa 3">Faixa 3</option>
              <option value="Faixa 4">Faixa 4</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddPolicialFixo}
            className="w-full inline-flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white rounded-lg text-xs font-semibold shadow-sm transition h-[34px] cursor-pointer"
          >
            <Plus size={14} /> Adicionar
          </button>
        </div>

        {/* Lista de Policiais Fixos */}
        <div className="border border-slate-200 rounded-xl overflow-hidden mt-3">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-55 border-b border-slate-200 font-bold text-slate-450 uppercase tracking-wider">
                <th className="p-3">Nome</th>
                <th className="p-3">Matrícula</th>
                <th className="p-3">Posto</th>
                <th className="p-3">Faixa Horária</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {policiaisFixos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-slate-400 italic">
                    Nenhum policial fixo configurado.
                  </td>
                </tr>
              ) : (
                policiaisFixos.map((p, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition font-semibold text-slate-700">
                    <td className="p-3">{p.nome}</td>
                    <td className="p-3 font-mono">{p.matricula}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-bold">
                        {p.posto}
                      </span>
                    </td>
                    <td className="p-3">{p.faixa}</td>
                    <td className="p-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemovePolicialFixo(idx)}
                        className="p-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-lg transition cursor-pointer"
                        title="Remover regra"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
        <Info size={16} className="text-slate-400 shrink-0" />
        <span>
          A alteração destes parâmetros causará recalculação instantânea em todas as colunas computadas dos respectivos painéis de distribuição (Alimentação, Café e Biscoitos) sem perda de dados históricos de internos.
        </span>
      </div>

      {/* Action Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Gravar Configurações
        </button>
      </div>
    </form>
  )
}

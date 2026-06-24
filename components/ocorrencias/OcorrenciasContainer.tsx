"use client"

import { useState, useTransition } from "react"
import { Search, Copy, Check, Info, FileText, Sparkles, Plus, Trash2, Edit, Filter, Calendar, User } from "lucide-react"
import { toast } from "sonner"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createOcorrenciaAction,
  updateOcorrenciaAction,
  deleteOcorrenciaAction,
  createCategoriaAction
} from "@/app/actions/ocorrencias"

interface Template {
  id: string
  title: string
  icon: string
  category: "Saúde" | "Jurídico/Atendimento" | "Operação/Rotina" | "Escoltas" | "Alimentação"
  text: string
}

const TEMPLATES: Template[] = [
  // SAÚDE
  {
    id: "atend-medico",
    title: "Atend. Médico",
    icon: "👨‍⚕️",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento Médico no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-odonto",
    title: "Atend. Odonto",
    icon: "🦷",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento Odontológico no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-psiquiatrico",
    title: "Atend. Psiquiátrico",
    icon: "🤪",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento Psiquiátrico no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-fisio",
    title: "Atend. Fisio",
    icon: "🦽",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento Fisioterapeuta no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-psicologico",
    title: "Atend. Psicológico",
    icon: "🧠",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento Psicológico no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-enfermagem",
    title: "Atend. Enfermagem",
    icon: "💉",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento de enfermaria no setor de saúde desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "triagem",
    title: "Triagem de Saúde",
    icon: "🔎",
    category: "Saúde",
    text: "Comunico a Vossa Senhoria que, nesta presente data, os internos da ala [ALA] foram submetidos a uma triagem no interior da referida ala. A equipe de triagem composta pela enfermeira [ENFERMEIRA], acompanhada dos demais profissionais de saúde, conforme programação previamente estabelecida, realizaram a triagem para agendamentos de atendimentos médicos, odontológicos, entre outros. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "medicao-17h",
    title: "Entrega Medicação (17h)",
    icon: "💊",
    category: "Saúde",
    text: "Comunico a vossa senhoria que, por volta das 17:00, a técnica de enfermagem [TECNICA] realizou com sucesso a entrega das medicações em todas as alas, conforme a programação estabelecida. Durante o referido procedimento os policiais penais listados na secção SERVIDORES acompanharam a profissional durante a entrega das medicações."
  },
  {
    id: "medicao-05h",
    title: "Entrega Medicação (05h)",
    icon: "💊",
    category: "Saúde",
    text: "Comunico a vossa senhoria que, por volta das 05:00, a técnica de enfermagem [TECNICA] realizou com sucesso a entrega das medicações em todas as alas, conforme a programação estabelecida. Durante o referido procedimento os policiais penais listados na secção SERVIDORES acompanharam a profissional durante a entrega das medicações."
  },

  // JURÍDICO / ATENDIMENTO
  {
    id: "atend-videoconf",
    title: "Atend. Videoconf",
    icon: "📹",
    category: "Jurídico/Atendimento",
    text: "Comunico a Vossa Senhoria que, nesta presente data, das 08h00 às 17h00, ocorrerão os atendimentos de natureza jurídica por videoconferência com os internos relacionados na seção “CUSTODIADOS” desta ocorrência, setor de SALAS DE VIDEOCONFERÊNCIA. Todo o procedimento foi supervisionado pelo(a) Policial Penal discriminado(a) na seção “SERVIDORES” e transcorreu sem alterações."
  },
  {
    id: "atend-adv-casa",
    title: "Atend. Adv. da Casa",
    icon: "👨‍💼",
    category: "Jurídico/Atendimento",
    text: "Comunico a Vossa Senhoria que, nesta presente data, no período da manhã/tarde, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento com o defensor público no auditório da videira, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "atend-adv",
    title: "Atend. Advogados",
    icon: "👨‍💼",
    category: "Jurídico/Atendimento",
    text: "Comunico a Vossa Senhoria que, nos períodos da manhã e tarde, foram realizados os atendimentos jurídicos conforme a programação estabelecida. Os detalhes da operação constam no protocolo SIGEPEN nº [PROTOCOLO], que contém a relação nominal de internos e advogados. A consulta detalhada pode ser realizada através do Sistema SIGEPEN, na aba Relatório Agendamento Jurídico. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "oficial-justica",
    title: "Oficial de Justiça",
    icon: "👨‍⚖️",
    category: "Jurídico/Atendimento",
    text: "Comunico a Vossa Senhoria que, nesta presente data, no período da manhã/tarde, os internos relacionados na seção \"CUSTODIADOS\" desta ocorrência foram conduzidos de suas respectivas celas para atendimento com o oficial de justiça, Dr [OFICIAL], nas salas de esperas desta unidade, conforme programação previamente estabelecida. Todo o procedimento foi supervisionado pelo Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "recusa-atend",
    title: "Termo de Recusa",
    icon: "❌",
    category: "Jurídico/Atendimento",
    text: "Comunico a vossa senhoria que, nesta presente data, no turno da manhã/tarde, durante a chamada dos internos para atendimento [TIPO_ATENDIMENTO], os internos listados na seção \"CUSTODIADOS\" recusaram o referido atendimento e assinaram os seus respectivos termos de recusa, conforme consta em anexo. Todo o procedimento foi supervisionado pelo(a) Policial Penal discriminado(a) na seção “SERVIDORES” e transcorreu sem outras alterações."
  },

  // OPERAÇÃO / ROTINA
  {
    id: "banho-sol",
    title: "Banho de Sol",
    icon: "☀️",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que, no período da manhã, por volta das 07h30 às 09:30, foi realizado o banho de sol dos internos da Ala [ALA], sob a vigilância aproximada dos Policiais Penais discriminados na seção “SERVIDORES” desta ocorrência. Foi realizada a vistoria estrutural em todas as celas."
  },
  {
    id: "corte-cabelo",
    title: "Corte de Cabelo",
    icon: "✂️",
    category: "Operação/Rotina",
    text: "Comunico a vossa senhoria que, nesta presente data, no período da manhã/tarde, por volta das 08:00, foi iniciado o corte de cabelo dos internos da ALA [ALA], sob a vigilância aproximada dos Policiais Penais discriminados na seção “SERVIDORES” desta ocorrência."
  },
  {
    id: "entrega-kits",
    title: "Entrega Kits SAP",
    icon: "📦",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que, nesta presente data, foi realizada a entrega dos kits fornecidos pela SAP-CE aos internos das Alas [ALAS], no período compreendido entre 08h00 e 17h00. A entrega foi devidamente acompanhada e registrada para fins de controle e prestação de contas junto à administração da unidade."
  },
  {
    id: "barbeadores",
    title: "Barbeadores Descartáveis",
    icon: "🪒",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que, nesta presente data, foi realizada a entrega dos barbeadores descartáveis aos internos das Alas [ALAS], durante o(s) período(s) manhã/tarde. A entrega transcorreu sem alterações e foi devidamente registrada para fins de controle institucional."
  },
  {
    id: "agua-potavel",
    title: "Água Potável",
    icon: "🚰",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que, durante este plantão, foi realizada a distribuição de água potável conforme o cronograma de distribuição para as ALAS desta unidade. O policial penal responsável pelo procedimento foi discriminado na seção “SERVIDORES” desta ocorrência."
  },
  {
    id: "prontidao",
    title: "Escala Prontidão",
    icon: "👮",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que os Policiais Penais discriminados na seção “SERVIDORES” desta ocorrência encontram-se de prontidão no período compreendido entre 08h00 do dia corrente e 08h00 do dia subsequente, conforme estabelece a escala de serviço vigente."
  },
  {
    id: "viatura",
    title: "Entrega de Viatura",
    icon: "🚓",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que o policial penal [POLICIAL] é o responsável pela VIATURA POLICIAL neste plantão. O referido veículo foi recebido pelo policial penal supracitado sem alterações."
  },
  {
    id: "reserva-armas",
    title: "Reserva de Armamento",
    icon: "🔫",
    category: "Operação/Rotina",
    text: "Comunico a Vossa Senhoria que o Policial Penal [SAINDO], responsável pela reserva de armamento da Equipe [EQUIPE], recebeu do Policial Penal [ENTRANDO], responsável pela reserva de armamento da Equipe [EQUIPE], este posto e todo o material bélico sem qualquer alteração."
  },
  {
    id: "bate-grade",
    title: "Bate Grade / Conf.",
    icon: "🔒",
    category: "Operação/Rotina",
    text: "Comunico a vossa senhoria que a conferência nominal dos internos e o procedimento de bate grade realizado nesta unidade prisional no período das 17:00 às 19h00 estão fundamentados nas normas de segurança, disciplina e fiscalização da execução penal, visando a prevenção de fugas e a manutenção da ordem no ambiente prisional. Ao término da inspeção, não foram detectadas irregularidades ou alterações na estrutura das celas, garantindo a integridade da segurança da unidade."
  },

  // ESCOLTAS
  {
    id: "esc-audiencia",
    title: "Escolta Audiência",
    icon: "⚖️",
    category: "Escoltas",
    text: "Comunico a Vossa Senhoria que, nesta presente data, por volta das 08h00, o interno listado na seção \"CUSTODIADOS\", foi encaminhado sob escolta para a [VARA] VARA CRIMINAL DA COMARCA DE FORTALEZA para participação em AUDIÊNCIA PRESENCIAL. A escolta foi realizada pelos Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "esc-hospital",
    title: "Escolta Hospital",
    icon: "🏥",
    category: "Escoltas",
    text: "Comunico a Vossa Senhoria que, nesta presente data, por volta das 08h00, o interno listado na seção \"CUSTODIADOS\", foi encaminhado sob escolta para o [HOSPITAL], a fim de realização de atendimento médico. A escolta foi realizada pelos Policiais Penais discriminados na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },
  {
    id: "esc-pefoce",
    title: "Escolta PEFOCE",
    icon: "🔬",
    category: "Escoltas",
    text: "Comunico a Vossa Senhoria que, nesta presente data, por volta das 08h00, o interno listado na seção \"CUSTODIADOS\", foi encaminhado sob escolta para PEFOCE - PERÍCIA FORENSE para exame pericial. A escolta foi realizada pelos Policial Penal discriminado na seção \"SERVIDORES\" desta ocorrência e transcorreu sem alterações."
  },

  // ALIMENTAÇÃO
  {
    id: "alim-cafe",
    title: "Chegada Café da Manhã",
    icon: "☕",
    category: "Alimentação",
    text: "Comunico a Vossa Senhoria que a alimentação destinada ao café da manhã chegou à unidade às 05h30min. O recebimento, separação e vistoria dos gêneros alimentícios foram realizados pelos Policiais Penais discriminados na seção \"SERVIDORES\" desta ocorrência, seguindo todos os protocolos operacionais e normas institucionais estabelecidas. A entrega do café da manhã aos internos ocorreu normalmente, sem o registro de intercorrências durante o processo."
  },
  {
    id: "alim-almoco",
    title: "Chegada Almoço",
    icon: "🍽️",
    category: "Alimentação",
    text: "Comunico a Vossa Senhoria que a alimentação destinada ao almoço chegou à unidade às 10h30min. O recebimento, separação e vistoria dos gêneros alimentícios foram realizados pelos Policiais Penais discriminados na seção \"SERVIDORES\" desta ocorrência, seguindo todos os protocolos operacionais e normas institucionais estabelecidas. A entrega do almoço aos internos ocorreu normalmente, sem o registro de intercorrências durante o processo."
  },
  {
    id: "alim-jantar",
    title: "Chegada Jantar",
    icon: "🍲",
    category: "Alimentação",
    text: "Comunico a Vossa Senhoria que a alimentação destinada ao jantar chegou à unidade às 16h30min. O recebimento, separação e vistoria dos gêneros alimentícios foram realizados pelos Policiais Penais discriminados na seção \"SERVIDORES\" desta ocorrência, seguindo todos os protocolos operacionais e normas institucionais estabelecidas. A entrega do jantar aos internos ocorreu normalmente, sem o registro de intercorrências durante o processo."
  }
]

interface DBInstance {
  id: string
  titulo: string
  categoria: string
  icone: string
  texto: string
  servidor: string
  createdAt: Date
  updatedAt: Date
}

interface OcorrenciasContainerProps {
  initialOcorrencias: DBInstance[]
  initialCategorias: string[]
  currentUserName: string
  userRole: string
}

export default function OcorrenciasContainer({
  initialOcorrencias,
  initialCategorias,
  currentUserName,
  userRole
}: OcorrenciasContainerProps) {
  const [ocorrencias, setOcorrencias] = useState<DBInstance[]>(initialOcorrencias)
  const [categorias, setCategorias] = useState<string[]>(initialCategorias)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [historySearch, setHistorySearch] = useState("")

  // FORM / DIALOG STATES
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [editingId, setEditingId] = useState<string | null>(null)

  // FORM FIELDS
  const [formTitulo, setFormTitulo] = useState("")
  const [formCategoria, setFormCategoria] = useState("Operação/Rotina")
  const [formIcone, setFormIcone] = useState("📋")
  const [formTexto, setFormTexto] = useState("")
  const [formServidor, setFormServidor] = useState(currentUserName)

  // DELETE STATES
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // NEW CATEGORY STATE
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")


  const formCategories = [...categorias, "Outros"]

  const CATEGORY_ICONS: Record<string, string> = {
    "Saúde": "🏥",
    "Jurídico/Atendimento": "⚖️",
    "Operação/Rotina": "🔒",
    "Escoltas": "🚔",
    "Alimentação": "🍽️",
    "Outros": "📋",
  }


  const openNewForm = (presetText?: string, presetCategory?: string, presetTitle?: string, presetIcon?: string) => {
    setEditingId(null)
    setFormTitulo(presetTitle || "")
    setFormCategoria(presetCategory || "Operação/Rotina")
    setFormIcone(presetIcon || "📋")
    setFormTexto(presetText || "")
    setFormServidor(currentUserName)
    setIsFormOpen(true)
  }

  const openEditForm = (item: DBInstance) => {
    setEditingId(item.id)
    setFormTitulo(item.titulo)
    setFormCategoria(item.categoria)
    setFormIcone(item.icone || "📋")
    setFormTexto(item.texto)
    setFormServidor(item.servidor)
    setIsFormOpen(true)
  }

  const handleSave = () => {
    if (!formTitulo.trim()) {
      toast.error("O título é obrigatório.")
      return
    }
    if (!formTexto.trim()) {
      toast.error("O texto da ocorrência é obrigatório.")
      return
    }
    if (!formServidor.trim()) {
      toast.error("O nome do servidor é obrigatório.")
      return
    }

    startTransition(async () => {
      const data = {
        titulo: formTitulo,
        categoria: formCategoria,
        icone: formIcone,
        texto: formTexto,
        servidor: formServidor,
      }

      if (editingId) {
        // UPDATE
        const res = await updateOcorrenciaAction(editingId, data)
        if (res.success && res.data) {
          toast.success("Ocorrência atualizada com sucesso!")
          setOcorrencias(prev => prev.map(o => o.id === editingId ? res.data! : o))
          setIsFormOpen(false)
        } else {
          toast.error(res.error || "Erro ao atualizar ocorrência")
        }
      } else {
        // CREATE
        const res = await createOcorrenciaAction(data)
        if (res.success && res.data) {
          toast.success("Ocorrência registrada no Livro de Ocorrências!")
          setOcorrencias(prev => [res.data!, ...prev])
          setIsFormOpen(false)
        } else {
          toast.error(res.error || "Erro ao registrar ocorrência")
        }
      }
    })
  }

  const confirmDelete = (id: string) => {
    setDeletingId(id)
    setIsDeleteOpen(true)
  }

  const handleDelete = () => {
    if (!deletingId) return
    startTransition(async () => {
      const res = await deleteOcorrenciaAction(deletingId)
      if (res.success) {
        toast.success("Ocorrência excluída com sucesso.")
        setOcorrencias(prev => prev.filter(o => o.id !== deletingId))
        setIsDeleteOpen(false)
      } else {
        toast.error(res.error || "Erro ao excluir ocorrência")
      }
    })
  }

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast.error("O nome da categoria é obrigatório.")
      return
    }

    startTransition(async () => {
      const res = await createCategoriaAction(newCategoryName)
      if (res.success) {
        toast.success("Categoria criada com sucesso!")
        setCategorias(prev => [...prev, newCategoryName.trim()].sort())
        setNewCategoryName("")
        setIsCategoryOpen(false)
      } else {
        toast.error(res.error || "Erro ao criar categoria")
      }
    })
  }

  const CATEGORY_ORDER = [
    "Saúde",
    "Jurídico/Atendimento",
    "Operação/Rotina",
    "Escoltas",
    "Alimentação",
  ]

  const CATEGORY_GRADIENT: Record<string, string> = {
    "Saúde": "from-blue-500 to-cyan-600",
    "Jurídico/Atendimento": "from-purple-600 to-violet-700",
    "Operação/Rotina": "from-slate-600 to-slate-800",
    "Escoltas": "from-rose-600 to-red-700",
    "Alimentação": "from-amber-500 to-orange-600",
  }

  const searchLower = historySearch.toLowerCase()

  const filteredTemplates = TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(searchLower) ||
      t.text.toLowerCase().includes(searchLower)
  )

  const filteredCustom = ocorrencias.filter(
    (o) =>
      o.titulo.toLowerCase().includes(searchLower) ||
      o.texto.toLowerCase().includes(searchLower)
  )

  const handleCopyTemplate = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1600)
      toast.success("Copiado!", { duration: 1600 })
    } catch {
      toast.error("Falha ao copiar.")
    }
  }

  const openEditTemplate = (template: Template) => {
    // Pre-fill form with template data as a new custom occurrence
    openNewForm(template.text, template.category, template.title)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-800 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">📝</span>
            <h1 className="text-2xl font-bold tracking-tight">Ocorrências</h1>
          </div>
          <p className="text-white/75 text-sm mt-1">
            Clique para copiar · Duplo clique para editar · <Plus size={12} className="inline" /> para criar novo
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Pesquisar..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white/15 border border-white/20 placeholder-white/50 text-white rounded-xl outline-none focus:bg-white/25 focus:border-white/40 transition w-48"
            />
          </div>
          <Button
            onClick={() => openNewForm()}
            className="bg-white hover:bg-slate-50 text-indigo-800 font-bold rounded-xl shadow-sm gap-1.5 whitespace-nowrap"
          >
            <Plus size={15} /> Nova
          </Button>
        </div>
      </div>

      {/* TEMPLATE CATEGORIES */}
      {CATEGORY_ORDER.map((category) => {
        const items = filteredTemplates.filter((t) => t.category === category)
        if (items.length === 0) return null

        const gradient = CATEGORY_GRADIENT[category] ?? "from-slate-600 to-slate-800"

        return (
          <section key={category}>
            {/* Category header */}
            <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r ${gradient} mb-4 shadow-sm`}>
              <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
              <h2 className="font-bold text-white text-sm uppercase tracking-widest">{category}</h2>
            </div>

            {/* Icon grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
              {items.map((template) => {
                const isCopied = copiedId === template.id
                return (
                  <div
                    key={template.id}
                    className={`group relative bg-white border-2 rounded-2xl p-3 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-1.5 active:scale-95 select-none ${isCopied
                        ? "border-emerald-400 shadow-emerald-100 shadow-lg"
                        : "border-slate-200 hover:border-indigo-400 hover:shadow-lg"
                      }`}
                    onClick={() => handleCopyTemplate(template.id, template.text)}
                    title={template.title}
                  >
                    <span className="text-3xl leading-none">{template.icon}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase leading-tight line-clamp-2">
                      {template.title}
                    </span>

                    {/* Copy/Copied indicator */}
                    <span className={`absolute top-1.5 right-1.5 transition-all duration-300 ${isCopied ? "text-emerald-500 scale-110" : "text-slate-300 group-hover:text-indigo-400"
                      }`}>
                      {isCopied ? <Check size={10} /> : <Copy size={9} />}
                    </span>

                    {/* Hover overlay: edit button */}
                    {!isCopied && (
                      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/80 rounded-2xl transition-all duration-150 flex items-end justify-center pb-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openEditTemplate(template) }}
                          className="flex items-center gap-1 text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow hover:bg-indigo-700 transition"
                        >
                          <Edit size={8} /> Editar
                        </button>
                      </div>
                    )}

                    {/* Copied flash overlay */}
                    {isCopied && (
                      <div className="absolute inset-0 bg-emerald-50/80 rounded-2xl flex items-center justify-center">
                        <Check size={20} className="text-emerald-500" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* CUSTOM DB OCCURRENCES */}
      {(filteredCustom.length > 0 || ocorrencias.length === 0) && (
        <section>
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-900 mb-4 shadow-sm">
            <span className="text-2xl">📒</span>
            <h2 className="font-bold text-white text-sm uppercase tracking-widest">Ocorrências Personalizadas</h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
            {filteredCustom.map((item) => {
              const isCopied = copiedId === item.id
              return (
                <div
                  key={item.id}
                  className={`group relative bg-white border-2 rounded-2xl p-3 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-1.5 active:scale-95 select-none ${isCopied
                      ? "border-emerald-400 shadow-emerald-100 shadow-lg"
                      : "border-slate-200 hover:border-indigo-400 hover:shadow-lg"
                    }`}
                  onClick={() => handleCopyTemplate(item.id, item.texto)}
                  title={item.titulo}
                >
                  <span className="text-3xl leading-none">{item.icone || CATEGORY_ICONS[item.categoria] || "📋"}</span>
                  <span className="text-[10px] font-bold text-slate-600 uppercase leading-tight line-clamp-2">
                    {item.titulo}
                  </span>

                  {/* Copy/Copied indicator */}
                  <span className={`absolute top-1.5 right-1.5 transition-all duration-300 ${isCopied ? "text-emerald-500 scale-110" : "text-slate-300 group-hover:text-indigo-400"
                    }`}>
                    {isCopied ? <Check size={10} /> : <Copy size={9} />}
                  </span>

                  {/* Hover overlay with edit/delete */}
                  {!isCopied && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/85 rounded-2xl transition-all duration-150 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); openEditForm(item) }}
                        className="flex items-center gap-1 text-[9px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full shadow hover:bg-indigo-700 transition"
                      >
                        <Edit size={8} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setDeletingId(item.id); setIsDeleteOpen(true) }}
                        className="flex items-center gap-1 text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full shadow hover:bg-rose-600 transition"
                      >
                        <Trash2 size={8} /> Excluir
                      </button>
                    </div>
                  )}

                  {/* Copied flash overlay */}
                  {isCopied && (
                    <div className="absolute inset-0 bg-emerald-50/80 rounded-2xl flex items-center justify-center">
                      <Check size={20} className="text-emerald-500" strokeWidth={3} />
                    </div>
                  )}
                </div>
              )
            })}


            {/* "+ Nova" card */}
            <button
              type="button"
              className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 rounded-2xl p-3 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[90px] active:scale-95"
              onClick={() => openNewForm()}
            >
              <Plus size={22} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Nova</span>
            </button>
          </div>
        </section>
      )}

      {filteredTemplates.length === 0 && filteredCustom.length === 0 && historySearch && (
        <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
          <Search size={40} className="text-slate-300" />
          <h3 className="font-bold text-slate-500">Nenhuma ocorrência encontrada</h3>
          <p className="text-slate-400 text-sm">Tente outro termo de pesquisa.</p>
        </div>
      )}

      {/* CRUD DIALOG FORM */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">
              {editingId ? "Editar Ocorrência" : "Nova Ocorrência Personalizada"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Preencha as informações da ocorrência para salvar e reutilizar depois.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 my-2">
            {/* EMOJI PICKER */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ícone da Ocorrência</label>
              <div className="flex items-center gap-3">
                {/* Preview */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-3xl">
                  {formIcone}
                </div>
                {/* Text input to type/paste emoji */}
                <input
                  type="text"
                  value={formIcone}
                  onChange={(e) => setFormIcone(e.target.value.slice(0, 4))}
                  placeholder="Digite ou cole"
                  className="w-28 text-center text-2xl border border-slate-200 rounded-xl py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none bg-white"
                />
                <p className="text-[10px] text-slate-400 leading-tight">
                  Digite, cole ou<br/>selecione abaixo
                </p>
              </div>
              {/* Emoji grid */}
              <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                {[
                  "👨‍⚕️","🦷","🤪","🦽","💁","🧠","💉","🔎","📹","👨‍💼","👨‍⚖️","⚖️","🖋️",
                  "☀️","✂️","📦","🪒","💧","🚨","👀","🚔","🔫","⛺","🛡️","🔍","♻️",
                  "🍽️","🥤","☕","🍕","🥘","🏠","🔧","🔑","📋","📝","✅","⚠️",
                  "🚑","🏥","🧹","🧺","📦","🔒","📢","🗂️","👮","🚐","🌙","📞"
                ].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormIcone(emoji)}
                    className={`text-xl p-1.5 rounded-lg transition-all hover:scale-110 ${
                      formIcone === emoji
                        ? "bg-indigo-100 ring-2 ring-indigo-400 scale-110"
                        : "hover:bg-slate-200"
                    }`}
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* TÍTULO */}
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Título</label>
              <Input
                value={formTitulo}
                onChange={(e) => setFormTitulo(e.target.value)}
                placeholder="Ex: Atendimento Psicológico Ala A"
                className="w-full text-xs font-semibold text-slate-700 rounded-xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Categoria</label>
                <Select value={formCategoria} onValueChange={(val) => setFormCategoria(val || "")}>
                  <SelectTrigger className="w-full text-xs font-semibold text-slate-700 rounded-xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 shadow-sm h-8 bg-white">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200">
                    {formCategories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Servidor Responsável</label>
                <Input
                  value={formServidor}
                  onChange={(e) => setFormServidor(e.target.value)}
                  placeholder="Nome do Policial Penal"
                  className="w-full text-xs font-semibold text-slate-700 rounded-xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Texto da Ocorrência</label>
              <textarea
                value={formTexto}
                onChange={(e) => setFormTexto(e.target.value)}
                rows={12}
                placeholder="Insira o texto completo da ocorrência..."
                className="w-full px-3 py-2 text-xs border border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 rounded-xl outline-none font-semibold text-slate-700 font-mono leading-relaxed shadow-sm bg-white"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="rounded-xl text-xs font-bold">Cancelar</Button>} />
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              {isPending ? "Salvando..." : "Salvar Ocorrência"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CONFIRM DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg text-rose-600">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Tem certeza que deseja excluir esta ocorrência permanentemente? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="rounded-xl text-xs font-bold">Cancelar</Button>} />
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
            >
              {isPending ? "Excluindo..." : "Excluir Ocorrência"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* NEW CATEGORY DIALOG */}
      <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Nova Categoria</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Insira o nome da nova categoria de ocorrências.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-2">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nome da Categoria</label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex: Infraestrutura, Disciplinar"
                className="w-full text-xs font-semibold text-slate-700 rounded-xl border-slate-200 focus:ring-slate-900 focus:border-slate-900 shadow-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="rounded-xl text-xs font-bold">Cancelar</Button>} />
            <Button
              onClick={handleCreateCategory}
              disabled={isPending}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              {isPending ? "Criando..." : "Criar Categoria"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

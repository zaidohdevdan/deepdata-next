"use client"

import { useState, useTransition, useRef } from "react"
import { Search, Copy, Check, Plus, Trash2, Edit, Printer } from "lucide-react"
import { toast } from "sonner"
import { handlePrintOcorrencia } from "./utils/print-ocorrencia"
import { Button } from "@/components/ui/button"
import {
  createOcorrenciaAction,
  updateOcorrenciaAction,
  deleteOcorrenciaAction,
  createCategoriaAction
} from "@/app/actions/ocorrencias"

import OcorrenciaFormModal from "./modals/OcorrenciaFormModal"
import OcorrenciaDeleteModal from "./modals/OcorrenciaDeleteModal"
import OcorrenciaCategoryModal from "./modals/OcorrenciaCategoryModal"
import { TEMPLATES, Template } from "./ocorrencias-templates"

interface DBInstance {
  id: string
  titulo: string
  categoria: string
  icone: string
  texto: string
  servidor: string
  createdAt: Date | string
  updatedAt: Date | string
}

interface OcorrenciasContainerProps {
  initialOcorrencias: DBInstance[]
  initialCategorias: string[]
  currentUserName: string
}

export default function OcorrenciasContainer({
  initialOcorrencias,
  initialCategorias,
  currentUserName
}: OcorrenciasContainerProps) {
  const [ocorrencias, setOcorrencias] = useState<DBInstance[]>(initialOcorrencias)
  const [categorias, setCategorias] = useState<string[]>(initialCategorias)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [historySearch, setHistorySearch] = useState("")

  // Click conflict handling timer
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  // AI HELPER STATES
  const [aiPrompt, setAiPrompt] = useState("")
  const [showAiHelper, setShowAiHelper] = useState(false)

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
    setAiPrompt("")
    setShowAiHelper(false)
    setIsFormOpen(true)
  }

  const openEditForm = (item: DBInstance) => {
    setEditingId(item.id)
    setFormTitulo(item.titulo)
    setFormCategoria(item.categoria)
    setFormIcone(item.icone || "📋")
    setFormTexto(item.texto)
    setFormServidor(item.servidor)
    setAiPrompt("")
    setShowAiHelper(false)
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

  const handleCardClick = (id: string, text: string) => {
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current)
      clickTimerRef.current = null
      return
    }
    clickTimerRef.current = setTimeout(() => {
      handleCopyTemplate(id, text)
      clickTimerRef.current = null
    }, 220)
  }

  const openEditTemplate = (template: Template) => {
    // Pre-fill form with template data as a new custom occurrence
    openNewForm(template.text, template.category, template.title, template.icon)
  }

  return (
    <div className="space-y-6">
      {/* Header Banner estilo Enterprise Hero */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span>SISTEMA ADMINISTRATIVO • UPI-4</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Livro Diário de Ocorrências
          </h1>
          <p className="text-slate-400 text-xs font-medium max-w-xl leading-relaxed">
            Clique em um card para copiar instantaneamente o texto padrão · Duplo clique para editar · Formatação rápida para o livro de plantão
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar modelos..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200/90 placeholder-slate-400 text-slate-700 rounded-full outline-none focus:bg-white focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition w-44 sm:w-56 font-medium"
            />
          </div>
          <Button
            type="button"
            onClick={() => openNewForm()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-full px-5 py-2.5 shadow-md shadow-blue-600/20 gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            <span>Nova Ocorrência</span>
          </Button>
        </div>
      </div>

      {/* TEMPLATE CATEGORIES */}
      {CATEGORY_ORDER.map((category) => {
        const items = filteredTemplates.filter((t) => t.category === category)
        if (items.length === 0) return null

        return (
          <section key={category} className="space-y-3">
            {/* Category header estilo Enterprise Hero */}
            <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{CATEGORY_ICONS[category]}</span>
                <h2 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                  {category}
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60 font-mono">
                {items.length} modelos
              </span>
            </div>

            {/* Icon grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {items.map((template) => {
                const isCopied = copiedId === template.id
                return (
                  <div
                    key={template.id}
                    className={`group relative bg-white border rounded-2xl p-3.5 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 active:scale-95 select-none ${
                      isCopied
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/50 shadow-md shadow-blue-500/10"
                        : "border-slate-200/80 hover:border-blue-400 hover:shadow-md"
                    }`}
                    onClick={() => handleCardClick(template.id, template.text)}
                    onDoubleClick={() => openEditTemplate(template)}
                    title={template.title}
                  >
                    <span className="text-3xl leading-none">{template.icon}</span>
                    <span className="text-[11px] font-bold text-slate-700 leading-snug line-clamp-2">
                      {template.title}
                    </span>

                    {/* Copy/Copied indicator */}
                    <span
                      className={`absolute top-2 right-2 transition-all duration-200 ${
                        isCopied ? "text-blue-600 scale-110" : "text-slate-300 group-hover:text-blue-500"
                      }`}
                    >
                      {isCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={11} />}
                    </span>

                    {/* Hover overlay: edit button */}
                    {!isCopied && (
                      <div className="absolute inset-0 bg-white/85 rounded-2xl transition-all duration-150 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openEditTemplate(template)
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full shadow hover:bg-blue-700 transition cursor-pointer"
                        >
                          <Edit size={10} />
                          <span>Editar</span>
                        </button>
                      </div>
                    )}

                    {/* Copied flash overlay */}
                    {isCopied && (
                      <div className="absolute inset-0 bg-blue-50/90 rounded-2xl flex items-center justify-center">
                        <Check size={24} className="text-blue-600" strokeWidth={3} />
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
        <section className="space-y-3">
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📒</span>
              <h2 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
                Ocorrências Personalizadas do Plantão
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80 font-mono">
              {filteredCustom.length} cadastradas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {filteredCustom.map((item) => {
              const isCopied = copiedId === item.id
              return (
                <div
                  key={item.id}
                  className={`group relative bg-white border rounded-2xl p-3.5 cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 active:scale-95 select-none ${
                    isCopied
                      ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50/50 shadow-md shadow-blue-500/10"
                      : "border-slate-200/80 hover:border-blue-400 hover:shadow-md"
                  }`}
                  onClick={() => handleCardClick(item.id, item.texto)}
                  onDoubleClick={() => openEditForm(item)}
                  title={item.titulo}
                >
                  <span className="text-3xl leading-none">{item.icone || CATEGORY_ICONS[item.categoria] || "📋"}</span>
                  <span className="text-[11px] font-bold text-slate-700 leading-snug line-clamp-2">
                    {item.titulo}
                  </span>

                  {/* Copy/Copied indicator */}
                  <span
                    className={`absolute top-2 right-2 transition-all duration-200 ${
                      isCopied ? "text-blue-600 scale-110" : "text-slate-300 group-hover:text-blue-500"
                    }`}
                  >
                    {isCopied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={11} />}
                  </span>

                  {/* Hover overlay with edit/delete */}
                  {!isCopied && (
                    <div className="absolute inset-0 bg-white/90 rounded-2xl transition-all duration-150 flex flex-col items-center justify-center gap-1.5 p-2 opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditForm(item)
                        }}
                        className="w-full flex items-center justify-center gap-1 text-[9px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-full shadow hover:bg-slate-800 transition cursor-pointer"
                        title="Editar Ocorrência"
                      >
                        <Edit size={8} /> Editar
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePrintOcorrencia(item)
                        }}
                        className="w-full flex items-center justify-center gap-1 text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full shadow hover:bg-blue-700 transition cursor-pointer"
                        title="Imprimir Relatório Oficial"
                      >
                        <Printer size={8} /> Imprimir
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDelete(item.id)
                        }}
                        className="w-full flex items-center justify-center gap-1 text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full hover:bg-rose-100 transition cursor-pointer"
                        title="Excluir Ocorrência"
                      >
                        <Trash2 size={8} /> Excluir
                      </button>
                    </div>
                  )}

                  {/* Copied flash overlay */}
                  {isCopied && (
                    <div className="absolute inset-0 bg-blue-50/90 rounded-2xl flex items-center justify-center">
                      <Check size={24} className="text-blue-600" strokeWidth={3} />
                    </div>
                  )}
                </div>
              )
            })}
            {/* "+ Nova" card */}
            <button
              type="button"
              className="bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 rounded-2xl p-3 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-1.5 min-h-[90px] active:scale-95 group"
              onClick={() => openNewForm()}
            >
              <Plus size={22} className="text-slate-400 group-hover:text-blue-600 transition" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 uppercase transition">
                Nova
              </span>
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
      <OcorrenciaFormModal
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        editingId={editingId}
        formTitulo={formTitulo}
        setFormTitulo={setFormTitulo}
        formCategoria={formCategoria}
        setFormCategoria={setFormCategoria}
        formIcone={formIcone}
        setFormIcone={setFormIcone}
        formTexto={formTexto}
        setFormTexto={setFormTexto}
        formServidor={formServidor}
        setFormServidor={setFormServidor}
        formCategories={formCategories}
        isPending={isPending}
        handleSave={handleSave}
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        showAiHelper={showAiHelper}
        setShowAiHelper={setShowAiHelper}
      />

      {/* CONFIRM DELETE DIALOG */}
      <OcorrenciaDeleteModal
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        handleDelete={handleDelete}
        isPending={isPending}
      />

      {/* NEW CATEGORY DIALOG */}
      <OcorrenciaCategoryModal
        isOpen={isCategoryOpen}
        onOpenChange={setIsCategoryOpen}
        newCategoryName={newCategoryName}
        setNewCategoryName={setNewCategoryName}
        handleCreateCategory={handleCreateCategory}
        isPending={isPending}
      />
    </div>
  )
}

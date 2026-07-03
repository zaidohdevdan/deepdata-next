"use client"

import { useState, useTransition, useRef } from "react"
import { Search, Copy, Check, Info, FileText, Sparkles, Plus, Trash2, Edit, Filter, Calendar, User, Loader2 } from "lucide-react"
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
  createCategoriaAction,
  generateOccurrenceTextAction
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

  // Click conflict handling timer
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null)

  // AI HELPER STATES
  const [aiPrompt, setAiPrompt] = useState("")
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)
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
                    onClick={() => handleCardClick(template.id, template.text)}
                    onDoubleClick={() => openEditTemplate(template)}
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
                  onClick={() => handleCardClick(item.id, item.texto)}
                  onDoubleClick={() => openEditForm(item)}
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

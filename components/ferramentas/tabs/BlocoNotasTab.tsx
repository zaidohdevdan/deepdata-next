"use client"

import { useState, useEffect } from "react"
import {
  StickyNote,
  Plus,
  Trash2,
  Copy,
  Download,
  Pin,
  Search,
} from "lucide-react"
import { toast } from "sonner"

interface Note {
  id: string
  title: string
  content: string
  pinned: boolean
  updatedAt: number
}

const STORAGE_KEY = "deepdata_operacional_notes_v1"

const DEFAULT_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Orientações do Plantão UPI-4",
    content: `1. Conferência rigorosa de cadeados das celas nas alas A e B às 07:00h e 19:00h.\n2. Lançamento da distribuição de refeições no módulo Alimentação imediatamente após entrega.\n3. Registro de qualquer movimentação de saúde ou audiência no Livro Diário de Ocorrências.\n4. Telefones úteis: Central de Custódia e Portaria Principal.`,
    pinned: true,
    updatedAt: 1775100000000,
  },
  {
    id: "note-2",
    title: "Rascunho de Ocorrência",
    content: `Por volta das 14:30h, durante a conferência de rotina no pátio de banho de sol, foi constatada tentativa de dano ao patrimônio...`,
    pinned: false,
    updatedAt: 1775090000000,
  },
]

export function BlocoNotasTab() {
  const [notes, setNotes] = useState<Note[]>(DEFAULT_NOTES)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>("note-1")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar do localStorage após a montagem do cliente para evitar mismatch de hidratação
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotes(parsed)
            setSelectedNoteId(parsed[0].id)
          }
        }
      } catch {}
      setIsLoaded(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  // Salvar no localStorage quando notes mudar (apenas após o carregamento inicial)
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch {}
  }, [notes, isLoaded])

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0] || null

  const handleCreateNote = () => {
    const newNote: Note = {
      id: "note-" + Math.random().toString(36).substring(2, 9),
      title: "Nova Anotação de Plantão",
      content: "",
      pinned: false,
      updatedAt: Date.now(),
    }
    setNotes((prev) => [newNote, ...prev])
    setSelectedNoteId(newNote.id)
    toast.success("Nova nota criada!")
  }

  const handleUpdateCurrentNote = (fields: Partial<Note>) => {
    if (!selectedNote) return
    setNotes((prev) =>
      prev.map((n) =>
        n.id === selectedNote.id ? { ...n, ...fields, updatedAt: Date.now() } : n
      )
    )
  }

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) {
      toast.error("Você precisa manter pelo menos uma nota.")
      return
    }
    setNotes((prev) => prev.filter((n) => n.id !== id))
    if (selectedNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id)
      setSelectedNoteId(remaining[0]?.id || null)
    }
    toast.success("Anotação excluída.")
  }

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    )
  }

  const handleCopyContent = () => {
    if (!selectedNote) return
    const fullText = `${selectedNote.title}\n\n${selectedNote.content}`
    navigator.clipboard.writeText(fullText)
    toast.success("Conteúdo copiado!")
  }

  const handleExportTxt = () => {
    if (!selectedNote) return
    const fullText = `${selectedNote.title}\n${"=".repeat(selectedNote.title.length)}\n\n${selectedNote.content}`
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const safeTitle = selectedNote.title.toLowerCase().replace(/[^a-z0-9]/g, "_") || "nota"
    a.download = `${safeTitle}.txt`
    a.click()
    toast.success("Arquivo .txt exportado com sucesso!")
  }

  const filteredNotes = notes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return b.updatedAt - a.updatedAt
    })

  const wordCount = selectedNote?.content.trim() ? selectedNote.content.trim().split(/\s+/).length : 0
  const charCount = selectedNote?.content.length || 0

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-[0_15px_40px_-10px_rgba(20,50,110,0.06)] overflow-hidden">
      {/* Header do Bloco */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-800">
            Bloco de Notas Operacional (Rascunhos & Lembretes)
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Seus apontamentos são salvos automaticamente no navegador, garantindo rapidez e privacidade.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNote}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={14} />
          <span>Nova Anotação</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 min-h-[520px]">
        {/* Coluna Lateral: Lista de Notas */}
        <div className="border-r border-slate-100 p-4 space-y-3 bg-slate-50/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar nas anotações..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white text-slate-900 dark:text-slate-100 border border-slate-200 rounded-xl outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = selectedNote?.id === note.id
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-left relative group ${
                    isSelected
                      ? "bg-white border-blue-300 shadow-sm shadow-blue-500/10"
                      : "bg-white/60 hover:bg-white border-slate-200/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {note.title || "Sem título"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTogglePin(note.id)
                      }}
                      className={`p-1 rounded-md transition ${
                        note.pinned
                          ? "text-blue-600"
                          : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
                      }`}
                      title={note.pinned ? "Desafixar" : "Fixar no topo"}
                    >
                      <Pin size={12} className={note.pinned ? "fill-blue-600" : ""} />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                    {note.content || "Nenhum conteúdo adicional..."}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-2 pt-1 border-t border-slate-100/80">
                    <span suppressHydrationWarning>
                      {new Date(note.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteNote(note.id)
                      }}
                      className="text-slate-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition p-0.5"
                      title="Excluir nota"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Coluna Principal: Editor da Nota Selecionada */}
        {selectedNote ? (
          <div className="md:col-span-2 p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-4 flex-1 flex flex-col">
              {/* Barra de Ações do Editor */}
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => handleUpdateCurrentNote({ title: e.target.value })}
                  placeholder="Título da anotação..."
                  className="text-lg font-black text-slate-800 bg-transparent outline-none w-full tracking-tight"
                />

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyContent}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition cursor-pointer"
                    title="Copiar texto"
                  >
                    <Copy size={13} />
                    <span className="hidden sm:inline">Copiar</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportTxt}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer"
                    title="Baixar como .TXT"
                  >
                    <Download size={13} />
                    <span className="hidden sm:inline">Exportar .TXT</span>
                  </button>
                </div>
              </div>

              {/* Área de Texto */}
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateCurrentNote({ content: e.target.value })}
                placeholder="Escreva seus apontamentos operacionais, rascunhos de relatórios ou ordens de serviço aqui..."
                className="w-full flex-1 min-h-[300px] p-4 text-xs font-mono leading-relaxed bg-slate-50/40 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition resize-none text-slate-800"
              />
            </div>

            {/* Rodapé com Métricas da Nota */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span>{wordCount} palavras</span>
                <span>•</span>
                <span>{charCount} caracteres</span>
              </div>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Salvo automaticamente
              </span>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 p-10 flex flex-col items-center justify-center text-center text-slate-400">
            <StickyNote size={32} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold">Nenhuma nota selecionada</p>
          </div>
        )}
      </div>
    </div>
  )
}

import { useState } from "react"
import { toast } from "sonner"
import { Sparkles, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateOccurrenceTextAction } from "@/app/actions/ocorrencias"

interface OcorrenciaFormModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editingId: string | null
  formTitulo: string
  setFormTitulo: (v: string) => void
  formCategoria: string
  setFormCategoria: (v: string) => void
  formIcone: string
  setFormIcone: (v: string) => void
  formTexto: string
  setFormTexto: (v: string) => void
  formServidor: string
  setFormServidor: (v: string) => void
  formCategories: string[]
  isPending: boolean
  handleSave: () => void
  aiPrompt: string
  setAiPrompt: (v: string) => void
  showAiHelper: boolean
  setShowAiHelper: (v: boolean) => void
}

export default function OcorrenciaFormModal({
  isOpen, onOpenChange, editingId,
  formTitulo, setFormTitulo,
  formCategoria, setFormCategoria,
  formIcone, setFormIcone,
  formTexto, setFormTexto,
  formServidor, setFormServidor,
  formCategories, isPending, handleSave,
  aiPrompt, setAiPrompt, showAiHelper, setShowAiHelper
}: OcorrenciaFormModalProps) {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-center text-3xl">
                {formIcone}
              </div>
              <input
                type="text"
                value={formIcone}
                onChange={(e) => setFormIcone(e.target.value.slice(0, 4))}
                placeholder="Digite ou cole"
                className="w-28 text-center text-2xl border border-slate-200 rounded-xl py-2 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none bg-white"
              />
              <p className="text-[10px] text-slate-400 leading-tight">
                Digite, cole ou<br />selecione abaixo
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
              {[
                "👨‍⚕️", "🦷", "🤪", "🦽", "🧠", "💉", "🔎", "💊", "🩺", "🩹", "🤒", "🚑", "🏥",
                "🔒", "🔓", "🔏", "🔑", "👮", "🛡️", "🚨", "🚔", "🚐", "👀", "🔍", "📢", "🗂️",
                "🚪", "🔗", "⛓️", "🛃", "🛂", "🔫", "🏹", "⚔️", "⛺", "🔥", "🧯", "🧹", "🧺",
                "☀️", "🌙", "📞", "📱", "💻", "🔋", "🔌", "💡", "🔧", "🛠️", "🔨", "⚙️",
                "🛁", "🚿", "🧼", "🧻", "🧴", "✂️", "🪒", "📦", "💧", "♻️",
                "💁", "👨‍💼", "👨‍⚖️", "⚖️", "🖋️", "📝", "📋", "✅", "⚠️", "ℹ️",
                "🍽️", "🥤", "☕", "🍕", "🥘", "🍞", "🥪", "🍎", "🍌", "🥛", "🍵"
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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide font-semibold">Texto da Ocorrência</label>
              <button
                type="button"
                onClick={() => setShowAiHelper(!showAiHelper)}
                className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 hover:text-indigo-800 transition cursor-pointer"
              >
                <Sparkles size={12} /> {showAiHelper ? "Fechar Assistente de IA" : "Elaborar com IA (Gemini)"}
              </button>
            </div>

            {showAiHelper && (
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-3">
                <div className="space-y-1">
                  <label className="block text-[9px] font-bold text-indigo-500 uppercase">Resuma o que aconteceu de forma simples:</label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                    placeholder="Ex: Condução do preso João Silva (matrícula 123456) da ala A cela 2 para atendimento odontológico às 14:00 por dor de dente, conduzido pelo PP Bezerra, sem novidades."
                    className="w-full p-2 text-xs border border-indigo-200 rounded-xl focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 outline-none bg-white font-semibold text-slate-700 leading-normal"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    disabled={isGeneratingAi}
                    onClick={async () => {
                      if (!aiPrompt.trim()) {
                        toast.error("Por favor, digite o resumo do fato.")
                        return
                      }
                      setIsGeneratingAi(true)
                      try {
                        const res = await generateOccurrenceTextAction(aiPrompt)
                        if (res.success && res.text) {
                          setFormTexto(res.text)
                          toast.success("Texto oficial gerado pela IA!")
                          setShowAiHelper(false)
                        } else {
                          toast.error(res.error || "Erro ao gerar redação.")
                        }
                      } catch (e: unknown) {
                        toast.error(e instanceof Error ? e.message : "Erro de conexão.")
                      } finally {
                        setIsGeneratingAi(false)
                      }
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold gap-1"
                  >
                    {isGeneratingAi ? (
                      <><Loader2 size={12} className="animate-spin" /> Gerando Redação...</>
                    ) : (
                      <><Sparkles size={12} /> Gerar Texto Oficial</>
                    )}
                  </Button>
                </div>
              </div>
            )}

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
  )
}

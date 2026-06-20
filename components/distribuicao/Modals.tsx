import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddAlaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  isPending: boolean
}

export function AddAlaModal({ isOpen, onClose, onConfirm, isPending }: AddAlaModalProps) {
  const [newAlaName, setNewAlaName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAlaName.trim()) return
    onConfirm(newAlaName)
    setNewAlaName("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Cadastrar Nova Ala / Galpão
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Adicione um novo setor. Ele estará disponível para lançamento em todos os módulos do sistema.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Nome da Ala
            </label>
            <Input
              type="text"
              required
              placeholder="EX: ALA G, GALPÃO 1"
              value={newAlaName}
              onChange={(e) => setNewAlaName(e.target.value)}
              className="uppercase font-semibold text-slate-800"
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl font-semibold"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Adicionar Ala
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface ClearDataModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function ClearDataModal({ isOpen, onClose, onConfirm, isPending }: ClearDataModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Resetar Números
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Tem certeza que deseja limpar todos os lançamentos de internos e dietas? Esta ação definirá os valores de todas as alas para 0 neste módulo e NÃO pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl font-semibold"
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant="destructive"
            className="rounded-xl font-semibold text-white"
          >
            Sim, Limpar Tudo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

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
      <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
            Cadastrar Nova Ala / Galpão
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Adicione um novo setor. Ele estará disponível para lançamento em todos os módulos de alimentação.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Nome da Ala
            </label>
            <Input
              type="text"
              required
              placeholder="EX: ALA G, GALPÃO 1"
              value={newAlaName}
              onChange={(e) => setNewAlaName(e.target.value)}
              className="uppercase font-bold text-slate-800 rounded-2xl border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <DialogFooter className="gap-2 pt-3 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full font-bold text-xs px-5 border-slate-200 hover:bg-slate-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full font-bold text-xs px-6 bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-sm"
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
      <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
            Resetar Lançamentos
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Tem certeza que deseja zerar os lançamentos de internos e dietas deste módulo? Esta ação definirá os valores para 0 e não pode ser revertida.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full font-bold text-xs px-5 border-slate-200 hover:bg-slate-100"
          >
            Voltar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant="destructive"
            className="rounded-full font-bold text-xs px-6 text-white shadow-sm"
          >
            Sim, Limpar Tudo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteAlaModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
  alaName: string
}

export function DeleteAlaModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  alaName,
}: DeleteAlaModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(20,50,110,0.15)] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
            Remover Ala / Galpão
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            Tem certeza que deseja remover a ala <strong>{alaName}</strong>? Esta ação é irreversível.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full font-bold text-xs px-5 border-slate-200 hover:bg-slate-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            variant="destructive"
            className="rounded-full font-bold text-xs px-6 text-white flex items-center gap-1.5 shadow-sm"
          >
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Confirmar Remoção
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


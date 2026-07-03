import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface OcorrenciaDeleteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  handleDelete: () => void
  isPending: boolean
}

export default function OcorrenciaDeleteModal({
  isOpen, onOpenChange, handleDelete, isPending
}: OcorrenciaDeleteModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  )
}

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface OcorrenciaCategoryModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  newCategoryName: string
  setNewCategoryName: (name: string) => void
  handleCreateCategory: () => void
  isPending: boolean
}

export default function OcorrenciaCategoryModal({
  isOpen, onOpenChange, newCategoryName, setNewCategoryName, handleCreateCategory, isPending
}: OcorrenciaCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
  )
}

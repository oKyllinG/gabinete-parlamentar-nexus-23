import { Button } from "@/components/ui/button";
import { useAgenda } from "@/contexts/AgendaContext";
import { Compromisso } from "@/types/agenda";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CompromissoActionsProps {
  compromisso: Compromisso;
}

export function CompromissoActions({ compromisso }: CompromissoActionsProps) {
  const { updateStatus, deleteCompromisso, setEditingCompromisso, setFormOpen } = useAgenda();
  const { toast } = useToast();

  const handleConfirm = () => {
    updateStatus(compromisso.id, "CONFIRMADO");
    toast({ title: "Compromisso confirmado!" });
  };

  const handleRecusar = () => {
    updateStatus(compromisso.id, "RECUSADO");
    toast({ title: "Compromisso recusado." });
  };

  const handleEdit = () => {
    setEditingCompromisso(compromisso);
    setFormOpen(true);
  };
  
  const handleDelete = () => {
    deleteCompromisso(compromisso.id);
    toast({ title: "Compromisso excluído.", variant: "destructive" });
  };

  return (
    <div className="flex items-center gap-2 mt-4 flex-wrap">
      <Button size="sm" onClick={handleConfirm}>Confirmar</Button>
      <Button size="sm" variant="outline" onClick={handleEdit}>Editar</Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">Excluir</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá excluir permanentemente o compromisso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button size="sm" variant="ghost" onClick={handleRecusar}>Recusar</Button>
    </div>
  );
}

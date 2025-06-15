
import { Compromisso } from "@/types/agenda";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Edit, Trash2, X, Clock, MapPin } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { usePermissions } from "@/contexts/PermissionsContext";

interface CompromissoCardProps {
  compromisso: Compromisso;
}

export function CompromissoCard({ compromisso }: CompromissoCardProps) {
  const { updateStatus, setEditingCompromisso, deleteCompromisso } = useAgenda();
  const { getPermission } = usePermissions();
  const canEdit = getPermission("agenda") === "ADMIN";

  const handleConfirm = () => updateStatus(compromisso.id, "CONFIRMADO");
  const handleReject = () => updateStatus(compromisso.id, "RECUSADO");
  const handleEdit = () => setEditingCompromisso(compromisso);
  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este compromisso?")) {
      deleteCompromisso(compromisso.id);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{compromisso.titulo}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <div className="flex items-center gap-1"><Clock size={14} />{compromisso.horaInicio} - {compromisso.horaFim}</div>
          {compromisso.local && <div className="flex items-center gap-1"><MapPin size={14} />{compromisso.local}</div>}
        </CardDescription>
      </CardHeader>
      {compromisso.descricao && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{compromisso.descricao}</p>
        </CardContent>
      )}
      {canEdit && compromisso.status === 'PENDENTE' && (
        <CardContent className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReject}><X className="mr-1 h-4 w-4" /> Recusar</Button>
            <Button size="sm" onClick={handleConfirm}><Check className="mr-1 h-4 w-4" /> Confirmar</Button>
            <Button variant="ghost" size="icon" onClick={handleEdit}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </CardContent>
      )}
       {canEdit && compromisso.status !== 'PENDENTE' && (
         <CardContent className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={handleEdit}><Edit className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
         </CardContent>
       )}
    </Card>
  );
}

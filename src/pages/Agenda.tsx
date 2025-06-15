import { useState } from "react";
import { AgendaProvider, useAgenda } from "@/contexts/AgendaContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Share2, FileDown } from "lucide-react";
import { usePermissions } from "@/contexts/PermissionsContext";
import { CompromissoForm } from "@/components/agenda/CompromissoForm";
import { AgendaCalendar } from "@/components/agenda/AgendaCalendar";
import { PreAgendaList } from "@/components/agenda/PreAgendaList";
import { toast } from "@/components/ui/use-toast";

function AgendaView() {
  const { getPermission } = usePermissions();
  const { filter, setFilter, compromissos } = useAgenda();
  const [formOpen, setFormOpen] = useState(false);
  const canEdit = getPermission("agenda") === "ADMIN";

  const pendingCount = compromissos.filter(c => c.status === 'PENDENTE').length;

  const handleShare = () => {
    toast({ title: "Funcionalidade em desenvolvimento", description: "O compartilhamento via WhatsApp será implementado em breve." });
  };

  const handleExport = () => {
    toast({ title: "Funcionalidade em desenvolvimento", description: "A exportação em PDF será implementada em breve." });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
            <Badge 
                variant={filter === 'PENDENTE' ? 'default' : 'secondary'} 
                className="cursor-pointer"
                onClick={() => setFilter('PENDENTE')}
            >
                Pendentes {pendingCount > 0 && `(${pendingCount})`}
            </Badge>
            <Badge 
                variant={filter === null ? 'default' : 'secondary'} 
                className="cursor-pointer"
                onClick={() => setFilter(null)}
            >
                Agenda Confirmada
            </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare}><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
          <Button variant="outline" onClick={handleExport}><FileDown className="mr-2 h-4 w-4" /> Exportar PDF</Button>
          {canEdit && (
            <Button onClick={() => setFormOpen(true)}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
          )}
        </div>
      </header>
      
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <AgendaCalendar />
        </div>
        <div className="lg:col-span-1">
            <PreAgendaList />
        </div>
      </main>

      {canEdit && <CompromissoForm open={formOpen} onOpenChange={setFormOpen} />}
    </div>
  );
}

export default function Agenda() {
  return (
    <AgendaProvider>
      <AgendaView />
    </AgendaProvider>
  );
}

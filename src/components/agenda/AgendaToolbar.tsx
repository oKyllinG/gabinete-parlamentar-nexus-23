
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Filter } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { cn } from "@/lib/utils";

export function AgendaToolbar() {
    const { compromissos, filter, setFilter, view } = useAgenda();
    const pendingCount = compromissos.filter(c => c.status === 'PENDENTE').length;
    const concludedCount = compromissos.filter(c => c.status === 'CONFIRMADO').length;

    if (view === 'CALENDARIO') {
        return null; // Toolbar is more relevant for the management view
    }

  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setFilter('PENDENTE')} className={cn("p-0 h-auto font-normal", filter === 'PENDENTE' || !filter ? 'text-primary' : 'text-gray-600 hover:text-primary')}>
          <Clock className="mr-2 h-5 w-5" />
          Pendentes
          {pendingCount > 0 && <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">{pendingCount}</Badge>}
        </Button>
        <Button variant="ghost" onClick={() => setFilter('CONCLUIDO')} className={cn("p-0 h-auto font-normal", filter === 'CONCLUIDO' ? 'text-primary' : 'text-gray-600 hover:text-primary')}>
          <span className="w-5 h-5 mr-2 flex items-center justify-center rounded-full border-2 border-blue-500">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
          Concluídas
           {concludedCount > 0 && <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">{concludedCount}</Badge>}
        </Button>
        <Button variant="ghost" onClick={() => setFilter('HOJE')} className={cn("p-0 h-auto font-normal", filter === 'HOJE' ? 'text-primary' : 'text-gray-600 hover:text-primary')}>
          <Calendar className="mr-2 h-5 w-5" />
          Hoje
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="link" className="text-primary">Selecionar Todos</Button>
        <Button variant="ghost" onClick={() => setFilter(null)} className="text-gray-600">
          <Filter className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
}

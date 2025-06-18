
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Filter, CheckCircle } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { cn } from "@/lib/utils";

export function AgendaToolbar() {
    const { compromissos, filter, setFilter, view } = useAgenda();
    const pendingCount = compromissos.filter(c => c.status === 'PENDENTE').length;
    const confirmedCount = compromissos.filter(c => c.status === 'CONFIRMADO').length;
    const todayCount = compromissos.filter(c => {
        const compromissoDate = new Date(c.data);
        const today = new Date();
        return compromissoDate.toDateString() === today.toDateString();
    }).length;

    if (view === 'CALENDARIO') {
        return null; // Toolbar is more relevant for the management view
    }

    return (
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => setFilter('PENDENTE')} 
                    className={cn(
                        "p-0 h-auto font-normal", 
                        filter === 'PENDENTE' ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    )}
                >
                    <Clock className="mr-2 h-5 w-5" />
                    Pré-agendados
                    {pendingCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                            {pendingCount}
                        </Badge>
                    )}
                </Button>
                
                <Button 
                    variant="ghost" 
                    onClick={() => setFilter('CONFIRMADO')} 
                    className={cn(
                        "p-0 h-auto font-normal", 
                        filter === 'CONFIRMADO' ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    )}
                >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Confirmados
                    {confirmedCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                            {confirmedCount}
                        </Badge>
                    )}
                </Button>
                
                <Button 
                    variant="ghost" 
                    onClick={() => setFilter('HOJE')} 
                    className={cn(
                        "p-0 h-auto font-normal", 
                        filter === 'HOJE' ? 'text-primary' : 'text-gray-600 hover:text-primary'
                    )}
                >
                    <Calendar className="mr-2 h-5 w-5" />
                    Hoje
                    {todayCount > 0 && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {todayCount}
                        </Badge>
                    )}
                </Button>
            </div>
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    onClick={() => setFilter(null)} 
                    className="text-gray-600 hover:text-primary"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Limpar Filtros
                </Button>
            </div>
        </div>
    );
}

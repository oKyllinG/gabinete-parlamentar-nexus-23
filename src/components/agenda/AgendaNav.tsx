
import { Button } from "@/components/ui/button";
import { Calendar, Cog, Plus, Tag } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { cn } from "@/lib/utils";

export function AgendaNav() {
  const { view, setView, setEditingCompromisso, setFormOpen } = useAgenda();

  const handleAgendarClick = () => {
    setEditingCompromisso(null);
    setFormOpen(true);
  };

  return (
    <nav className="flex space-x-2 border-b mb-6">
      <Button variant="ghost" onClick={() => setView('CALENDARIO')} className={cn("font-semibold text-muted-foreground hover:text-primary h-12 rounded-none px-4", view === 'CALENDARIO' && "text-primary border-b-2 border-primary")}>
        <Calendar className="mr-2 h-4 w-4" />
        Calendário
      </Button>
      <Button variant="ghost" onClick={() => setView('GERENCIAR')} className={cn("font-semibold text-muted-foreground hover:text-primary h-12 rounded-none px-4", view === 'GERENCIAR' && "text-primary border-b-2 border-primary")}>
        <Cog className="mr-2 h-4 w-4" />
        Gerenciar
      </Button>
      <Button variant="ghost" onClick={handleAgendarClick} className="text-muted-foreground hover:text-primary h-12 rounded-none px-4">
        <Plus className="mr-2 h-4 w-4" />
        Agendar
      </Button>
      <Button variant="ghost" className="text-muted-foreground hover:text-primary h-12 rounded-none px-4">
        <Tag className="mr-2 h-4 w-4" />
        Categorias
      </Button>
    </nav>
  );
}

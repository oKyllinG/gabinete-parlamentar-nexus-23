
import { Button } from "@/components/ui/button";
import { Calendar, Cog, Plus, Tag } from "lucide-react";

export function AgendaNav() {
  return (
    <nav className="flex space-x-2 border-b mb-6">
      <Button variant="ghost" className="font-semibold text-primary border-b-2 border-primary h-12 rounded-none px-4">
        <Calendar className="mr-2 h-4 w-4" />
        Calendário
      </Button>
      <Button variant="ghost" className="text-muted-foreground hover:text-primary h-12 rounded-none px-4">
        <Cog className="mr-2 h-4 w-4" />
        Gerenciar
      </Button>
      <Button variant="ghost" className="text-muted-foreground hover:text-primary h-12 rounded-none px-4">
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

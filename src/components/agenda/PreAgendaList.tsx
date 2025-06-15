
import { useAgenda } from "@/contexts/AgendaContext";
import { CompromissoCard } from "./CompromissoCard";

export function PreAgendaList() {
  const { filteredCompromissos, filter } = useAgenda();

  if (filter !== "PENDENTE") return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Pré-agenda ({filteredCompromissos.length})</h2>
      {filteredCompromissos.length > 0 ? (
        <div className="space-y-3">
          {filteredCompromissos.map(c => <CompromissoCard key={c.id} compromisso={c} />)}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nenhum compromisso pendente.</p>
      )}
    </div>
  );
}

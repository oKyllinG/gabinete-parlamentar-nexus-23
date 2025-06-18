
import { useMemo } from "react";
import { useAgenda } from "@/contexts/AgendaContext";
import { PreAgendaCard } from "./PreAgendaCard";
import { Compromisso } from "@/types/agenda";
import { format, parseISO, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { GerenciarCompromissosAccordion } from "./GerenciarCompromissosAccordion";

export function PreAgendaList() {
  const { compromissos, filter, view } = useAgenda();

  const filteredAgendas = useMemo(() => {
    let items: Compromisso[];
    switch(filter) {
        case 'HOJE':
            items = compromissos.filter(c => isSameDay(parseISO(c.data), new Date()));
            break;
        case 'CONFIRMADO':
            items = compromissos.filter(c => c.status === 'CONFIRMADO');
            break;
        case 'RECUSADO':
            items = compromissos.filter(c => c.status === 'RECUSADO');
            break;
        case 'CANCELADO':
            items = compromissos.filter(c => c.status === 'CANCELADO');
            break;
        case 'PENDENTE':
            items = compromissos.filter(c => c.status === 'PENDENTE');
            break;
        default: // if filter is null
            items = view === "GERENCIAR" ? compromissos : compromissos.filter(c => c.status === 'PENDENTE');
            break;
    }
    return items;
  }, [compromissos, filter, view]);

  // Se estiver no modo "Gerenciar", mostra accordion de dias c/ compromissos FILTRADOS
  if (view === "GERENCIAR") {
    return <GerenciarCompromissosAccordion compromissos={filteredAgendas} />;
  }
  
  const groupedByDate = useMemo(() => {
    return filteredAgendas.reduce((acc, compromisso) => {
      const dateKey = format(parseISO(compromisso.data), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(compromisso);
      return acc;
    }, {} as Record<string, Compromisso[]>);
  }, [filteredAgendas]);

  const sortedDates = useMemo(() => Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()), [groupedByDate]);

  if (sortedDates.length === 0) {
    const getEmptyMessage = () => {
      switch(filter) {
        case 'HOJE':
          return 'Não há compromissos agendados para hoje.';
        case 'CONFIRMADO':
          return 'Não há compromissos confirmados.';
        case 'PENDENTE':
          return 'Não há compromissos pré-agendados.';
        default:
          return 'Não há compromissos que correspondam ao filtro atual.';
      }
    };

    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold">Nenhum item encontrado</h3>
        <p className="mt-1">{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map(dateStr => (
        <div key={dateStr}>
          <h2 className="text-lg font-bold text-gray-800 mb-4 capitalize sticky top-0 bg-gray-50/90 py-2 z-10 backdrop-blur-sm">
            {format(parseISO(dateStr), "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h2>
          <div className="space-y-4">
            {groupedByDate[dateStr]
                .sort((a,b) => a.horaInicio.localeCompare(b.horaInicio))
                .map(compromisso => (
              <PreAgendaCard key={compromisso.id} compromisso={compromisso} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

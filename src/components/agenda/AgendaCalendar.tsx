
import { Calendar } from "@/components/ui/calendar";
import { useAgenda } from "@/contexts/AgendaContext";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CompromissoCard } from "./CompromissoCard";

export function AgendaCalendar() {
  const { selectedDate, setSelectedDate, getCompromissosPorDia, compromissos, filter } = useAgenda();
  
  const compromissosDoDia = getCompromissosPorDia(selectedDate).filter(c => c.status === 'CONFIRMADO');

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                 <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(day) => setSelectedDate(day || new Date())}
                    className="rounded-md border"
                    locale={ptBR}
                    modifiers={{
                        hasEvent: compromissos.filter(c => c.status === 'CONFIRMADO').map(c => parseISO(c.data))
                    }}
                    modifiersStyles={{
                        hasEvent: {
                            textDecoration: 'underline',
                            textDecorationColor: 'hsl(var(--primary))',
                            textDecorationThickness: '2px',
                            textUnderlineOffset: '3px',
                        }
                    }}
                />
            </div>
            <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-4">
                    Compromissos para {format(selectedDate, "PPP", { locale: ptBR })}
                </h2>
                {compromissosDoDia.length > 0 ? (
                    <div className="space-y-3">
                        {compromissosDoDia.map(c => <CompromissoCard key={c.id} compromisso={c} />)}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum compromisso confirmado para esta data.</p>
                )}
            </div>
        </div>
    </div>
  );
}

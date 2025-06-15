
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { Compromisso } from "@/types/agenda";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PreAgendaCard } from "./PreAgendaCard";

interface Props {
  compromissos: Compromisso[];
}

export function GerenciarCompromissosAccordion({ compromissos }: Props) {
  // Agrupa compromissos por data (yyyy-MM-dd)
  const compromissosPorDia = useMemo(() => {
    const grouped: Record<string, Compromisso[]> = {};
    compromissos.forEach((c) => {
      const key = format(parseISO(c.data), "yyyy-MM-dd");
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(c);
    });
    return grouped;
  }, [compromissos]);

  // Ordena dias com compromissos
  const sortedDates = useMemo(
    () => Object.keys(compromissosPorDia).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    [compromissosPorDia]
  );

  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white rounded-lg border">
        <h3 className="text-lg font-semibold">Nenhum compromisso para gerenciar</h3>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      {sortedDates.map((date) => (
        <AccordionItem key={date} value={date}>
          <AccordionTrigger>
            <div className="flex items-center gap-2 w-full justify-between">
              <span>
                {format(parseISO(date), "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </span>
              <span className="bg-primary/10 px-2 py-1 text-xs font-medium rounded text-primary">
                {compromissosPorDia[date].length} compromisso(s)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 mt-2">
              {compromissosPorDia[date]
                .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio))
                .map((compromisso) => (
                  <Card key={compromisso.id} className="shadow-none bg-background">
                    <CardContent className="p-4 pt-2">
                      <PreAgendaCard compromisso={compromisso} />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compromisso } from "@/types/agenda";
import { Clock, MapPin, Info } from "lucide-react";
import { CompromissoActions } from "./CompromissoActions";

interface PreAgendaCardProps {
  compromisso: Compromisso;
}

export function PreAgendaCard({ compromisso }: PreAgendaCardProps) {
  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-semibold">{compromisso.titulo}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
            <Clock className="h-4 w-4" />
            <span>{compromisso.horaInicio}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="text-sm text-muted-foreground space-y-2 mb-3">
            {compromisso.local && (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{compromisso.local}</span>
                </div>
            )}
            {compromisso.descricao && (
                <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 mt-1 shrink-0" />
                    <p className="flex-grow">{compromisso.descricao}</p>
                </div>
            )}
        </div>
        <CompromissoActions compromisso={compromisso} />
      </CardContent>
    </Card>
  );
}

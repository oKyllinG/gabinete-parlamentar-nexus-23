
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Plane } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { useAgendaCategorias } from "@/contexts/AgendaCategoriasContext";
import { format, parseISO, addDays, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from "react-router-dom";

export function AgendaWidget() {
  const { compromissos } = useAgenda();
  const { categorias } = useAgendaCategorias();
  const navigate = useNavigate();

  // Próximos compromissos (próximos 7 dias)
  const proximos = compromissos
    .filter(c => {
      const dataCompromisso = parseISO(c.data);
      const hoje = new Date();
      const proximaSemana = addDays(hoje, 7);
      return isAfter(dataCompromisso, hoje) && isBefore(dataCompromisso, proximaSemana);
    })
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime())
    .slice(0, 5);

  const getCategoriaColor = (categoriaSlug?: string) => {
    const categoria = categorias.find(cat => cat.slug === categoriaSlug);
    return categoria?.cor || '#4267F1';
  };

  const getIconeCategoria = (categoriaSlug?: string) => {
    if (categoriaSlug === 'viagem') return Plane;
    return Clock;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Próximos Compromissos
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/agenda')}
        >
          Ver Agenda
        </Button>
      </CardHeader>
      <CardContent>
        {proximos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum compromisso nos próximos 7 dias</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proximos.map((compromisso) => {
              const IconeCategoria = getIconeCategoria(compromisso.categoria);
              return (
                <div key={compromisso.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: `${getCategoriaColor(compromisso.categoria)}20` }}
                  >
                    <IconeCategoria 
                      className="h-4 w-4" 
                      style={{ color: getCategoriaColor(compromisso.categoria) }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{compromisso.titulo}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{format(parseISO(compromisso.data), "EEE, dd/MM", { locale: ptBR })}</span>
                          <span>{compromisso.horaInicio}</span>
                        </div>
                        {compromisso.local && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{compromisso.local}</span>
                          </div>
                        )}
                      </div>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${getCategoriaColor(compromisso.categoria)}20`,
                          color: getCategoriaColor(compromisso.categoria)
                        }}
                      >
                        {compromisso.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

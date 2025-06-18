
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Compromisso } from "@/types/agenda";
import { Clock, MapPin, Info, CheckCircle, Clock as PendingIcon, XCircle, Ban } from "lucide-react";
import { CompromissoActions } from "./CompromissoActions";
import { useAgendaCategorias } from "@/contexts/AgendaCategoriasContext";

interface PreAgendaCardProps {
  compromisso: Compromisso;
}

export function PreAgendaCard({ compromisso }: PreAgendaCardProps) {
  const { categorias } = useAgendaCategorias();
  
  // Encontrar a categoria do compromisso
  const categoria = categorias.find(cat => cat.slug === compromisso.categoria);
  const cor = categoria?.cor || '#4267F1';
  
  const getStatusIcon = () => {
    switch (compromisso.status) {
      case 'CONFIRMADO':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'RECUSADO':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'CANCELADO':
        return <Ban className="h-4 w-4 text-gray-600" />;
      default:
        return <PendingIcon className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = () => {
    switch (compromisso.status) {
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'RECUSADO':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELADO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getCardBorder = () => {
    switch (compromisso.status) {
      case 'CONFIRMADO':
        return 'border-l-green-500';
      case 'RECUSADO':
        return 'border-l-red-500';
      case 'CANCELADO':
        return 'border-l-gray-500';
      default:
        return 'border-l-yellow-500';
    }
  };

  return (
    <Card className={`mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 ${getCardBorder()}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              {getStatusIcon()}
              {compromisso.titulo}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Clock className="h-4 w-4" />
              <span>{compromisso.horaInicio}</span>
            </CardDescription>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}>
            {compromisso.status}
          </span>
        </div>
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

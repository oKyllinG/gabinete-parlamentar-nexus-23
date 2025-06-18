
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, Info, CheckCircle, Clock as PendingIcon, XCircle, Ban } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgenda } from '@/contexts/AgendaContext';
import { Compromisso } from '@/types/agenda';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompromissoActions } from './CompromissoActions';

interface DayDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  compromissos: Compromisso[];
}

export function DayDetailsModal({ open, onOpenChange, selectedDate, compromissos }: DayDetailsModalProps) {
  const { setEditingCompromisso, setFormOpen, setSelectedDate } = useAgenda();

  const handleAgendarClick = () => {
    setSelectedDate(selectedDate);
    setEditingCompromisso(null);
    setFormOpen(true);
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
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

  const getCardBorder = (status: string) => {
    switch (status) {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'PRÉ-AGENDADO';
      default:
        return status;
    }
  };

  const sortedCompromissos = compromissos.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(selectedDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {compromissos.length > 0 
                ? `${compromissos.length} compromisso${compromissos.length > 1 ? 's' : ''} agendado${compromissos.length > 1 ? 's' : ''}`
                : 'Nenhum compromisso agendado'
              }
            </h3>
            <Button onClick={handleAgendarClick} className="gap-2">
              <Plus className="w-4 h-4" />
              Agendar Compromisso
            </Button>
          </div>

          {compromissos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Não há compromissos agendados para este dia.</p>
              <p className="text-sm mt-1">Clique em "Agendar Compromisso" para criar um novo.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCompromissos.map((compromisso) => (
                <Card key={compromisso.id} className={`shadow-sm border-l-4 ${getCardBorder(compromisso.status)}`}>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(compromisso.status)}
                        {compromisso.titulo}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(compromisso.status)}`}>
                        {getStatusText(compromisso.status)}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="text-sm text-muted-foreground space-y-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{compromisso.horaInicio}</span>
                      </div>
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
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

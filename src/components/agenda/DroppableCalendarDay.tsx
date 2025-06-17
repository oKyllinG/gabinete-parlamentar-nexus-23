
import { useDroppable } from '@dnd-kit/core';
import { format, isSameMonth, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Compromisso } from '@/types/agenda';
import { DraggableEventItem } from './DraggableEventItem';

interface DroppableCalendarDayProps {
  day: Date;
  currentMonth: Date;
  compromissos: Compromisso[];
  onClick: () => void;
}

export function DroppableCalendarDay({ 
  day, 
  currentMonth, 
  compromissos, 
  onClick 
}: DroppableCalendarDayProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: format(day, 'yyyy-MM-dd'),
    data: {
      date: day,
    },
  });

  const compromissosConfirmados = compromissos.filter(c => c.status === 'CONFIRMADO');

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-32 p-1 border-b border-r overflow-hidden flex flex-col cursor-pointer hover:bg-gray-50 transition-colors",
        !isSameMonth(day, currentMonth) && "bg-gray-50 text-gray-400",
        isOver && "bg-blue-50 border-blue-300",
        "relative"
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "flex items-center justify-center h-7 w-7 rounded-full text-sm self-end",
          isSameDay(day, new Date()) && "bg-blue-600 text-white font-bold"
        )}
      >
        {format(day, 'd')}
      </span>
      <div className="mt-1 space-y-1 flex-grow overflow-y-auto pr-1">
        {compromissosConfirmados.slice(0, 2).map(c => (
          <DraggableEventItem key={c.id} compromisso={c} />
        ))}
        {compromissosConfirmados.length > 2 && (
          <div className="text-xs text-blue-700 font-semibold cursor-pointer">
            + {compromissosConfirmados.length - 2} mais
          </div>
        )}
      </div>
      {isOver && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed rounded opacity-50 pointer-events-none" />
      )}
    </div>
  );
}

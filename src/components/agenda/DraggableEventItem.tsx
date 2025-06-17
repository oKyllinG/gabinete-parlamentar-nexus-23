
import { useDraggable } from '@dnd-kit/core';
import { useAgendaCategorias } from '@/contexts/AgendaCategoriasContext';
import { Compromisso } from '@/types/agenda';
import { CSS } from '@dnd-kit/utilities';

interface DraggableEventItemProps {
  compromisso: Compromisso;
}

export function DraggableEventItem({ compromisso }: DraggableEventItemProps) {
  const { categorias } = useAgendaCategorias();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: compromisso.id,
    data: {
      compromisso,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  // Encontrar a categoria do compromisso
  const categoria = categorias.find(cat => cat.slug === compromisso.categoria);
  const cor = categoria?.cor || '#4267F1'; // Cor padrão azul
  
  const statusColor = compromisso.status === 'CONFIRMADO' ? cor : '#9CA3AF'; // Cinza para não confirmado
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`text-white rounded p-1 text-xs mb-1 truncate cursor-grab active:cursor-grabbing ${
        isDragging ? 'z-50' : ''
      }`}
      style={{
        ...style,
        backgroundColor: statusColor
      }}
    >
      {compromisso.horaInicio} - {compromisso.titulo}
    </div>
  );
}

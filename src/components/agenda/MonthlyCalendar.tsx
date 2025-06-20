
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parseISO, addWeeks, subWeeks, startOfWeek as startOfWeekFn, endOfWeek as endOfWeekFn, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgenda } from '@/contexts/AgendaContext';
import { useAgendaCategorias } from '@/contexts/AgendaCategoriasContext';
import { Compromisso } from '@/types/agenda';
import { cn } from '@/lib/utils';
import { DayDetailsModal } from './DayDetailsModal';
import { DndContext, DragEndEvent, DragOverlay, useDroppable } from '@dnd-kit/core';
import { DroppableCalendarDay } from './DroppableCalendarDay';
import { DraggableEventItem } from './DraggableEventItem';

const EventItem = ({ compromisso }: { compromisso: Compromisso }) => {
    const { categorias } = useAgendaCategorias();
    
    // Encontrar a categoria do compromisso
    const categoria = categorias.find(cat => cat.slug === compromisso.categoria);
    const cor = categoria?.cor || '#4267F1'; // Cor padrão azul
    
    // Cores diferentes baseadas no status
    let statusColor = cor;
    let opacity = '1';
    
    switch (compromisso.status) {
        case 'CONFIRMADO':
            statusColor = cor; // Cor normal da categoria
            break;
        case 'PENDENTE':
            statusColor = '#F59E0B'; // Amarelo para pendente
            break;
        case 'RECUSADO':
            statusColor = '#EF4444'; // Vermelho para recusado
            break;
        case 'CANCELADO':
            statusColor = '#9CA3AF'; // Cinza para cancelado
            opacity = '0.6';
            break;
        default:
            statusColor = '#9CA3AF';
    }
    
    return (
        <div 
            className="text-white rounded p-1 text-xs mb-1 truncate"
            style={{ backgroundColor: statusColor, opacity }}
        >
            {compromisso.horaInicio} - {compromisso.titulo}
        </div>
    )
}

// Componente DroppableWeekDay para semanas com drag and drop
const DroppableWeekDay = ({ day, compromissos, onClick }: { day: Date, compromissos: Compromisso[], onClick: () => void }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: format(day, 'yyyy-MM-dd'),
        data: {
            date: day,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "h-64 p-2 border-r cursor-pointer hover:bg-gray-50 transition-colors relative",
                isOver && "bg-blue-50 border-blue-300"
            )}
            onClick={onClick}
        >
            <div className="space-y-1">
                {compromissos.map(c => (
                    <DraggableEventItem key={c.id} compromisso={c} />
                ))}
            </div>
            {isOver && (
                <div className="absolute inset-0 bg-blue-100 border-2 border-blue-300 border-dashed rounded opacity-50 pointer-events-none" />
            )}
        </div>
    );
};

export function MonthlyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('Mês');
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const [draggedCompromisso, setDraggedCompromisso] = useState<Compromisso | null>(null);
    
    const { compromissos, updateCompromisso } = useAgenda();
    const { categorias } = useAgendaCategorias();

    const nextPeriod = () => {
        if (view === 'Mês') setCurrentDate(addMonths(currentDate, 1));
        else if (view === 'Semana') setCurrentDate(addWeeks(currentDate, 1));
        else setCurrentDate(addDays(currentDate, 1));
    };

    const prevPeriod = () => {
        if (view === 'Mês') setCurrentDate(subMonths(currentDate, 1));
        else if (view === 'Semana') setCurrentDate(subWeeks(currentDate, 1));
        else setCurrentDate(subDays(currentDate, 1));
    };

    const today = () => setCurrentDate(new Date());

    const getCompromissosForDay = (day: Date) => {
        return compromissos.filter(c => isSameDay(parseISO(c.data), day));
    }

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
        setIsDayModalOpen(true);
    };

    const handleDragStart = (event: any) => {
        const compromisso = event.active.data.current?.compromisso;
        if (compromisso) {
            setDraggedCompromisso(compromisso);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        if (!over) {
            setDraggedCompromisso(null);
            return;
        }

        const compromisso = active.data.current?.compromisso as Compromisso;
        const newDateString = over.id as string;
        
        if (compromisso && newDateString) {
            // Criar nova data mantendo o fuso horário local
            const [year, month, day] = newDateString.split('-').map(Number);
            const newDate = new Date(year, month - 1, day);
            
            // Manter a mesma hora do compromisso original, apenas mudando a data
            const originalDate = new Date(compromisso.data);
            newDate.setHours(originalDate.getHours(), originalDate.getMinutes(), originalDate.getSeconds(), originalDate.getMilliseconds());
            
            const updatedCompromisso = {
                ...compromisso,
                data: newDate.toISOString()
            };
            
            console.log('Movendo compromisso:', {
                titulo: compromisso.titulo,
                dataOriginal: compromisso.data,
                dataDestino: newDateString,
                novaData: newDate.toISOString(),
                novaDataLocal: newDate.toLocaleDateString('pt-BR')
            });
            
            updateCompromisso(updatedCompromisso);
        }
        
        setDraggedCompromisso(null);
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { locale: ptBR });
        const endDate = endOfWeek(monthEnd, { locale: ptBR });
        const days = eachDayOfInterval({ start: startDate, end: endDate });
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        return (
            <>
                <div className="grid grid-cols-7 text-center font-semibold text-gray-500 text-sm border-b">
                    {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const compromissosDoDia = getCompromissosForDay(day);
                        return (
                            <DroppableCalendarDay
                                key={index}
                                day={day}
                                currentMonth={monthStart}
                                compromissos={compromissosDoDia}
                                onClick={() => handleDayClick(day)}
                            />
                        );
                    })}
                </div>
            </>
        );
    };

    const renderWeekView = () => {
        const weekStart = startOfWeekFn(currentDate, { locale: ptBR });
        const weekEnd = endOfWeekFn(currentDate, { locale: ptBR });
        const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
        const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        return (
            <>
                <div className="grid grid-cols-7 text-center font-semibold text-gray-500 text-sm border-b">
                    {weekDays.map((dayName, index) => (
                        <div key={dayName} className="py-2">
                            <div>{dayName}</div>
                            <div className="text-lg font-bold text-gray-800">{format(days[index], 'd')}</div>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((day, index) => {
                        const compromissosDoDia = getCompromissosForDay(day);
                        return (
                            <DroppableWeekDay
                                key={index}
                                day={day}
                                compromissos={compromissosDoDia}
                                onClick={() => handleDayClick(day)}
                            />
                        );
                    })}
                </div>
            </>
        );
    };

    const renderDayView = () => {
        const compromissosDoDia = getCompromissosForDay(currentDate);
        const compromissosSorted = compromissosDoDia.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

        return (
            <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                    {format(currentDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </h3>
                {compromissosSorted.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>Nenhum compromisso agendado para este dia.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {compromissosSorted.map((compromisso) => (
                            <div key={compromisso.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{compromisso.titulo}</h4>
                                        <p className="text-sm text-gray-600">{compromisso.horaInicio}</p>
                                        {compromisso.local && <p className="text-sm text-gray-600">{compromisso.local}</p>}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        compromisso.status === 'CONFIRMADO' ? 'bg-green-100 text-green-800' :
                                        compromisso.status === 'PENDENTE' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {compromisso.status === 'PENDENTE' ? 'PRÉ-AGENDADO' : compromisso.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const getTitle = () => {
        if (view === 'Mês') return format(currentDate, 'MMMM yyyy', { locale: ptBR });
        if (view === 'Semana') {
            const weekStart = startOfWeekFn(currentDate, { locale: ptBR });
            const weekEnd = endOfWeekFn(currentDate, { locale: ptBR });
            return `${format(weekStart, 'dd MMM', { locale: ptBR })} - ${format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}`;
        }
        return format(currentDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    };

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="bg-white p-6 rounded-lg border">
                <header className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="h-6 w-6 text-gray-600" />
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                            Agenda - {getTitle()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center rounded-md bg-gray-100 p-1">
                            <Button size="sm" variant={view === 'Mês' ? 'secondary' : 'ghost'} onClick={() => setView('Mês')} className="h-8">Mês</Button>
                            <Button size="sm" variant={view === 'Semana' ? 'secondary' : 'ghost'} onClick={() => setView('Semana')} className="h-8">Semana</Button>
                            <Button size="sm" variant={view === 'Dia' ? 'secondary' : 'ghost'} onClick={() => setView('Dia')} className="h-8">Dia</Button>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="icon" onClick={prevPeriod} className="h-9 w-9">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" onClick={today} className="h-9 px-4">Hoje</Button>
                            <Button variant="outline" size="icon" onClick={nextPeriod} className="h-9 w-9">
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </header>

                {view === 'Mês' && renderMonthView()}
                {view === 'Semana' && renderWeekView()}
                {view === 'Dia' && renderDayView()}

                <footer className="mt-4 flex justify-end">
                    <Button variant="ghost" className="text-gray-600 font-normal">
                        Arraste compromissos para alterar datas
                    </Button>
                </footer>

                {selectedDay && (
                    <DayDetailsModal
                        open={isDayModalOpen}
                        onOpenChange={setIsDayModalOpen}
                        selectedDate={selectedDay}
                        compromissos={getCompromissosForDay(selectedDay)}
                    />
                )}
            </div>
            
            <DragOverlay>
                {draggedCompromisso && (
                    <DraggableEventItem compromisso={draggedCompromisso} />
                )}
            </DragOverlay>
        </DndContext>
    );
}

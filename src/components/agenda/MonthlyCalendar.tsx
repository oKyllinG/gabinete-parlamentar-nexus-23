import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAgenda } from '@/contexts/AgendaContext';
import { Compromisso } from '@/types/agenda';
import { cn } from '@/lib/utils';
import { DayDetailsModal } from './DayDetailsModal';

const EventItem = ({ compromisso }: { compromisso: Compromisso }) => {
    const statusColor = compromisso.status === 'CONFIRMADO' ? 'bg-blue-500' : 'bg-gray-400';
    return (
        <div className={cn("text-white rounded p-1 text-xs mb-1 truncate", statusColor)}>
            {compromisso.horaInicio} - {compromisso.titulo}
        </div>
    )
}

export function MonthlyCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('Mês'); // Mês, Semana, Dia
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [isDayModalOpen, setIsDayModalOpen] = useState(false);
    const { compromissos } = useAgenda();

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(new Date());

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ptBR });
    const endDate = endOfWeek(monthEnd, { locale: ptBR });
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const getCompromissosForDay = (day: Date) => {
        return compromissos.filter(c => isSameDay(parseISO(c.data), day));
    }

    const handleDayClick = (day: Date) => {
        setSelectedDay(day);
        setIsDayModalOpen(true);
    };

    return (
        <div className="bg-white p-6 rounded-lg border">
            <header className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-800 capitalize">
                        Agenda - {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center rounded-md bg-gray-100 p-1">
                        <Button size="sm" variant={view === 'Mês' ? 'secondary' : 'ghost'} onClick={() => setView('Mês')} className="h-8">Mês</Button>
                        <Button size="sm" variant={view === 'Semana' ? 'secondary' : 'ghost'} onClick={() => setView('Semana')} className="h-8">Semana</Button>
                        <Button size="sm" variant={view === 'Dia' ? 'secondary' : 'ghost'} onClick={() => setView('Dia')} className="h-8">Dia</Button>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" onClick={prevMonth} className="h-9 w-9">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" onClick={today} className="h-9 px-4">Hoje</Button>
                        <Button variant="outline" size="icon" onClick={nextMonth} className="h-9 w-9">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-7 text-center font-semibold text-gray-500 text-sm border-b">
                {weekDays.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>

            <div className="grid grid-cols-7">
                {days.map((day, index) => {
                    const compromissosDoDia = getCompromissosForDay(day);
                    const compromissosConfirmados = compromissosDoDia.filter(c => c.status === 'CONFIRMADO');
                    return (
                        <div
                            key={index}
                            className={cn(
                                "h-32 p-1 border-b border-r overflow-hidden flex flex-col cursor-pointer hover:bg-gray-50 transition-colors",
                                !isSameMonth(day, monthStart) && "bg-gray-50 text-gray-400",
                                (index + 1) % 7 === 0 && "border-r-0"
                            )}
                            onClick={() => handleDayClick(day)}
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
                                {compromissosConfirmados.slice(0, 2).map(c => <EventItem key={c.id} compromisso={c} />)}
                                {compromissosConfirmados.length > 2 && (
                                    <div className="text-xs text-blue-700 font-semibold cursor-pointer">+ {compromissosConfirmados.length - 2} mais</div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <footer className="mt-4 flex justify-end">
                <Button variant="ghost" className="text-gray-600 font-normal">
                    Dicas de interação
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
    );
}

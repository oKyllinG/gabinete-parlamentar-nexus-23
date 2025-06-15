
import { AgendaProvider, useAgenda } from "@/contexts/AgendaContext";
import { AgendaCategoriasProvider } from "@/contexts/AgendaCategoriasContext";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaNav } from "@/components/agenda/AgendaNav";
import { GoogleCalendarBanner } from "@/components/agenda/GoogleCalendarBanner";
import { AgendaToolbar } from "@/components/agenda/AgendaToolbar";
import { MonthlyCalendar } from "@/components/agenda/MonthlyCalendar";
import { PreAgendaList } from "@/components/agenda/PreAgendaList";
import { CompromissoFormDialog } from "@/components/agenda/CompromissoFormDialog";
import AgendaCategoriasManager from "@/components/agenda/AgendaCategoriasManager";

function AgendaView() {
  const { view } = useAgenda();
  
  const renderContent = () => {
    switch (view) {
      case 'CALENDARIO':
        return (
          <>
            <GoogleCalendarBanner />
            <AgendaToolbar />
            <MonthlyCalendar />
          </>
        );
      case 'GERENCIAR':
        return (
          <>
            <AgendaToolbar />
            <PreAgendaList />
          </>
        );
      case 'CATEGORIAS':
        return <AgendaCategoriasManager />;
      default:
        return (
          <>
            <GoogleCalendarBanner />
            <AgendaToolbar />
            <MonthlyCalendar />
          </>
        );
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AgendaHeader />
      <AgendaNav />
      {renderContent()}
      <CompromissoFormDialog />
    </div>
  );
}

export default function Agenda() {
  return (
    <AgendaCategoriasProvider>
      <AgendaProvider>
        <AgendaView />
      </AgendaProvider>
    </AgendaCategoriasProvider>
  );
}

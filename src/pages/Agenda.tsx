
import { AgendaProvider } from "@/contexts/AgendaContext";
import { AgendaHeader } from "@/components/agenda/AgendaHeader";
import { AgendaNav } from "@/components/agenda/AgendaNav";
import { GoogleCalendarBanner } from "@/components/agenda/GoogleCalendarBanner";
import { AgendaToolbar } from "@/components/agenda/AgendaToolbar";
import { MonthlyCalendar } from "@/components/agenda/MonthlyCalendar";

function AgendaView() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <AgendaHeader />
      <AgendaNav />
      <GoogleCalendarBanner />
      <AgendaToolbar />
      <MonthlyCalendar />
    </div>
  );
}

export default function Agenda() {
  return (
    <AgendaProvider>
      <AgendaView />
    </AgendaProvider>
  );
}

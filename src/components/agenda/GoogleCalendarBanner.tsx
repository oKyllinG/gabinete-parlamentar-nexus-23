
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const GoogleCalendarIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8">
        <path d="M7.5 5.5H16.5C17.6046 5.5 18.5 6.39543 18.5 7.5V16.5C18.5 17.6046 17.6046 18.5 16.5 18.5H7.5C6.39543 18.5 5.5 17.6046 5.5 16.5V7.5C5.5 6.39543 6.39543 5.5 7.5 5.5Z" stroke="#4285F4" strokeWidth="1.5"/>
        <path d="M16.5 9.5H5.5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12.5 5.5V3" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12.5 21V18.5" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.5 5.5V3" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9.5 21V18.5" stroke="#34A853" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 12.5H21" stroke="#FBBC05" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 12.5H5.5" stroke="#FBBC05" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.5 9.5H21" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M3 9.5H5.5" stroke="#EA4335" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12.5 14H9.5V11H12.5V14Z" fill="#34A853"/>
    </svg>
);

export function GoogleCalendarBanner() {
  return (
    <div className="mb-6">
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <GoogleCalendarIcon />
          <div>
            <h3 className="font-bold text-gray-800">Google Calendar</h3>
            <p className="text-sm text-gray-600">Sincronize suas reuniões com o Google Calendar para acesso em qualquer dispositivo.</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Conectar
        </Button>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <span>Acesse sua agenda em qualquer dispositivo conectando com o Google Calendar</span>
      </div>
    </div>
  );
}

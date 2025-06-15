import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export function AgendaHeader() {
  return <header className="flex justify-between items-start mb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
        <p className="text-gray-500 mt-1">Gerencie seus compromissos, reuniões e eventos.</p>
      </div>
      <Avatar>
        
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
    </header>;
}
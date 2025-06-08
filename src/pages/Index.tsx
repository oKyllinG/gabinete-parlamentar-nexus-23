
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Dashboard } from "@/components/Dashboard"
import { Toaster } from "@/components/ui/toaster"
import Oficios from "@/pages/Oficios"
import Contatos from "@/pages/Contatos"
import Emendas from "@/pages/Emendas"
import ObrasEquipamentos from "@/pages/ObrasEquipamentos"
import PainelControle from "@/pages/PainelControle"
import Briefing from "@/pages/Briefing"
import { useLocation } from "react-router-dom"

const Index = () => {
  const location = useLocation()
  
  // Determine which content to show based on route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/painel-controle':
        return <PainelControle />
      case '/oficios':
        return <Oficios />
      case '/contatos':
        return <Contatos />
      case '/emendas':
        return <Emendas />
      case '/obras-equipamentos':
        return <ObrasEquipamentos />
      case '/briefing':
        return <Briefing />
      default:
        return <Dashboard />
    }
  }
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/painel-controle':
        return 'Painel de Controle'
      case '/oficios':
        return 'Ofícios'
      case '/contatos':
        return 'Contatos'
      case '/emendas':
        return 'Emendas Parlamentares'
      case '/obras-equipamentos':
        return 'Obras e Equipamentos'
      case '/briefing':
        return 'Briefing'
      default:
        return 'Sistema de Gestão de Gabinete'
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 border-b border-border bg-card shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground" />
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  {getPageTitle()}
                </h2>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 min-h-[calc(100vh-80px)]">
            {getPageContent()}
          </div>
        </main>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default Index;

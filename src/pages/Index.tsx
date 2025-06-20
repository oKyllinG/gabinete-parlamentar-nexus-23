
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
// Removido: import { Dashboard } from "@/components/Dashboard"
import Oficios from "@/pages/Oficios"
import Contatos from "@/pages/Contatos"
import Emendas from "@/pages/Emendas"
import ObrasEquipamentos from "@/pages/ObrasEquipamentos"
import PainelControle from "@/pages/PainelControle"
import Briefing from "@/pages/Briefing"
import MunicipioBriefing from "@/pages/MunicipioBriefing"
import Configuracoes from "@/pages/Configuracoes"
import Agenda from "@/pages/Agenda"
import { useLocation, Navigate } from "react-router-dom"

const Index = () => {
  const location = useLocation()
  
  // Redirecionar "/" para "/painel-controle"
  if (location.pathname === "/") {
    return <Navigate to="/painel-controle" replace />
  }

  // Determine which content to show based on route
  const getPageContent = () => {
    switch (location.pathname) {
      case '/painel-controle':
        return <PainelControle />
      case '/agenda':
        return <Agenda />
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
      case '/configuracoes':
        return <Configuracoes />
      default:
        // Check if it's a municipality briefing route
        if (location.pathname.startsWith('/briefing/')) {
          return <MunicipioBriefing />
        }
        // Antes: return <Dashboard />
        // Agora: retornar PainelControle também como fallback padrão.
        return <PainelControle />
    }
  }
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/painel-controle':
        return 'Painel de Controle'
      case '/agenda':
        return 'Agenda'
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
      case '/configuracoes':
        return 'Configurações'
      default:
        // Check if it's a municipality briefing route
        if (location.pathname.startsWith('/briefing/')) {
          return 'Briefing Municipal'
        }
        return 'Painel de Controle'
    }
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="main-container min-h-screen flex w-full bg-background">
        {/* Sidebar is wrapped in a div with no-print class */}
        <div className="no-print">
            <AppSidebar />
        </div>
        <main className="flex-1">
          {/* Header is also marked as no-print */}
          <div className="p-4 border-b border-border bg-card shadow-sm no-print">
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
    </SidebarProvider>
  );
};

export default Index;

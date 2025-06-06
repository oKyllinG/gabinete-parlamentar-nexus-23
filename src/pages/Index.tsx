
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Dashboard } from "@/components/Dashboard"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-4 border-b border-border bg-card">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground" />
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">
                  Sistema de Gestão de Gabinete
                </h2>
              </div>
            </div>
          </div>
          <Dashboard />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;

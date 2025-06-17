
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { AgendaWidget } from "@/components/dashboard/AgendaWidget";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { OperationalStatus } from "@/components/dashboard/OperationalStatus";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RegionalPanel } from "@/components/dashboard/RegionalPanel";

const PainelControle = () => {
  return (
    <div className="p-6 space-y-6 bg-gray-50">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Painel de Controle</h1>
        <p className="text-muted-foreground">
          Dashboard executivo do sistema de gestão
        </p>
      </div>
      
      {/* Estatísticas Principais */}
      <DashboardStats />
      
      {/* Grid Principal do Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda */}
        <div className="lg:col-span-2 space-y-6">
          <AgendaWidget />
          <FinancialOverview />
        </div>
        
        {/* Coluna Direita */}
        <div className="space-y-6">
          <QuickActions />
          <OperationalStatus />
        </div>
      </div>
      
      {/* Painel Regional */}
      <RegionalPanel />
    </div>
  )
}

export default PainelControle

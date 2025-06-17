
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Users, DollarSign, Building, MapPin } from "lucide-react";
import { useAgenda } from "@/contexts/AgendaContext";
import { format, isToday, isThisWeek, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardStats() {
  const { compromissos } = useAgenda();
  
  // Dados fictícios para demonstração (em um app real, viria de contextos/APIs)
  const stats = {
    compromissosHoje: compromissos.filter(c => isToday(parseISO(c.data))).length,
    compromissosSemana: compromissos.filter(c => isThisWeek(parseISO(c.data))).length,
    oficiosPendentes: 12,
    totalContatos: 247,
    emendasAndamento: 8,
    obrasExecucao: 15,
    municipiosAlertas: 3
  };

  const statCards = [
    {
      title: "Compromissos Hoje",
      value: stats.compromissosHoje,
      subtitle: `${stats.compromissosSemana} esta semana`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Ofícios Pendentes",
      value: stats.oficiosPendentes,
      subtitle: "Aguardando resposta",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Total de Contatos",
      value: stats.totalContatos,
      subtitle: "Todos os tipos",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Emendas em Andamento",
      value: stats.emendasAndamento,
      subtitle: "Com destinações ativas",
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Obras em Execução",
      value: stats.obrasExecucao,
      subtitle: "Em todo o estado",
      icon: Building,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Municípios c/ Alertas",
      value: stats.municipiosAlertas,
      subtitle: "Requer atenção",
      icon: MapPin,
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.subtitle}
                </p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Calendar,
  FileText,
  Users,
  Briefcase,
  Building,
  DollarSign
} from "lucide-react"

const dashboardCards = [
  {
    title: "Agenda",
    description: "Próximos compromissos e reuniões",
    icon: Calendar,
    count: "12",
    subtitle: "eventos hoje"
  },
  {
    title: "Ofícios",
    description: "Documentos oficiais pendentes",
    icon: FileText,
    count: "8",
    subtitle: "aguardando resposta"
  },
  {
    title: "Contatos",
    description: "Rede de relacionamentos",
    icon: Users,
    count: "247",
    subtitle: "contatos ativos"
  },
  {
    title: "Briefings",
    description: "Relatórios e informações",
    icon: Briefcase,
    count: "5",
    subtitle: "pendentes"
  },
  {
    title: "Obras",
    description: "Projetos em andamento",
    icon: Building,
    count: "23",
    subtitle: "em execução"
  },
  {
    title: "Emendas",
    description: "Emendas parlamentares",
    icon: DollarSign,
    count: "15",
    subtitle: "em tramitação"
  }
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das atividades do gabinete
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-1">
                {card.count}
              </div>
              <p className="text-xs text-muted-foreground">
                {card.subtitle}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividade Recente</CardTitle>
            <CardDescription>
              Últimas movimentações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhuma atividade registrada ainda
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos Compromissos</CardTitle>
            <CardDescription>
              Agenda dos próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground text-center py-8">
                Nenhum compromisso agendado
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

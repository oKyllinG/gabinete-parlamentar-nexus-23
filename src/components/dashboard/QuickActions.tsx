
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Users, 
  DollarSign, 
  Building, 
  Briefcase,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Nova Reunião",
      description: "Agendar compromisso",
      icon: Calendar,
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600",
      action: () => navigate('/agenda')
    },
    {
      title: "Novo Ofício",
      description: "Registrar documento",
      icon: FileText,
      color: "bg-orange-50 hover:bg-orange-100",
      iconColor: "text-orange-600",
      action: () => navigate('/oficios')
    },
    {
      title: "Novo Contato",
      description: "Adicionar pessoa",
      icon: Users,
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600",
      action: () => navigate('/contatos')
    },
    {
      title: "Nova Emenda",
      description: "Registrar emenda",
      icon: DollarSign,
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600",
      action: () => navigate('/emendas')
    },
    {
      title: "Nova Obra",
      description: "Cadastrar obra",
      icon: Building,
      color: "bg-cyan-50 hover:bg-cyan-100",
      iconColor: "text-cyan-600",
      action: () => navigate('/obras-equipamentos')
    },
    {
      title: "Ver Briefing",
      description: "Consultar município",
      icon: Briefcase,
      color: "bg-pink-50 hover:bg-pink-100",
      iconColor: "text-pink-600",
      action: () => navigate('/briefing')
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`${action.color} justify-start h-auto p-4 transition-colors`}
              onClick={action.action}
            >
              <div className="flex items-center gap-3 w-full">
                <div className={`p-2 rounded-full ${action.color}`}>
                  <action.icon className={`h-4 w-4 ${action.iconColor}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

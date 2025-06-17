
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileText, Users, Building, AlertTriangle } from "lucide-react";

export function OperationalStatus() {
  // Dados fictícios para demonstração
  const statusData = {
    oficios: {
      total: 45,
      enviados: 28,
      recebidos: 12,
      pendentes: 5
    },
    contatos: {
      total: 247,
      servidores: 89,
      liderancas: 45,
      empresarios: 67,
      cidadaos: 46
    },
    obras: {
      total: 18,
      execucao: 12,
      paralisadas: 3,
      concluidas: 3
    }
  };

  const alertas = [
    { tipo: "Obra Paralisada", local: "Campo Grande", urgencia: "alta" },
    { tipo: "Ofício Pendente", descricao: "Resposta há 15 dias", urgencia: "media" },
    { tipo: "Reunião Confirmada", descricao: "Amanhã às 14h", urgencia: "baixa" }
  ];

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Operacional */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Status Operacional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ofícios */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Ofícios</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {statusData.oficios.total} total
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Enviados</span>
                <span>{statusData.oficios.enviados}</span>
              </div>
              <Progress 
                value={(statusData.oficios.enviados / statusData.oficios.total) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Recebidos: {statusData.oficios.recebidos}</span>
                <span>Pendentes: {statusData.oficios.pendentes}</span>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">Contatos</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {statusData.contatos.total} total
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Servidores</span>
                <span>{statusData.contatos.servidores}</span>
              </div>
              <div className="flex justify-between">
                <span>Lideranças</span>
                <span>{statusData.contatos.liderancas}</span>
              </div>
              <div className="flex justify-between">
                <span>Empresários</span>
                <span>{statusData.contatos.empresarios}</span>
              </div>
              <div className="flex justify-between">
                <span>Cidadãos</span>
                <span>{statusData.contatos.cidadaos}</span>
              </div>
            </div>
          </div>

          {/* Obras */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span className="font-medium">Obras</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {statusData.obras.total} total
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Em Execução</span>
                <span className="text-green-600">{statusData.obras.execucao}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Paralisadas</span>
                <span className="text-red-600">{statusData.obras.paralisadas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Concluídas</span>
                <span className="text-blue-600">{statusData.obras.concluidas}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas e Pendências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertas.map((alerta, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertTriangle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{alerta.tipo}</h4>
                      <p className="text-xs text-muted-foreground">
                        {alerta.descricao || alerta.local}
                      </p>
                    </div>
                    <Badge className={getUrgenciaColor(alerta.urgencia)}>
                      {alerta.urgencia}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

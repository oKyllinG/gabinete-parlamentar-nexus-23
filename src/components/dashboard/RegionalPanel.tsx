
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Building, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function RegionalPanel() {
  const navigate = useNavigate();

  // Dados fictícios das regiões de MS
  const regioes = [
    {
      nome: "Campo Grande",
      municipios: 8,
      populacao: "1.2M",
      obras: 5,
      alertas: 1,
      destaque: true
    },
    {
      nome: "Dourados",
      municipios: 12,
      populacao: "520K",
      obras: 3,
      alertas: 0,
      destaque: false
    },
    {
      nome: "Três Lagoas",
      municipios: 6,
      populacao: "180K",
      obras: 2,
      alertas: 1,
      destaque: false
    },
    {
      nome: "Corumbá",
      municipios: 9,
      populacao: "320K",
      obras: 4,
      alertas: 0,
      destaque: false
    },
    {
      nome: "Ponta Porã",
      municipios: 8,
      populacao: "290K",
      obras: 1,
      alertas: 2,
      destaque: false
    },
    {
      nome: "Coxim",
      municipios: 15,
      populacao: "180K",
      obras: 2,
      alertas: 0,
      destaque: false
    }
  ];

  const municipiosDestaque = [
    { nome: "Campo Grande", tipo: "Capital", status: "alta-atividade" },
    { nome: "Dourados", tipo: "Polo Regional", status: "normal" },
    { nome: "Três Lagoas", tipo: "Industrial", status: "crescimento" },
    { nome: "Corumbá", tipo: "Fronteira", status: "normal" },
    { nome: "Bonito", tipo: "Turismo", status: "normal" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alta-atividade': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'crescimento': return 'bg-green-100 text-green-800 border-green-200';
      case 'normal': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Regiões */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Regiões de Mato Grosso do Sul
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/briefing')}
          >
            Ver Briefing
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regioes.map((regiao, index) => (
              <div 
                key={index} 
                className={`p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer ${
                  regiao.destaque ? 'border-blue-200 bg-blue-50' : ''
                }`}
                onClick={() => navigate('/briefing')}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{regiao.nome}</h3>
                  {regiao.alertas > 0 && (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {regiao.alertas}
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="font-medium">{regiao.municipios}</p>
                    <p className="text-xs text-muted-foreground">Municípios</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="font-medium">{regiao.populacao}</p>
                    <p className="text-xs text-muted-foreground">População</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Building className="h-4 w-4 text-gray-500" />
                    </div>
                    <p className="font-medium">{regiao.obras}</p>
                    <p className="text-xs text-muted-foreground">Obras</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Municípios em Destaque */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Municípios Destaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {municipiosDestaque.map((municipio, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate('/briefing')}
              >
                <div>
                  <h4 className="font-medium">{municipio.nome}</h4>
                  <p className="text-sm text-muted-foreground">{municipio.tipo}</p>
                </div>
                <Badge className={getStatusColor(municipio.status)}>
                  {municipio.status === 'alta-atividade' && 'Alta'}
                  {municipio.status === 'crescimento' && 'Crescimento'}
                  {municipio.status === 'normal' && 'Normal'}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/briefing')}
          >
            Ver Todos os Municípios
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Building2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";

export function FinancialOverview() {
  const navigate = useNavigate();

  // Dados fictícios para demonstração
  const dadosEmendas = [
    { name: "Destinadas", value: 850000, color: "#10B981" },
    { name: "Disponíveis", value: 450000, color: "#6B7280" },
    { name: "Em Análise", value: 200000, color: "#F59E0B" }
  ];

  const dadosObras = [
    { tipo: "Saúde", valor: 320000, qtd: 5 },
    { tipo: "Educação", valor: 280000, qtd: 4 },
    { tipo: "Infraestrutura", valor: 250000, qtd: 6 },
    { tipo: "Esporte", valor: 180000, qtd: 3 }
  ];

  const totalEmendas = dadosEmendas.reduce((acc, curr) => acc + curr.value, 0);
  const totalObras = dadosObras.reduce((acc, curr) => acc + curr.valor, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card Emendas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Emendas Parlamentares
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/emendas')}
          >
            Ver Emendas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                R$ {(totalEmendas / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">Total disponível</p>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosEmendas}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {dadosEmendas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${(value / 1000).toFixed(0)}k`, 'Valor']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {dadosEmendas.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">
                    R$ {(item.value / 1000).toFixed(0)}k
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card Obras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Obras por Categoria
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/obras-equipamentos')}
          >
            Ver Obras
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                R$ {(totalObras / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-muted-foreground">Total em execução</p>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosObras}>
                  <XAxis dataKey="tipo" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => [`R$ ${(value / 1000).toFixed(0)}k`, 'Valor']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="valor" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {dadosObras.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{item.tipo}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{item.qtd} obras</span>
                    <span className="font-medium">
                      R$ {(item.valor / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

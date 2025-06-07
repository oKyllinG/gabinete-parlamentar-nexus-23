
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Target, Search, Filter } from "lucide-react";
import { Emenda } from "@/pages/Emendas";

interface EmendasListProps {
  emendas: Emenda[];
  onEdit: (emenda: Emenda) => void;
  onDelete: (id: string) => void;
  onDestinar: (emenda: Emenda) => void;
}

const tipoLabels = {
  individual: 'Individual',
  bancada: 'Bancada',
  comissao: 'Comissão'
};

const statusLabels = {
  cadastrada: 'Cadastrada',
  em_execucao: 'Em Execução',
  executada: 'Executada',
  vencida: 'Vencida'
};

const statusColors = {
  cadastrada: 'bg-blue-100 text-blue-800',
  em_execucao: 'bg-yellow-100 text-yellow-800',
  executada: 'bg-green-100 text-green-800',
  vencida: 'bg-red-100 text-red-800'
};

export const EmendasList: React.FC<EmendasListProps> = ({ 
  emendas, 
  onEdit, 
  onDelete, 
  onDestinar 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEmendas = emendas.filter(emenda => {
    const matchesSearch = 
      emenda.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emenda.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emenda.objeto.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || emenda.tipo === filterType;
    const matchesStatus = filterStatus === 'all' || emenda.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getProgressPercentage = (emenda: Emenda) => {
    return emenda.valor > 0 ? (emenda.valorDestinado / emenda.valor) * 100 : 0;
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, autor ou objeto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(tipoLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Emendas */}
      <div className="grid gap-4">
        {filteredEmendas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {emendas.length === 0 
                  ? "Nenhuma emenda cadastrada ainda." 
                  : "Nenhuma emenda encontrada com os filtros aplicados."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredEmendas.map((emenda) => (
            <Card key={emenda.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Emenda {emenda.numero}/{emenda.ano}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {emenda.autor} • {tipoLabels[emenda.tipo]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[emenda.status]}>
                      {statusLabels[emenda.status]}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Programa/Ação:</p>
                    <p className="text-sm text-muted-foreground">
                      {emenda.programa} / {emenda.acao}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Localizador:</p>
                    <p className="text-sm text-muted-foreground">{emenda.localizador}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Objeto:</p>
                  <p className="text-sm text-muted-foreground">{emenda.objeto}</p>
                </div>

                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Execução da Emenda</span>
                    <span>{getProgressPercentage(emenda).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${getProgressPercentage(emenda)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      Destinado: {emenda.valorDestinado.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </span>
                    <span>
                      Total: {emenda.valor.toLocaleString('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      })}
                    </span>
                  </div>
                </div>

                {/* Destinações */}
                {emenda.destinacoes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Destinações ({emenda.destinacoes.length}):</p>
                    <div className="space-y-1">
                      {emenda.destinacoes.slice(0, 3).map((destinacao, index) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded">
                          <div className="flex justify-between">
                            <span>{destinacao.destinatario}</span>
                            <span className="font-medium">
                              {destinacao.valor.toLocaleString('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {emenda.destinacoes.length > 3 && (
                        <p className="text-xs text-muted-foreground text-center">
                          +{emenda.destinacoes.length - 3} destinações
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Prazo: {emenda.prazoExecucao}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDestinar(emenda)}
                      disabled={emenda.valorDestinado >= emenda.valor}
                    >
                      <Target className="w-4 h-4 mr-1" />
                      Destinar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(emenda)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja excluir esta emenda?')) {
                          onDelete(emenda.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

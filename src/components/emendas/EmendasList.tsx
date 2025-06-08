
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Target, Search, Filter, Calendar, Paperclip, AlertTriangle } from "lucide-react";
import { Emenda, Destinacao } from "@/pages/Emendas";

interface EmendasListProps {
  emendas: Emenda[];
  onEdit: (emenda: Emenda) => void;
  onDelete: (id: string) => void;
  onDestinar: (emenda: Emenda) => void;
  onEditDestinacao: (emenda: Emenda, destinacao: Destinacao) => void;
  onDeleteDestinacao: (emendaId: string, destinacaoId: string) => void;
}

const tipoLabels = {
  individual: 'Individual',
  bancada: 'Bancada',
  comissao: 'Comissão'
};

const statusExecucaoLabels = {
  planejamento: 'Planejamento',
  em_execucao: 'Em Execução',
  concluida: 'Concluída',
  cancelada: 'Cancelada'
};

const statusExecucaoColors = {
  planejamento: 'bg-gray-100 text-gray-800',
  em_execucao: 'bg-blue-100 text-blue-800',
  concluida: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800'
};

// Helper function to safely format currency
const formatCurrency = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const EmendasList: React.FC<EmendasListProps> = ({ 
  emendas, 
  onEdit, 
  onDelete, 
  onDestinar,
  onEditDestinacao,
  onDeleteDestinacao
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAno, setFilterAno] = useState<string>('all');
  const [filterNumero, setFilterNumero] = useState('');
  const [filterOrgao, setFilterOrgao] = useState('');
  const [filterBeneficiario, setFilterBeneficiario] = useState('');

  // Obter anos únicos das emendas para o filtro
  const anosDisponiveis = Array.from(new Set(emendas.map(e => e.ano))).sort();

  const filteredEmendas = emendas.filter(emenda => {
    const matchesSearch = 
      emenda.numero?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emenda.autor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emenda.objeto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emenda.orgao?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || emenda.tipo === filterType;
    const matchesAno = filterAno === 'all' || emenda.ano === filterAno;
    const matchesNumero = filterNumero === '' || emenda.numero?.toLowerCase().includes(filterNumero.toLowerCase());
    const matchesOrgao = filterOrgao === '' || emenda.orgao?.toLowerCase().includes(filterOrgao.toLowerCase());
    
    const matchesBeneficiario = filterBeneficiario === '' || 
      (emenda.destinacoes && emenda.destinacoes.some(dest => 
        dest.destinatario?.toLowerCase().includes(filterBeneficiario.toLowerCase())
      ));

    return matchesSearch && matchesType && matchesAno && 
           matchesNumero && matchesOrgao && matchesBeneficiario;
  });

  const getProgressPercentage = (emenda: Emenda) => {
    const total = emenda.valorTotal || 0;
    const destinado = emenda.valorDestinado || 0;
    return total > 0 ? (destinado / total) * 100 : 0;
  };

  const isDestinacaoVencendo = (destinacao: Destinacao) => {
    if (!destinacao.dataAlerta) return false;
    const today = new Date();
    const alertDate = new Date(destinacao.dataAlerta);
    return alertDate <= today;
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, autor, objeto ou órgão..."
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

            <Select value={filterAno} onValueChange={setFilterAno}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                {anosDisponiveis.map((ano) => (
                  <SelectItem key={ano} value={ano}>
                    {ano}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Filtrar por número"
              value={filterNumero}
              onChange={(e) => setFilterNumero(e.target.value)}
            />

            <Input
              placeholder="Filtrar por órgão"
              value={filterOrgao}
              onChange={(e) => setFilterOrgao(e.target.value)}
            />

            <Input
              placeholder="Filtrar por beneficiário"
              value={filterBeneficiario}
              onChange={(e) => setFilterBeneficiario(e.target.value)}
            />
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
                      {emenda.autor} • {tipoLabels[emenda.tipo]} • {emenda.orgao}
                    </p>
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

                {/* Contrapartidas */}
                {emenda.contrapartidas && emenda.contrapartidas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Contrapartidas:</p>
                    <div className="space-y-1">
                      {emenda.contrapartidas.map((contrapartida, index) => (
                        <div key={index} className="text-xs p-2 bg-muted rounded">
                          <div className="flex justify-between">
                            <span>{contrapartida.ente}</span>
                            <span className="font-medium">
                              {formatCurrency(contrapartida.valor)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Valores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-muted rounded">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Valor da Emenda</p>
                    <p className="text-sm font-medium">
                      {formatCurrency(emenda.valor)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Contrapartidas</p>
                    <p className="text-sm font-medium">
                      {formatCurrency((emenda.valorTotal || 0) - (emenda.valor || 0))}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Valor Total</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(emenda.valorTotal)}
                    </p>
                  </div>
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
                      Destinado: {formatCurrency(emenda.valorDestinado)}
                    </span>
                    <span>
                      Disponível: {formatCurrency((emenda.valorTotal || 0) - (emenda.valorDestinado || 0))}
                    </span>
                  </div>
                </div>

                {/* Destinações */}
                {emenda.destinacoes && emenda.destinacoes.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Destinações ({emenda.destinacoes.length}):</p>
                    <div className="space-y-3">
                      {emenda.destinacoes.map((destinacao) => (
                        <div key={destinacao.id} className="p-4 bg-muted rounded-lg border">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium text-sm">{destinacao.destinatario}</h4>
                                <Badge className={statusExecucaoColors[destinacao.statusExecucao]} variant="secondary">
                                  {statusExecucaoLabels[destinacao.statusExecucao]}
                                </Badge>
                                {isDestinacaoVencendo(destinacao) && (
                                  <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    Alerta
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                                <div>
                                  <span className="font-medium">Município:</span> {destinacao.municipio}
                                </div>
                                <div>
                                  <span className="font-medium">Área:</span> {destinacao.areaAtuacao}
                                </div>
                                <div>
                                  <span className="font-medium">GND:</span> {destinacao.gnd}
                                </div>
                                <div>
                                  <span className="font-medium">PD:</span> {destinacao.pd}
                                </div>
                              </div>

                              {/* Prazos */}
                              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="font-medium">Início:</span> {new Date(destinacao.prazoInicio).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span className="font-medium">Fim:</span> {new Date(destinacao.prazoFim).toLocaleDateString('pt-BR')}
                                </div>
                              </div>

                              {destinacao.cnpj && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  <span className="font-medium">CNPJ:</span> {destinacao.cnpj}
                                </div>
                              )}

                              {destinacao.observacoes && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  <span className="font-medium">Observações:</span> {destinacao.observacoes}
                                </div>
                              )}

                              {destinacao.projetosAnexados && destinacao.projetosAnexados.length > 0 && (
                                <div className="text-xs text-muted-foreground mb-2">
                                  <div className="flex items-center gap-1">
                                    <Paperclip className="w-3 h-3" />
                                    <span className="font-medium">Projetos:</span> {destinacao.projetosAnexados.length} arquivo(s)
                                  </div>
                                </div>
                              )}

                              <div className="text-xs text-muted-foreground">
                                <span className="font-medium">Data:</span> {new Date(destinacao.dataDestinacao).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="font-medium text-lg mb-2">
                                {formatCurrency(destinacao.valor)}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onEditDestinacao(emenda, destinacao)}
                                  className="h-7 px-2"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (confirm('Tem certeza que deseja excluir esta destinação?')) {
                                      onDeleteDestinacao(emenda.id, destinacao.id);
                                    }
                                  }}
                                  className="h-7 px-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Criada em: {new Date(emenda.dataCriacao).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDestinar(emenda)}
                      disabled={(emenda.valorDestinado || 0) >= (emenda.valorTotal || 0)}
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

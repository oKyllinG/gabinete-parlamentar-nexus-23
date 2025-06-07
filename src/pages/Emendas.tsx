
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Target, DollarSign, Calendar, AlertTriangle } from "lucide-react";
import { EmendasForm } from "@/components/emendas/EmendasForm";
import { EmendasList } from "@/components/emendas/EmendasList";
import { DestinacaoDialog } from "@/components/emendas/DestinacaoDialog";
import { ExportDialog } from "@/components/emendas/ExportDialog";
import { useToast } from "@/hooks/use-toast";

export interface Contrapartida {
  id: string;
  ente: string;
  valor: number;
}

export interface Emenda {
  id: string;
  numero: string;
  ano: string;
  tipo: 'individual' | 'bancada' | 'comissao';
  autor: string;
  orgao: string;
  programa: string;
  acao: string;
  localizador: string;
  valor: number;
  valorTotal: number; // valor + contrapartidas
  valorDestinado: number;
  contrapartidas: Contrapartida[];
  objeto: string;
  justificativa: string;
  observacoes?: string;
  dataCriacao: string;
  destinacoes: Destinacao[];
}

export interface Destinacao {
  id: string;
  emendaId: string;
  tipo: 'entidade' | 'municipio';
  destinatario: string;
  cnpj?: string;
  municipio: string;
  gnd: string;
  pd: string;
  areaAtuacao: string;
  statusExecucao: 'planejamento' | 'em_execucao' | 'concluida' | 'cancelada';
  valor: number;
  dataDestinacao: string;
  prazoInicio: string;
  prazoFim: string;
  dataAlerta?: string;
  observacoes?: string;
  projetosAnexados?: string[];
}

const Emendas = () => {
  const [emendas, setEmendas] = useState<Emenda[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmenda, setSelectedEmenda] = useState<Emenda | null>(null);
  const [showDestinacao, setShowDestinacao] = useState(false);
  const [selectedDestinacao, setSelectedDestinacao] = useState<Destinacao | null>(null);
  const { toast } = useToast();

  // Load emendas from localStorage
  useEffect(() => {
    const savedEmendas = localStorage.getItem('emendas');
    if (savedEmendas) {
      const parsedEmendas = JSON.parse(savedEmendas);
      // Ensure all emendas have proper array initialization and calculate valorTotal
      const normalizedEmendas = parsedEmendas.map((emenda: any) => {
        const contrapartidas = emenda.contrapartidas || [];
        const valorContrapartidas = contrapartidas.reduce((sum: number, c: Contrapartida) => sum + c.valor, 0);
        return {
          ...emenda,
          contrapartidas,
          destinacoes: emenda.destinacoes || [],
          valorTotal: emenda.valor + valorContrapartidas
        };
      });
      setEmendas(normalizedEmendas);
    }
  }, []);

  // Save emendas to localStorage
  useEffect(() => {
    localStorage.setItem('emendas', JSON.stringify(emendas));
  }, [emendas]);

  // Check for alerts
  useEffect(() => {
    const checkAlerts = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      emendas.forEach(emenda => {
        emenda.destinacoes?.forEach(destinacao => {
          if (destinacao.dataAlerta) {
            const alertDate = new Date(destinacao.dataAlerta);
            alertDate.setHours(0, 0, 0, 0);
            
            if (alertDate.getTime() === today.getTime()) {
              toast({
                title: "Alerta de Destinação",
                description: `Prazo para ${destinacao.destinatario} - Emenda ${emenda.numero}/${emenda.ano}`,
                variant: "destructive",
              });
            }
          }
        });
      });
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(interval);
  }, [emendas, toast]);

  const calculateValorTotal = (valor: number, contrapartidas: Contrapartida[]) => {
    const valorContrapartidas = contrapartidas.reduce((sum, c) => sum + c.valor, 0);
    return valor + valorContrapartidas;
  };

  const handleSubmitEmenda = (emenda: Omit<Emenda, 'id' | 'dataCriacao' | 'valorTotal' | 'valorDestinado' | 'destinacoes'>) => {
    const valorTotal = calculateValorTotal(emenda.valor, emenda.contrapartidas);
    const newEmenda: Emenda = {
      ...emenda,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
      valorTotal,
      valorDestinado: 0,
      destinacoes: [],
      contrapartidas: emenda.contrapartidas || []
    };
    setEmendas(prev => [...prev, newEmenda]);
    setShowForm(false);
  };

  const handleEditEmenda = (emenda: Emenda) => {
    setSelectedEmenda(emenda);
    setShowForm(true);
  };

  const handleUpdateEmenda = (updatedEmenda: Omit<Emenda, 'id' | 'dataCriacao' | 'valorTotal' | 'valorDestinado' | 'destinacoes'>) => {
    if (selectedEmenda) {
      const valorTotal = calculateValorTotal(updatedEmenda.valor, updatedEmenda.contrapartidas);
      setEmendas(prev => prev.map(e => 
        e.id === selectedEmenda.id 
          ? { ...selectedEmenda, ...updatedEmenda, valorTotal }
          : e
      ));
      setSelectedEmenda(null);
      setShowForm(false);
    }
  };

  const handleDeleteEmenda = (id: string) => {
    setEmendas(prev => prev.filter(e => e.id !== id));
  };

  const handleDestinarEmenda = (emenda: Emenda) => {
    setSelectedEmenda(emenda);
    setSelectedDestinacao(null);
    setShowDestinacao(true);
  };

  const handleEditDestinacao = (emenda: Emenda, destinacao: Destinacao) => {
    setSelectedEmenda(emenda);
    setSelectedDestinacao(destinacao);
    setShowDestinacao(true);
  };

  const handleDeleteDestinacao = (emendaId: string, destinacaoId: string) => {
    setEmendas(prev => prev.map(e => {
      if (e.id === emendaId) {
        const novasDestinacoes = e.destinacoes.filter(d => d.id !== destinacaoId);
        const novoValorDestinado = novasDestinacoes.reduce((sum, d) => sum + d.valor, 0);
        
        return {
          ...e,
          destinacoes: novasDestinacoes,
          valorDestinado: novoValorDestinado
        };
      }
      return e;
    }));
  };

  const handleSubmitDestinacao = (destinacao: Omit<Destinacao, 'id' | 'emendaId' | 'dataDestinacao'>) => {
    if (selectedEmenda) {
      if (selectedDestinacao) {
        // Editando destinação existente
        setEmendas(prev => prev.map(e => {
          if (e.id === selectedEmenda.id) {
            const destinacoesAtualizadas = e.destinacoes.map(d => 
              d.id === selectedDestinacao.id 
                ? { ...d, ...destinacao }
                : d
            );
            const novoValorDestinado = destinacoesAtualizadas.reduce((sum, d) => sum + d.valor, 0);
            
            return {
              ...e,
              destinacoes: destinacoesAtualizadas,
              valorDestinado: novoValorDestinado
            };
          }
          return e;
        }));
      } else {
        // Criando nova destinação
        const newDestinacao: Destinacao = {
          ...destinacao,
          id: crypto.randomUUID(),
          emendaId: selectedEmenda.id,
          dataDestinacao: new Date().toISOString(),
          projetosAnexados: []
        };

        setEmendas(prev => prev.map(e => {
          if (e.id === selectedEmenda.id) {
            const novasDestinacoes = [...e.destinacoes, newDestinacao];
            const novoValorDestinado = novasDestinacoes.reduce((sum, d) => sum + d.valor, 0);
            
            return {
              ...e,
              destinacoes: novasDestinacoes,
              valorDestinado: novoValorDestinado
            };
          }
          return e;
        }));
      }

      setShowDestinacao(false);
      setSelectedEmenda(null);
      setSelectedDestinacao(null);
    }
  };

  // Calcular estatísticas
  const totalEmendas = emendas.length;
  const valorTotal = emendas.reduce((sum, e) => sum + e.valorTotal, 0);
  const valorDestinado = emendas.reduce((sum, e) => sum + e.valorDestinado, 0);
  const valorDisponivel = valorTotal - valorDestinado;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Emendas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmendas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total (+ Contrapartidas)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Destinado</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorDestinado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Disponível</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {valorDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Emendas Parlamentares</h1>
        <div className="flex gap-2">
          <ExportDialog emendas={emendas} />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Emenda
          </Button>
        </div>
      </div>

      {/* Lista de Emendas */}
      <EmendasList
        emendas={emendas}
        onEdit={handleEditEmenda}
        onDelete={handleDeleteEmenda}
        onDestinar={handleDestinarEmenda}
        onEditDestinacao={handleEditDestinacao}
        onDeleteDestinacao={handleDeleteDestinacao}
      />

      {/* Formulário de Emenda */}
      {showForm && (
        <EmendasForm
          emenda={selectedEmenda}
          onSubmit={selectedEmenda ? handleUpdateEmenda : handleSubmitEmenda}
          onCancel={() => {
            setShowForm(false);
            setSelectedEmenda(null);
          }}
        />
      )}

      {/* Dialog de Destinação */}
      {showDestinacao && selectedEmenda && (
        <DestinacaoDialog
          emenda={selectedEmenda}
          destinacao={selectedDestinacao}
          onSubmit={handleSubmitDestinacao}
          onCancel={() => {
            setShowDestinacao(false);
            setSelectedEmenda(null);
            setSelectedDestinacao(null);
          }}
        />
      )}
    </div>
  );
};

export default Emendas;

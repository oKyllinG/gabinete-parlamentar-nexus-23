import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Target, DollarSign, Calendar } from "lucide-react";
import { EmendasForm } from "@/components/emendas/EmendasForm";
import { EmendasList } from "@/components/emendas/EmendasList";
import { DestinacaoDialog } from "@/components/emendas/DestinacaoDialog";
import { ExportDialog } from "@/components/emendas/ExportDialog";

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
  valorDestinado: number;
  contrapartidas: Contrapartida[];
  prazoExecucao: string;
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
  observacoes?: string;
}

const Emendas = () => {
  const [emendas, setEmendas] = useState<Emenda[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmenda, setSelectedEmenda] = useState<Emenda | null>(null);
  const [showDestinacao, setShowDestinacao] = useState(false);
  const [selectedDestinacao, setSelectedDestinacao] = useState<Destinacao | null>(null);

  // Load emendas from localStorage
  useEffect(() => {
    const savedEmendas = localStorage.getItem('emendas');
    if (savedEmendas) {
      const parsedEmendas = JSON.parse(savedEmendas);
      // Ensure all emendas have proper array initialization
      const normalizedEmendas = parsedEmendas.map((emenda: any) => ({
        ...emenda,
        contrapartidas: emenda.contrapartidas || [],
        destinacoes: emenda.destinacoes || []
      }));
      setEmendas(normalizedEmendas);
    }
  }, []);

  // Save emendas to localStorage
  useEffect(() => {
    localStorage.setItem('emendas', JSON.stringify(emendas));
  }, [emendas]);

  const handleSubmitEmenda = (emenda: Omit<Emenda, 'id' | 'dataCriacao' | 'valorDestinado' | 'destinacoes'>) => {
    const newEmenda: Emenda = {
      ...emenda,
      id: crypto.randomUUID(),
      dataCriacao: new Date().toISOString(),
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

  const handleUpdateEmenda = (updatedEmenda: Omit<Emenda, 'id' | 'dataCriacao' | 'valorDestinado' | 'destinacoes'>) => {
    if (selectedEmenda) {
      setEmendas(prev => prev.map(e => 
        e.id === selectedEmenda.id 
          ? { ...selectedEmenda, ...updatedEmenda }
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
          dataDestinacao: new Date().toISOString()
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
  const valorTotal = emendas.reduce((sum, e) => sum + e.valor, 0);
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
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
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


import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Emenda, Contrapartida } from "@/pages/Emendas";

interface EmendasFormProps {
  emenda?: Emenda | null;
  onSubmit: (emenda: Omit<Emenda, 'id' | 'dataCriacao' | 'valorDestinado' | 'destinacoes'>) => void;
  onCancel: () => void;
}

export const EmendasForm: React.FC<EmendasFormProps> = ({ emenda, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    numero: '',
    ano: new Date().getFullYear().toString(),
    tipo: 'individual' as 'individual' | 'bancada' | 'comissao',
    autor: '',
    orgao: '',
    programa: '',
    acao: '',
    localizador: '',
    valor: 0,
    prazoExecucao: '',
    objeto: '',
    justificativa: '',
    observacoes: '',
    contrapartidas: [] as Contrapartida[]
  });

  useEffect(() => {
    if (emenda) {
      setFormData({
        numero: emenda.numero,
        ano: emenda.ano,
        tipo: emenda.tipo,
        autor: emenda.autor,
        orgao: emenda.orgao,
        programa: emenda.programa,
        acao: emenda.acao,
        localizador: emenda.localizador,
        valor: emenda.valor,
        prazoExecucao: emenda.prazoExecucao,
        objeto: emenda.objeto,
        justificativa: emenda.justificativa,
        observacoes: emenda.observacoes || '',
        contrapartidas: emenda.contrapartidas || []
      });
    }
  }, [emenda]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      contrapartidas: formData.contrapartidas
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addContrapartida = () => {
    const newContrapartida: Contrapartida = {
      id: crypto.randomUUID(),
      ente: '',
      valor: 0
    };
    setFormData(prev => ({
      ...prev,
      contrapartidas: [...prev.contrapartidas, newContrapartida]
    }));
  };

  const updateContrapartida = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      contrapartidas: prev.contrapartidas.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeContrapartida = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contrapartidas: prev.contrapartidas.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{emenda ? 'Editar Emenda' : 'Nova Emenda'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => handleInputChange('numero', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ano">Ano</Label>
                  <Input
                    id="ano"
                    value={formData.ano}
                    onChange={(e) => handleInputChange('ano', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="bancada">Bancada</SelectItem>
                      <SelectItem value="comissao">Comissão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="autor">Autor</Label>
                  <Input
                    id="autor"
                    value={formData.autor}
                    onChange={(e) => handleInputChange('autor', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="orgao">Órgão</Label>
                  <Input
                    id="orgao"
                    value={formData.orgao}
                    onChange={(e) => handleInputChange('orgao', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Programa e Localização */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Programa e Localização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="programa">Programa</Label>
                  <Input
                    id="programa"
                    value={formData.programa}
                    onChange={(e) => handleInputChange('programa', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="acao">Ação</Label>
                  <Input
                    id="acao"
                    value={formData.acao}
                    onChange={(e) => handleInputChange('acao', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="localizador">Localizador</Label>
                <Input
                  id="localizador"
                  value={formData.localizador}
                  onChange={(e) => handleInputChange('localizador', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Valor e Prazo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Valor e Prazo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor">Valor (R$)</Label>
                  <Input
                    id="valor"
                    type="number"
                    step="0.01"
                    value={formData.valor}
                    onChange={(e) => handleInputChange('valor', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prazoExecucao">Prazo de Execução</Label>
                  <Input
                    id="prazoExecucao"
                    value={formData.prazoExecucao}
                    onChange={(e) => handleInputChange('prazoExecucao', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contrapartidas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Contrapartidas
                <Button type="button" size="sm" onClick={addContrapartida}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.contrapartidas.map((contrapartida, index) => (
                <div key={contrapartida.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Contrapartida {index + 1}</h4>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeContrapartida(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Ente</Label>
                      <Input
                        value={contrapartida.ente}
                        onChange={(e) => updateContrapartida(index, 'ente', e.target.value)}
                        placeholder="Ex: Governo Federal, Governo Estadual..."
                        required
                      />
                    </div>
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={contrapartida.valor}
                        onChange={(e) => updateContrapartida(index, 'valor', parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.contrapartidas.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma contrapartida adicionada. Clique em "Adicionar" para incluir contrapartidas.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Descrição */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Descrição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="objeto">Objeto</Label>
                <Textarea
                  id="objeto"
                  value={formData.objeto}
                  onChange={(e) => handleInputChange('objeto', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="justificativa">Justificativa</Label>
                <Textarea
                  id="justificativa"
                  value={formData.justificativa}
                  onChange={(e) => handleInputChange('justificativa', e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {emenda ? 'Atualizar' : 'Criar'} Emenda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

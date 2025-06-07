
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Emenda, Contrapartida } from "@/pages/Emendas";

const emendaSchema = z.object({
  numero: z.string().min(1, 'Número é obrigatório'),
  ano: z.string().min(4, 'Ano deve ter 4 dígitos'),
  tipo: z.enum(['individual', 'bancada', 'comissao']),
  autor: z.string().min(1, 'Autor é obrigatório'),
  orgao: z.string().min(1, 'Órgão é obrigatório'),
  programa: z.string().min(1, 'Programa é obrigatório'),
  acao: z.string().min(1, 'Ação é obrigatória'),
  localizador: z.string().min(1, 'Localizador é obrigatório'),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  prazoExecucao: z.string().min(1, 'Prazo de execução é obrigatório'),
  objeto: z.string().min(1, 'Objeto é obrigatório'),
  justificativa: z.string().min(1, 'Justificativa é obrigatória'),
  observacoes: z.string().optional(),
  status: z.enum(['cadastrada', 'em_execucao', 'executada', 'vencida'])
});

type EmendasFormData = z.infer<typeof emendaSchema>;

interface EmendasFormProps {
  emenda?: Emenda | null;
  onSubmit: (data: Omit<Emenda, 'id' | 'dataCriacao' | 'valorDestinado' | 'destinacoes'>) => void;
  onCancel: () => void;
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

export const EmendasForm: React.FC<EmendasFormProps> = ({ emenda, onSubmit, onCancel }) => {
  const [contrapartidas, setContrapartidas] = useState<Contrapartida[]>(
    emenda?.contrapartidas || []
  );

  const form = useForm<EmendasFormData>({
    resolver: zodResolver(emendaSchema),
    defaultValues: {
      numero: emenda?.numero || '',
      ano: emenda?.ano || new Date().getFullYear().toString(),
      tipo: emenda?.tipo || 'individual',
      autor: emenda?.autor || '',
      orgao: emenda?.orgao || '',
      programa: emenda?.programa || '',
      acao: emenda?.acao || '',
      localizador: emenda?.localizador || '',
      valor: emenda?.valor || 0,
      prazoExecucao: emenda?.prazoExecucao || '',
      objeto: emenda?.objeto || '',
      justificativa: emenda?.justificativa || '',
      observacoes: emenda?.observacoes || '',
      status: emenda?.status || 'cadastrada'
    }
  });

  const handleSubmit = (data: EmendasFormData) => {
    const emendaData: Omit<Emenda, 'id' | 'dataCriacao' | 'valorDestinado' | 'destinacoes'> = {
      numero: data.numero,
      ano: data.ano,
      tipo: data.tipo,
      autor: data.autor,
      orgao: data.orgao,
      programa: data.programa,
      acao: data.acao,
      localizador: data.localizador,
      valor: data.valor,
      contrapartidas: contrapartidas,
      prazoExecucao: data.prazoExecucao,
      objeto: data.objeto,
      justificativa: data.justificativa,
      observacoes: data.observacoes,
      status: data.status
    };
    onSubmit(emendaData);
  };

  const adicionarContrapartida = () => {
    setContrapartidas(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ente: '',
        valor: 0
      }
    ]);
  };

  const removerContrapartida = (id: string) => {
    setContrapartidas(prev => prev.filter(c => c.id !== id));
  };

  const atualizarContrapartida = (id: string, field: keyof Contrapartida, value: string | number) => {
    setContrapartidas(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {emenda ? 'Editar Emenda' : 'Nova Emenda Parlamentar'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Identificação */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identificação da Emenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da Emenda *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ano *</FormLabel>
                        <FormControl>
                          <Input placeholder="2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(tipoLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="autor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Autor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do deputado/senador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orgao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Órgão *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Ministério da Saúde" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Detalhes Orçamentários */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes Orçamentários</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="programa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programa *</FormLabel>
                        <FormControl>
                          <Input placeholder="Código do programa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ação *</FormLabel>
                        <FormControl>
                          <Input placeholder="Código da ação" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="localizador"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localizador *</FormLabel>
                        <FormControl>
                          <Input placeholder="Código do localizador" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0,00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="prazoExecucao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prazo de Execução *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 31/12/2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contrapartidas */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Contrapartidas</CardTitle>
                  <Button type="button" onClick={adicionarContrapartida} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {contrapartidas.map((contrapartida) => (
                  <div key={contrapartida.id} className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Ente</label>
                      <Input
                        placeholder="Ex: Governo Federal"
                        value={contrapartida.ente}
                        onChange={(e) => atualizarContrapartida(contrapartida.id, 'ente', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Valor (R$)</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={contrapartida.valor}
                        onChange={(e) => atualizarContrapartida(contrapartida.id, 'valor', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerContrapartida(contrapartida.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {contrapartidas.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma contrapartida adicionada
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição da Emenda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="objeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objeto *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descrição do objeto da emenda"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="justificativa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Justificativa *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Justificativa da emenda"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observações adicionais (opcional)"
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {emenda ? 'Atualizar' : 'Cadastrar'} Emenda
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Emenda, Destinacao } from "@/pages/Emendas";

const destinacaoSchema = z.object({
  tipo: z.enum(['entidade', 'municipio']),
  destinatario: z.string().min(1, 'Destinatário é obrigatório'),
  cnpj: z.string().optional(),
  valor: z.number().min(0.01, 'Valor deve ser maior que zero'),
  observacoes: z.string().optional()
});

type DestinacaoFormData = z.infer<typeof destinacaoSchema>;

interface DestinacaoDialogProps {
  emenda: Emenda;
  onSubmit: (data: Omit<Destinacao, 'id' | 'emendaId' | 'dataDestinacao'>) => void;
  onCancel: () => void;
}

const tipoLabels = {
  entidade: 'Entidade',
  municipio: 'Município'
};

export const DestinacaoDialog: React.FC<DestinacaoDialogProps> = ({ 
  emenda, 
  onSubmit, 
  onCancel 
}) => {
  const valorDisponivel = emenda.valor - emenda.valorDestinado;

  const form = useForm<DestinacaoFormData>({
    resolver: zodResolver(destinacaoSchema.refine((data) => {
      return data.valor <= valorDisponivel;
    }, {
      message: `Valor não pode ser maior que o disponível (${valorDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`,
      path: ['valor']
    })),
    defaultValues: {
      tipo: 'entidade',
      destinatario: '',
      cnpj: '',
      valor: 0,
      observacoes: ''
    }
  });

  const handleSubmit = (data: DestinacaoFormData) => {
    onSubmit(data);
  };

  const watchedTipo = form.watch('tipo');

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Destinar Emenda</DialogTitle>
        </DialogHeader>

        {/* Informações da Emenda */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Emenda:</span>
            <span className="text-sm">{emenda.numero}/{emenda.ano}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Valor Total:</span>
            <span className="text-sm">
              {emenda.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Já Destinado:</span>
            <span className="text-sm">
              {emenda.valorDestinado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-sm font-medium">Disponível:</span>
            <Badge variant="secondary">
              {valorDisponivel.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Badge>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Destinatário *</FormLabel>
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

            <FormField
              control={form.control}
              name="destinatario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {watchedTipo === 'municipio' ? 'Nome do Município' : 'Nome da Entidade'} *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={
                        watchedTipo === 'municipio' 
                          ? "Ex: Prefeitura de São Paulo" 
                          : "Ex: Associação Beneficente XYZ"
                      } 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00" 
                      {...field} 
                    />
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
                  <FormLabel>Valor da Destinação (R$) *</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="0,00" 
                      max={valorDisponivel}
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
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações sobre a destinação (opcional)"
                      className="min-h-[60px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                Confirmar Destinação
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

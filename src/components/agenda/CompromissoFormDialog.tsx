
import { useAgenda } from "@/contexts/AgendaContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";
import { CalendarIcon, Paperclip } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ParticipantesInput } from "./ParticipantesInput";

// Simulação dos contatos cadastrados (real: importar de contexto de contatos)
const useContatosList = () =>
  [
    { id: "1", nome: "Maria Silva" },
    { id: "2", nome: "João Souza" },
    { id: "3", nome: "Ana Martins" },
  ];

const compromissoSchema = z.object({
  titulo: z.string().min(3, { message: "Título deve ter no mínimo 3 caracteres." }),
  data: z.date({ required_error: "Selecione uma data." }),
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  categoria: z.string().optional(),
  local: z.string().optional(),
  endereco: z.string().optional(),
  participantes: z.array(z.object({ id: z.string(), nome: z.string() })),
  descricao: z.string().optional(),
  anexo: z.any().optional(),
});

type CompromissoFormValues = z.infer<typeof compromissoSchema>;

export function CompromissoFormDialog() {
  const {
    isFormOpen,
    setFormOpen,
    editingCompromisso,
    setEditingCompromisso,
    addCompromisso,
    updateCompromisso,
  } = useAgenda();
  const { toast } = useToast();
  const contatosList = useContatosList();

  const form = useForm<CompromissoFormValues>({
    resolver: zodResolver(compromissoSchema),
    defaultValues: {
      titulo: "",
      data: new Date(),
      horaInicio: "",
      categoria: "",
      local: "",
      endereco: "",
      participantes: [],
      descricao: "",
      anexo: null,
    },
  });

  useEffect(() => {
    if (isFormOpen) {
      if (editingCompromisso) {
        // para compatibilidade, converter string -> Date
        const dateObj = new Date(editingCompromisso.data);
        form.reset({
          ...editingCompromisso,
          data: isValid(dateObj) ? dateObj : new Date(),
          participantes: editingCompromisso.participantes || [],
        });
      } else {
        form.reset({
          titulo: "",
          data: new Date(),
          horaInicio: "",
          categoria: "",
          local: "",
          endereco: "",
          participantes: [],
          descricao: "",
          anexo: null,
        });
      }
    }
  }, [editingCompromisso, isFormOpen, form]);

  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) setEditingCompromisso(null);
  };

  const onSubmit = (values: CompromissoFormValues) => {
    const compromissoData = {
      titulo: values.titulo,
      data: values.data.toISOString(),
      horaInicio: values.horaInicio,
      categoria: values.categoria,
      local: values.local,
      endereco: values.endereco,
      participantes: values.participantes,
      descricao: values.descricao,
      // anexo ignorado por enquanto
    };

    if (editingCompromisso) {
      updateCompromisso({ ...editingCompromisso, ...compromissoData });
      toast({ title: "Compromisso atualizado com sucesso!" });
    } else {
      addCompromisso(compromissoData);
      toast({ title: "Compromisso agendado com sucesso!" });
    }
    handleOpenChange(false);
  };

  return (
    <Dialog open={isFormOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Nova Reunião
          </DialogTitle>
          <DialogDescription>
            Agende uma nova reunião ou compromisso
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
          >
            {/* Data + Hora (lado a lado) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value
                              ? format(field.value, "dd 'de' MMMM 'de' yyyy")
                              : <span>Escolha a data</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Categoria */}
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <FormControl>
                    <select
                      className="w-full border rounded px-3 py-2 text-base bg-gray-50"
                      {...field}
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="Reunião">Reunião</option>
                      <option value="Audiência">Audiência</option>
                      <option value="Visita">Visita</option>
                      <option value="Evento">Evento</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Local */}
            <FormField
              control={form.control}
              name="local"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local</FormLabel>
                  <FormControl>
                    <Input placeholder="Gabinete, Plenário..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Endereço completo */}
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço Completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Av. Paulista, 1000 - São Paulo, SP"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Participantes */}
            <FormField
              control={form.control}
              name="participantes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participantes</FormLabel>
                  <ParticipantesInput
                    value={field.value}
                    onChange={field.onChange}
                    allContacts={contatosList}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Pauta/Assunto (descrição) */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pauta/Assunto</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes do compromisso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Anexos (visual) */}
            <div>
              <span className="font-medium flex gap-2 items-center">
                <Paperclip className="w-4 h-4" /> Anexos
              </span>
              <div className="bg-gray-50 p-3 rounded flex justify-between mt-2 items-center">
                <span className="text-sm text-muted-foreground">Adicionar Anexo</span>
                <Button type="button" variant="outline" className="gap-1">
                  <Paperclip className="w-4 h-4" /> Adicionar Anexo
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                Agendar Reunião
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}



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
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format, parse, isValid } from "date-fns";

const compromissoSchema = z.object({
  titulo: z.string().min(3, { message: "Título deve ter no mínimo 3 caracteres." }),
  data: z.string().nonempty({ message: "Data é obrigatória." }),
  horaInicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  horaFim: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Formato de hora inválido (HH:MM)." }),
  local: z.string().optional(),
  descricao: z.string().optional(),
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

  const form = useForm<CompromissoFormValues>({
    resolver: zodResolver(compromissoSchema),
    defaultValues: {
      titulo: "",
      data: "",
      horaInicio: "",
      horaFim: "",
      local: "",
      descricao: "",
    },
  });

  useEffect(() => {
    if (isFormOpen) {
        if (editingCompromisso) {
            const date = parse(editingCompromisso.data, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", new Date());
            form.reset({
                ...editingCompromisso,
                data: isValid(date) ? format(date, 'yyyy-MM-dd') : ''
            });
        } else {
            form.reset({
                titulo: "",
                data: format(new Date(), 'yyyy-MM-dd'),
                horaInicio: "",
                horaFim: "",
                local: "",
                descricao: "",
            });
        }
    }
  }, [editingCompromisso, isFormOpen, form]);
  
  const handleOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setEditingCompromisso(null);
    }
  };

  const onSubmit = (values: CompromissoFormValues) => {
    // Combine date and time correctly, avoiding timezone issues
    const dataISO = new Date(values.data).toISOString();
    const compromissoData = { ...values, data: dataISO };
    
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCompromisso ? "Editar Compromisso" : "Novo Compromisso"}</DialogTitle>
          <DialogDescription>
            {editingCompromisso ? "Altere as informações do seu compromisso." : "Preencha os detalhes para agendar um novo compromisso."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Reunião com..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horaFim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes do compromisso..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

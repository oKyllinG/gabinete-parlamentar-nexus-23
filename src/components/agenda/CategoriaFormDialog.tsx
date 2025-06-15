
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { CategoriaAgenda } from "@/types/agenda";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";

const corPadroes = [
  "#4267F1", "#20BA38", "#F7B401", "#7E37D8", "#EC58B9", "#23CEF4"
];

interface CategoriaFormDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  categoria?: CategoriaAgenda | null;
  onSubmit: (c: Omit<CategoriaAgenda, "id">) => void;
}

export default function CategoriaFormDialog({ open, onOpenChange, categoria, onSubmit }: CategoriaFormDialogProps) {
  const { register, setValue, handleSubmit, reset } = useForm<Omit<CategoriaAgenda, "id">>({
    defaultValues: {
      nome: "",
      cor: corPadroes[0],
      slug: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (categoria) {
        reset({ nome: categoria.nome, cor: categoria.cor, slug: categoria.slug });
      } else {
        reset({ nome: "", cor: corPadroes[0], slug: "" });
      }
    }
  }, [open, categoria, reset]);

  function gerarSlug(nome: string) {
    return nome
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "_")
      .replace(/[^\w_]+/g, "");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{categoria ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((values) => {
            onSubmit({ ...values, slug: gerarSlug(values.nome) });
          })}
          className="flex flex-col gap-4"
        >
          <div>
            <FormLabel>Nome</FormLabel>
            <Input {...register("nome", { required: true })}
              placeholder="Digite o nome da categoria" autoFocus />
          </div>
          <div>
            <FormLabel>Cor</FormLabel>
            <div className="flex gap-2 mt-1">
              {corPadroes.map((cor) => (
                <button
                  type="button"
                  key={cor}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${cor === categoria?.cor ? "border-black" : "border-gray-200"}`}
                  style={{ background: cor }}
                  onClick={() => setValue("cor", cor)}
                />
              ))}
              <Input type="color" {...register("cor")} className="w-10 h-7 p-0 border-0 bg-transparent" />
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3 mt-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">{categoria ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

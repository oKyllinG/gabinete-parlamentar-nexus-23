
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAgendaCategorias } from "@/contexts/AgendaCategoriasContext";
import { CategoriaAgenda } from "@/types/agenda";

interface SimpleCategoriaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoria?: CategoriaAgenda | null;
}

const cores = [
  "#4851EC", "#22C55E", "#EF4444", "#F59E0B", 
  "#8B5CF6", "#06B6D4", "#EC4899", "#10B981"
];

export function SimpleCategoriaFormDialog({ 
  open, 
  onOpenChange, 
  categoria 
}: SimpleCategoriaFormDialogProps) {
  const { addCategoria, updateCategoria } = useAgendaCategorias();
  const [nome, setNome] = useState("");
  const [corSelecionada, setCorSelecionada] = useState(cores[0]);
  const [errors, setErrors] = useState<{ nome?: string }>({});

  useEffect(() => {
    if (open) {
      if (categoria) {
        setNome(categoria.nome);
        setCorSelecionada(categoria.cor);
      } else {
        setNome("");
        setCorSelecionada(cores[0]);
      }
      setErrors({});
    }
  }, [open, categoria]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação simples
    if (!nome.trim()) {
      setErrors({ nome: "Nome é obrigatório" });
      return;
    }

    const slug = nome.toLowerCase().replace(/\s+/g, "-");
    
    if (categoria) {
      updateCategoria({
        ...categoria,
        nome: nome.trim(),
        cor: corSelecionada,
        slug
      });
    } else {
      addCategoria({
        nome: nome.trim(),
        cor: corSelecionada,
        slug
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {categoria ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome da Categoria</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Reunião, Audiência..."
              className={errors.nome ? "border-red-500" : ""}
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Cor da Categoria</Label>
            <div className="grid grid-cols-4 gap-2">
              {cores.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => setCorSelecionada(cor)}
                  className={`w-12 h-12 rounded-full border-2 ${
                    corSelecionada === cor 
                      ? "border-gray-800 ring-2 ring-gray-300" 
                      : "border-gray-200"
                  }`}
                  style={{ backgroundColor: cor }}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {categoria ? "Atualizar" : "Criar"} Categoria
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

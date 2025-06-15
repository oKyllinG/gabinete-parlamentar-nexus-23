
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAgendaCategorias } from "@/contexts/AgendaCategoriasContext";
import CategoriaListItem from "./CategoriaListItem";
import CategoriaLegenda from "./CategoriaLegenda";
import { SimpleCategoriaFormDialog } from "./SimpleCategoriaFormDialog";
import { CategoriaAgenda } from "@/types/agenda";

export default function AgendaCategoriasManager() {
  const { categorias, removeCategoria } = useAgendaCategorias();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaAgenda | null>(null);

  const handleEdit = (categoria: CategoriaAgenda) => {
    setEditingCategoria(categoria);
    setIsDialogOpen(true);
  };

  const handleDelete = (categoriaId: string) => {
    removeCategoria(categoriaId);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategoria(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Categorias Cadastradas</h2>
          {categorias.length === 0 ? (
            <div className="bg-white border rounded-xl p-6 text-center text-gray-500">
              <p>Nenhuma categoria cadastrada ainda.</p>
              <p className="text-sm mt-1">Clique em "Nova Categoria" para começar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {categorias.map((categoria) => (
                <CategoriaListItem
                  key={categoria.id}
                  categoria={categoria}
                  onEdit={handleEdit}
                  onDelete={() => handleDelete(categoria.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <CategoriaLegenda categorias={categorias} />
        </div>
      </div>

      <SimpleCategoriaFormDialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
        categoria={editingCategoria}
      />
    </div>
  );
}

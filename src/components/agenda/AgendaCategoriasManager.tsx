
import { useState } from "react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { useAgendaCategorias } from "@/contexts/AgendaCategoriasContext";
import { CategoriaAgenda } from "@/types/agenda";
import CategoriaFormDialog from "./CategoriaFormDialog";
import CategoriaListItem from "./CategoriaListItem";
import CategoriaLegenda from "./CategoriaLegenda";

export default function AgendaCategoriasManager() {
  const [openForm, setOpenForm] = useState(false);
  const [editCategoria, setEditCategoria] = useState<CategoriaAgenda | null>(null);
  const { categorias, addCategoria, updateCategoria, removeCategoria } = useAgendaCategorias();

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-[#f6fbfd] p-4 rounded-xl border justify-between">
      <div className="bg-white border p-4 rounded-xl flex-1 max-w-xl">
        <div className="flex items-center gap-2 mb-3">
          <Tag className="text-gray-500" />
          <span className="text-lg font-semibold">Categorias</span>
          <button type="button"
            className="ml-auto flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-md border border-blue-200 text-blue-800 font-medium text-sm hover:bg-blue-100 transition"
            onClick={() => { setEditCategoria(null); setOpenForm(true); }}>
            <Plus className="w-4 h-4" />
            Nova
          </button>
        </div>
        <div className="space-y-2">
          {categorias.map(categoria => (
            <CategoriaListItem
              key={categoria.id}
              categoria={categoria}
              onEdit={() => { setEditCategoria(categoria); setOpenForm(true); }}
              onDelete={() => removeCategoria(categoria.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 max-w-lg">
        <CategoriaLegenda categorias={categorias} />
      </div>
      {openForm && (
        <CategoriaFormDialog
          open={openForm}
          onOpenChange={setOpenForm}
          categoria={editCategoria}
          onSubmit={(cat) => {
            if (editCategoria) updateCategoria({ ...editCategoria, ...cat });
            else addCategoria(cat);
            setOpenForm(false);
          }}
        />
      )}
    </div>
  );
}

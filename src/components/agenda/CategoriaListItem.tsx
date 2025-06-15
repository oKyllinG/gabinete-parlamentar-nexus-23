
import { Edit, Trash2 } from "lucide-react";
import { CategoriaAgenda } from "@/types/agenda";

interface CategoriaListItemProps {
  categoria: CategoriaAgenda;
  onEdit: (categoria: CategoriaAgenda) => void;
  onDelete: () => void;
}

const colorCircle = (color: string) => (
  <span className="inline-block w-3.5 h-3.5 rounded-full mr-3" style={{ background: color }} />
);

export default function CategoriaListItem({ categoria, onEdit, onDelete }: CategoriaListItemProps) {
  return (
    <div className="flex items-center bg-white border border-gray-200 rounded px-4 py-2 shadow-sm">
      {colorCircle(categoria.cor)}
      <span className="flex-1 text-base">{categoria.nome}</span>
      <button type="button" onClick={() => onEdit(categoria)} className="p-2 hover:bg-blue-50 rounded" title="Editar">
        <Edit className="w-4 h-4 text-gray-500" />
      </button>
      <button type="button" onClick={onDelete} className="p-2 ml-1 hover:bg-red-100 rounded" title="Excluir">
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>
    </div>
  );
}

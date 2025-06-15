
import { CategoriaAgenda } from "@/types/agenda";
import { Button } from "@/components/ui/button";

interface CategoriaLegendaProps {
  categorias: CategoriaAgenda[];
}
const colorCircle = (color: string) => (
  <span className="inline-block w-3 h-3 rounded-full mr-3 mt-0.5" style={{ background: color }} />
);

export default function CategoriaLegenda({ categorias }: CategoriaLegendaProps) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <h2 className="text-base font-semibold mb-1">Legenda da Agenda</h2>
      <div className="text-gray-500 text-xs mb-3">
        As cores abaixo são usadas para identificar categorias no calendário.
      </div>
      <div className="space-y-2 mb-4">
        {categorias.map(cat => (
          <div className="flex items-center" key={cat.id}>
            {colorCircle(cat.cor)}
            <div className="flex-1">
              <span className="text-sm font-medium">{cat.nome}</span><br />
              <span className="text-xs text-gray-400">{cat.slug}</span>
            </div>
            <Button variant="outline" size="sm" className="ml-2 px-4 py-0 h-7">Visualizar</Button>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 text-blue-800 border-l-4 border-blue-400 px-4 py-2 mt-3 rounded relative">
        <strong className="block mb-1 text-blue-900">Como funciona</strong>
        <span className="text-xs">
          Novas categorias adicionadas aparecerão automaticamente na legenda e no calendário. As cores ajudam a identificar rapidamente o tipo de compromisso.
        </span>
      </div>
    </div>
  );
}

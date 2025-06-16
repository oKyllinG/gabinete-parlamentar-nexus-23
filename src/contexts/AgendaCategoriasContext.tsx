
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CategoriaAgenda } from "@/types/agenda";

// Categorias fixas que não podem ser excluídas
const FIXED_CATEGORIAS: CategoriaAgenda[] = [
  { id: "fixed-1", nome: "Reunião com gestores", cor: "#4267F1", slug: "reuniao_com_gestores" },
  { id: "fixed-2", nome: "Convite", cor: "#23CEF4", slug: "convite" },
  { id: "fixed-3", nome: "Viagem", cor: "#EC58B9", slug: "viagem" },
];

// Categorias padrão (podem ser excluídas)
const DEFAULT_CATEGORIAS: CategoriaAgenda[] = [
  { id: "2", nome: "Eventos", cor: "#20BA38", slug: "eventos" },
  { id: "3", nome: "Atendimento ao cidadão", cor: "#F7B401", slug: "atendimento_ao_cidadao" },
  { id: "4", nome: "Articulação política", cor: "#7E37D8", slug: "articulacao_politica" },
];

interface AgendaCategoriasContextType {
  categorias: CategoriaAgenda[];
  addCategoria: (cat: Omit<CategoriaAgenda, "id">) => void;
  updateCategoria: (cat: CategoriaAgenda) => void;
  removeCategoria: (id: string) => void;
  isFixedCategoria: (id: string) => boolean;
}

const AgendaCategoriasContext = createContext<AgendaCategoriasContextType | undefined>(undefined);

export function AgendaCategoriasProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<CategoriaAgenda[]>(() => {
    const saved = localStorage.getItem("agenda_categorias");
    const savedCategorias = saved ? JSON.parse(saved) : DEFAULT_CATEGORIAS;
    
    // Sempre incluir as categorias fixas
    const allCategorias = [...FIXED_CATEGORIAS, ...savedCategorias];
    
    // Remover duplicatas baseado no slug
    const uniqueCategorias = allCategorias.filter((cat, index, self) => 
      index === self.findIndex(c => c.slug === cat.slug)
    );
    
    return uniqueCategorias;
  });

  useEffect(() => {
    // Salvar apenas as categorias não fixas
    const nonFixedCategorias = categorias.filter(cat => !isFixedCategoria(cat.id));
    localStorage.setItem("agenda_categorias", JSON.stringify(nonFixedCategorias));
  }, [categorias]);

  function isFixedCategoria(id: string): boolean {
    return FIXED_CATEGORIAS.some(cat => cat.id === id);
  }

  function addCategoria(cat: Omit<CategoriaAgenda, "id">) {
    const exists = categorias.some(c => c.slug === cat.slug);
    if (exists) return;
    setCategorias([
      ...categorias,
      { ...cat, id: crypto.randomUUID() }
    ]);
  }

  function updateCategoria(cat: CategoriaAgenda) {
    // Não permitir edição de categorias fixas
    if (isFixedCategoria(cat.id)) return;
    setCategorias(categorias.map(c => (c.id === cat.id ? cat : c)));
  }

  function removeCategoria(id: string) {
    // Não permitir remoção de categorias fixas
    if (isFixedCategoria(id)) return;
    setCategorias(categorias.filter(c => c.id !== id));
  }

  return (
    <AgendaCategoriasContext.Provider value={{ 
      categorias, 
      addCategoria, 
      updateCategoria, 
      removeCategoria,
      isFixedCategoria 
    }}>
      {children}
    </AgendaCategoriasContext.Provider>
  );
}

export function useAgendaCategorias() {
  const ctx = useContext(AgendaCategoriasContext);
  if (!ctx) throw new Error("useAgendaCategorias deve ser usado dentro do AgendaCategoriasProvider");
  return ctx;
}

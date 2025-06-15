
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CategoriaAgenda } from "@/types/agenda";

// Categorias padrão 
const DEFAULT_CATEGORIAS: CategoriaAgenda[] = [
  { id: "1", nome: "Reuniões com gestores", cor: "#4267F1", slug: "reuniao_com_gestores" },
  { id: "2", nome: "Eventos", cor: "#20BA38", slug: "eventos" },
  { id: "3", nome: "Atendimento ao cidadão", cor: "#F7B401", slug: "atendimento_ao_cidadao" },
  { id: "4", nome: "Articulação política", cor: "#7E37D8", slug: "articulacao_politica" },
  { id: "5", nome: "Viagem", cor: "#EC58B9", slug: "viagem" },
  { id: "6", nome: "Convite", cor: "#23CEF4", slug: "convite" },
];

interface AgendaCategoriasContextType {
  categorias: CategoriaAgenda[];
  addCategoria: (cat: Omit<CategoriaAgenda, "id">) => void;
  updateCategoria: (cat: CategoriaAgenda) => void;
  removeCategoria: (id: string) => void;
}

const AgendaCategoriasContext = createContext<AgendaCategoriasContextType | undefined>(undefined);

export function AgendaCategoriasProvider({ children }: { children: ReactNode }) {
  const [categorias, setCategorias] = useState<CategoriaAgenda[]>(() => {
    const saved = localStorage.getItem("agenda_categorias");
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIAS;
  });

  useEffect(() => {
    localStorage.setItem("agenda_categorias", JSON.stringify(categorias));
  }, [categorias]);

  function addCategoria(cat: Omit<CategoriaAgenda, "id">) {
    const exists = categorias.some(c => c.slug === cat.slug);
    if (exists) return;
    setCategorias([
      ...categorias,
      { ...cat, id: crypto.randomUUID() }
    ]);
  }

  function updateCategoria(cat: CategoriaAgenda) {
    setCategorias(categorias.map(c => (c.id === cat.id ? cat : c)));
  }

  function removeCategoria(id: string) {
    setCategorias(categorias.filter(c => c.id !== id));
  }

  return (
    <AgendaCategoriasContext.Provider value={{ categorias, addCategoria, updateCategoria, removeCategoria }}>
      {children}
    </AgendaCategoriasContext.Provider>
  );
}

export function useAgendaCategorias() {
  const ctx = useContext(AgendaCategoriasContext);
  if (!ctx) throw new Error("useAgendaCategorias deve ser usado dentro do AgendaCategoriasProvider");
  return ctx;
}

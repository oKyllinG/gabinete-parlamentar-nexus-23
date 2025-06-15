import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { Compromisso, StatusCompromisso } from "@/types/agenda";
import { parseISO, startOfDay } from "date-fns";

// Demo data for initial load
const demoCompromissos: Compromisso[] = [
  {
    id: "1",
    titulo: "Reunião com Prefeito de Nova Cidade",
    data: new Date().toISOString(),
    horaInicio: "10:00",
    local: "Prefeitura de Nova Cidade",
    descricao: "Discutir projetos de infraestrutura.",
    status: "PENDENTE",
  },
  {
    id: "2",
    titulo: "Almoço com lideranças",
    data: new Date().toISOString(),
    horaInicio: "12:30",
    local: "Restaurante Central",
    descricao: "Alinhamento político.",
    status: "PENDENTE",
  },
  {
    id: "3",
    titulo: "Sessão na Assembleia",
    data: new Date().toISOString(),
    horaInicio: "15:00",
    local: "Plenário",
    status: "CONFIRMADO",
  },
];

type AgendaView = "CALENDARIO" | "GERENCIAR" | "CATEGORIAS";
type AgendaFilter = "PENDENTE" | "HOJE" | "CONCLUIDO" | "RECUSADO" | "CANCELADO";

interface AgendaContextType {
  compromissos: Compromisso[];
  addCompromisso: (compromisso: Omit<Compromisso, "id" | "status">) => void;
  updateCompromisso: (compromisso: Compromisso) => void;
  deleteCompromisso: (id: string) => void;
  updateStatus: (id: string, status: StatusCompromisso) => void;
  getCompromissosPorDia: (date: Date) => Compromisso[];
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  filter: AgendaFilter | null;
  setFilter: (filter: AgendaFilter | null) => void;
  editingCompromisso: Compromisso | null;
  setEditingCompromisso: (compromisso: Compromisso | null) => void;
  view: AgendaView;
  setView: (view: AgendaView) => void;
  isFormOpen: boolean;
  setFormOpen: (isOpen: boolean) => void;
}

const AgendaContext = createContext<AgendaContextType | null>(null);

export const AgendaProvider = ({ children }: { children: ReactNode }) => {
  const [compromissos, setCompromissos] = useState<Compromisso[]>(() => {
    try {
      const stored = localStorage.getItem("compromissos");
      return stored ? JSON.parse(stored) : demoCompromissos;
    } catch {
      return demoCompromissos;
    }
  });

  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [filter, setFilter] = useState<AgendaFilter | null>(null);
  const [editingCompromisso, setEditingCompromisso] = useState<Compromisso | null>(null);
  const [view, setView] = useState<AgendaView>('CALENDARIO');
  const [isFormOpen, setFormOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("compromissos", JSON.stringify(compromissos));
  }, [compromissos]);

  const addCompromisso = useCallback((compromisso: Omit<Compromisso, "id" | "status">) => {
    const newCompromisso: Compromisso = {
      ...compromisso,
      id: crypto.randomUUID(),
      status: "PENDENTE",
    };
    setCompromissos(prev => [...prev, newCompromisso].sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime() || a.horaInicio.localeCompare(b.horaInicio)));
  }, []);

  const updateCompromisso = useCallback((updatedCompromisso: Compromisso) => {
    setCompromissos(prev =>
      prev.map(c => (c.id === updatedCompromisso.id ? updatedCompromisso : c))
      .sort((a,b) => new Date(a.data).getTime() - new Date(b.data).getTime() || a.horaInicio.localeCompare(b.horaInicio))
    );
  }, []);

  const deleteCompromisso = useCallback((id: string) => {
    setCompromissos(prev => prev.filter(c => c.id !== id));
  }, []);
  
  const updateStatus = useCallback((id: string, status: StatusCompromisso) => {
    setCompromissos(prev => prev.map(c => c.id === id ? {...c, status} : c))
  }, []);
  
  const getCompromissosPorDia = useCallback((date: Date) => {
      const targetDay = startOfDay(date).getTime();
      return compromissos.filter(c => startOfDay(parseISO(c.data)).getTime() === targetDay);
  }, [compromissos]);

  const filteredCompromissos = useMemo(() => {
    if (filter === "PENDENTE") {
      return compromissos.filter(c => c.status === "PENDENTE");
    }
    // Add other filters logic here in the future
    return getCompromissosPorDia(selectedDate);
  }, [compromissos, filter, selectedDate, getCompromissosPorDia]);

  const value = {
    compromissos,
    filteredCompromissos,
    addCompromisso,
    updateCompromisso,
    deleteCompromisso,
    updateStatus,
    getCompromissosPorDia,
    selectedDate,
    setSelectedDate,
    filter,
    setFilter,
    editingCompromisso,
    setEditingCompromisso,
    view,
    setView,
    isFormOpen,
    setFormOpen
  };

  return <AgendaContext.Provider value={value}>{children}</AgendaContext.Provider>;
};

export const useAgenda = () => {
  const context = useContext(AgendaContext);
  if (!context) {
    throw new Error("useAgenda must be used within an AgendaProvider");
  }
  return context;
};

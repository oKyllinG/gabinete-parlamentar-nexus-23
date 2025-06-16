
// Compartilhado entre compromissos e seleção de participantes
export interface Participante {
  id: string;
  nome: string;
}

export type StatusCompromisso = "PENDENTE" | "CONFIRMADO" | "RECUSADO" | "CANCELADO";

export interface Compromisso {
  id: string;
  titulo: string;
  data: string; // ISO 8601 string format
  horaInicio: string;
  local?: string;
  descricao?: string;
  status: StatusCompromisso;
  participantes?: Participante[];
  categoria?: string;
  endereco?: string;
  // Campos específicos para viagem
  municipioSaida?: string;
  municipioDestino?: string;
  distanciaKm?: number;
  horarioSaida?: string;
  acompanhantes?: string[];
}

// === NOVO - Categoria da agenda ===
export interface CategoriaAgenda {
  id: string;
  nome: string;
  cor: string; // ex: "#4851EC" ou qualquer cor Tailwind/Hex
  slug: string; // usado para identificar unicamente e para exibir na legenda
}

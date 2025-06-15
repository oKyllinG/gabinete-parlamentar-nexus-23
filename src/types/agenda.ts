
export type StatusCompromisso = "PENDENTE" | "CONFIRMADO" | "RECUSADO" | "CANCELADO";

export interface Compromisso {
  id: string;
  titulo: string;
  data: string; // ISO 8601 string format
  horaInicio: string;
  horaFim: string;
  local?: string;
  descricao?: string;
  status: StatusCompromisso;
}

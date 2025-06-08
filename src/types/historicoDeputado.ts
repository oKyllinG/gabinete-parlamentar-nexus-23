
export interface AcaoDeputado {
  id: string
  categoria: string
  descricao: string
  valor: number
  municipio: string
  ano: string
  observacoes?: string
  dataRegistro: string
}

export interface CategoriaHistorico {
  nome: string
  total: number
  acoes: AcaoDeputado[]
}

export const CATEGORIAS_HISTORICO = [
  "Emendas Parlamentares",
  "Obras e Equipamentos", 
  "Recursos Obtidos",
  "Indicações e Requerimentos",
  "Projetos de Lei",
  "Outros"
] as const

export type TipoCategoriaHistorico = typeof CATEGORIAS_HISTORICO[number]

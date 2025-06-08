
export interface AcaoDeputado {
  id: string
  categoria: string
  descricao: string
  valor: number
  municipio: string
  dataRegistro: string
}

export interface CategoriaHistorico {
  nome: string
  total: number
  acoes: AcaoDeputado[]
}

// Categorias sugeridas para o histórico do deputado (opcional)
export const CATEGORIAS_SUGERIDAS = [
  "Emendas Parlamentares",
  "Obras e Equipamentos", 
  "Recursos Obtidos",
  "Indicações e Requerimentos",
  "Projetos de Lei",
  "Outros"
] as const

// Export with the name used in the form component
export const CATEGORIAS_HISTORICO = CATEGORIAS_SUGERIDAS

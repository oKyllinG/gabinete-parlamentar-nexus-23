
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

// Removidas as categorias fixas para permitir categorias livres
export const CATEGORIAS_SUGERIDAS = [
  "Emendas Parlamentares",
  "Obras e Equipamentos", 
  "Recursos Obtidos",
  "Indicações e Requerimentos",
  "Projetos de Lei",
  "Outros"
] as const

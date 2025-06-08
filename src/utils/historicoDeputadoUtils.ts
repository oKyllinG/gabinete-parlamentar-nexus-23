
import { AcaoDeputado, CategoriaHistorico, CATEGORIAS_SUGERIDAS } from "@/types/historicoDeputado"

export const getHistoricoByMunicipio = (municipioId: number): AcaoDeputado[] => {
  const savedData = localStorage.getItem(`municipio-${municipioId}-historico-deputado`)
  if (!savedData) return []
  
  try {
    return JSON.parse(savedData)
  } catch {
    return []
  }
}

export const saveHistoricoMunicipio = (municipioId: number, acoes: AcaoDeputado[]): void => {
  localStorage.setItem(`municipio-${municipioId}-historico-deputado`, JSON.stringify(acoes))
}

export const organizarPorCategorias = (acoes: AcaoDeputado[]): CategoriaHistorico[] => {
  const categoriasMap = new Map<string, CategoriaHistorico>()

  acoes.forEach(acao => {
    const categoria = acao.categoria || "Sem Categoria"
    
    if (!categoriasMap.has(categoria)) {
      categoriasMap.set(categoria, {
        nome: categoria,
        total: 0,
        acoes: []
      })
    }
    
    const categoriaObj = categoriasMap.get(categoria)!
    categoriaObj.acoes.push(acao)
    categoriaObj.total += acao.valor
  })

  return Array.from(categoriasMap.values()).filter(cat => cat.acoes.length > 0)
}

export const calcularTotalGeral = (acoes: AcaoDeputado[]): number => {
  return acoes.reduce((total, acao) => total + acao.valor, 0)
}

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

export const getCategoriasSugeridas = (): string[] => {
  return [...CATEGORIAS_SUGERIDAS]
}

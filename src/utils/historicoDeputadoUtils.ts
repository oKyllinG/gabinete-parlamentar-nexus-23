
import { AcaoDeputado, CategoriaHistorico, CATEGORIAS_HISTORICO } from "@/types/historicoDeputado"

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
  const categorias: CategoriaHistorico[] = CATEGORIAS_HISTORICO.map(nome => ({
    nome,
    total: 0,
    acoes: []
  }))

  acoes.forEach(acao => {
    const categoria = categorias.find(cat => cat.nome === acao.categoria)
    if (categoria) {
      categoria.acoes.push(acao)
      categoria.total += acao.valor
    }
  })

  return categorias.filter(cat => cat.acoes.length > 0)
}

export const calcularTotalGeral = (acoes: AcaoDeputado[]): number => {
  return acoes.reduce((total, acao) => total + acao.valor, 0)
}

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

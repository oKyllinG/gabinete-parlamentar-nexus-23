
// Utility functions to fetch briefing data from localStorage

export interface Obra {
  id: string
  titulo: string
  descricao: string
  municipio: string
  regiao: string
  categoria: string
  status: string
  dataInicio: string
  prazoExecucao: string
  valor: number
  observacoes?: string
}

export interface Emenda {
  id: string
  numero: string
  objeto: string
  municipio: string
  valor: number
  status: string
  dataDestinacao: string
  observacoes?: string
}

export const getObrasByMunicipio = (municipioNome: string): Obra[] => {
  const savedObras = localStorage.getItem('obras')
  if (!savedObras) return []
  
  const obras: Obra[] = JSON.parse(savedObras)
  return obras.filter(obra => obra.municipio === municipioNome)
}

export const getEmendasByMunicipio = (municipioNome: string): Emenda[] => {
  const savedEmendas = localStorage.getItem('emendas')
  if (!savedEmendas) return []
  
  const emendas: Emenda[] = JSON.parse(savedEmendas)
  return emendas.filter(emenda => emenda.municipio === municipioNome)
}

// Function to initialize mock data for Água Clara if no data exists
export const initializeMockDataForAguaClara = () => {
  const municipioNome = "Água Clara"
  
  // Check if we already have data for Água Clara
  const existingObras = getObrasByMunicipio(municipioNome)
  const existingEmendas = getEmendasByMunicipio(municipioNome)
  
  if (existingObras.length === 0) {
    // Add mock obras data
    const savedObras = localStorage.getItem('obras')
    const allObras: Obra[] = savedObras ? JSON.parse(savedObras) : []
    
    const mockObras: Obra[] = [
      {
        id: `agua-clara-obra-1`,
        titulo: "Reforma da Escola Municipal João Silva",
        descricao: "Reforma completa da infraestrutura da escola municipal, incluindo salas de aula, biblioteca e laboratório de informática",
        municipio: municipioNome,
        regiao: "Fronteira",
        categoria: "Educação",
        status: "Em andamento",
        dataInicio: "2024-03-15",
        prazoExecucao: "2024-12-15",
        valor: 850000,
        observacoes: "Obra prioritária para melhoria da educação local"
      },
      {
        id: `agua-clara-obra-2`,
        titulo: "Pavimentação da Rua Principal",
        descricao: "Pavimentação asfáltica da Rua Principal do centro da cidade, incluindo sinalização e drenagem",
        municipio: municipioNome,
        regiao: "Fronteira",
        categoria: "Infraestrutura",
        status: "Planejada",
        dataInicio: "2024-06-01",
        prazoExecucao: "2024-10-30",
        valor: 1200000,
        observacoes: "Melhoria do acesso ao centro comercial"
      }
    ]
    
    localStorage.setItem('obras', JSON.stringify([...allObras, ...mockObras]))
  }
  
  if (existingEmendas.length === 0) {
    // Add mock emendas data
    const savedEmendas = localStorage.getItem('emendas')
    const allEmendas: Emenda[] = savedEmendas ? JSON.parse(savedEmendas) : []
    
    const mockEmendas: Emenda[] = [
      {
        id: `agua-clara-emenda-1`,
        numero: "EMD-2024-001",
        objeto: "Aquisição de equipamentos médicos para o Posto de Saúde",
        municipio: municipioNome,
        valor: 150000,
        status: "Aprovada",
        dataDestinacao: "2024-04-10",
        observacoes: "Equipamentos essenciais para atendimento da população"
      },
      {
        id: `agua-clara-emenda-2`,
        numero: "EMD-2024-002",
        objeto: "Reforma e ampliação da quadra esportiva municipal",
        municipio: municipioNome,
        valor: 300000,
        status: "Em análise",
        dataDestinacao: "2024-05-20",
        observacoes: "Fomento ao esporte e lazer da juventude"
      },
      {
        id: `agua-clara-emenda-3`,
        numero: "EMD-2024-003",
        objeto: "Aquisição de veículo para transporte escolar",
        municipio: municipioNome,
        valor: 180000,
        status: "Aprovada",
        dataDestinacao: "2024-03-25",
        observacoes: "Garantir transporte seguro para estudantes da zona rural"
      }
    ]
    
    localStorage.setItem('emendas', JSON.stringify([...allEmendas, ...mockEmendas]))
  }
}


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

export interface DestinacaoEmenda {
  id: string
  numero: string
  objeto: string
  municipio: string
  valor: number
  status: string
  dataDestinacao: string
  observacoes?: string
  destinatario: string
  areaAtuacao: string
  gnd: string
  pd: string
  prazoInicio: string
  prazoFim: string
  cnpj?: string
  projetosAnexados?: string[]
}

export const getObrasByMunicipio = (municipioNome: string): Obra[] => {
  const savedObras = localStorage.getItem('obras')
  if (!savedObras) return []
  
  const obras: Obra[] = JSON.parse(savedObras)
  return obras.filter(obra => obra.municipio === municipioNome)
}

export const getDestinacoesByMunicipio = (municipioNome: string): DestinacaoEmenda[] => {
  const savedEmendas = localStorage.getItem('emendas-parlamentares')
  if (!savedEmendas) return []
  
  const emendas = JSON.parse(savedEmendas)
  const destinacoes: DestinacaoEmenda[] = []
  
  emendas.forEach((emenda: any) => {
    if (emenda.destinacoes && emenda.destinacoes.length > 0) {
      emenda.destinacoes.forEach((destinacao: any) => {
        if (destinacao.municipio === municipioNome) {
          destinacoes.push({
            id: destinacao.id,
            numero: emenda.numero,
            objeto: emenda.objeto,
            municipio: destinacao.municipio,
            valor: destinacao.valor,
            status: destinacao.statusExecucao,
            dataDestinacao: destinacao.dataDestinacao,
            observacoes: destinacao.observacoes,
            destinatario: destinacao.destinatario,
            areaAtuacao: destinacao.areaAtuacao,
            gnd: destinacao.gnd,
            pd: destinacao.pd,
            prazoInicio: destinacao.prazoInicio,
            prazoFim: destinacao.prazoFim,
            cnpj: destinacao.cnpj,
            projetosAnexados: destinacao.projetosAnexados
          })
        }
      })
    }
  })
  
  return destinacoes
}

// Manter compatibilidade com código existente - deprecated
export const getEmendasByMunicipio = (municipioNome: string) => {
  return getDestinacoesByMunicipio(municipioNome)
}

// Function to initialize mock data for Água Clara if no data exists
export const initializeMockDataForAguaClara = () => {
  const municipioNome = "Água Clara"
  
  // Check if we already have data for Água Clara
  const existingObras = getObrasByMunicipio(municipioNome)
  const existingDestinacoes = getDestinacoesByMunicipio(municipioNome)
  
  if (existingObras.length === 0) {
    // Add mock obras data with different categories
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
        categoria: "Obras do PAC",
        status: "Planejada",
        dataInicio: "2024-06-01",
        prazoExecucao: "2024-10-30",
        valor: 1200000,
        observacoes: "Melhoria do acesso ao centro comercial"
      },
      {
        id: `agua-clara-obra-3`,
        titulo: "Construção da Unidade Básica de Saúde",
        descricao: "Nova UBS com consultórios médicos, sala de vacinas e farmácia básica para atender a população local",
        municipio: municipioNome,
        regiao: "Fronteira",
        categoria: "Obras do PAC",
        status: "Em andamento",
        dataInicio: "2024-02-01",
        prazoExecucao: "2024-11-30",
        valor: 2500000,
        observacoes: "Obra essencial para a saúde pública municipal"
      },
      {
        id: `agua-clara-obra-4`,
        titulo: "Aquisição de Equipamentos Agrícolas",
        descricao: "Compra de tratores e implementos agrícolas para apoio aos produtores rurais do município",
        municipio: municipioNome,
        regiao: "Fronteira",
        categoria: "Agricultura",
        status: "Concluída",
        dataInicio: "2024-01-15",
        prazoExecucao: "2024-04-15",
        valor: 450000,
        observacoes: "Equipamentos entregues e em operação"
      }
    ]
    
    localStorage.setItem('obras', JSON.stringify([...allObras, ...mockObras]))
  }
  
  if (existingDestinacoes.length === 0) {
    // Add mock emendas with destinações data
    const savedEmendas = localStorage.getItem('emendas-parlamentares')
    const allEmendas = savedEmendas ? JSON.parse(savedEmendas) : []
    
    const mockEmendas = [
      {
        id: `agua-clara-emenda-1`,
        numero: "EMD-2024-001",
        autor: "Deputado Federal João Silva",
        tipo: "individual",
        ano: "2024",
        programa: "Saúde Pública",
        acao: "Equipamentos Médicos",
        objeto: "Aquisição de equipamentos médicos para o Posto de Saúde",
        orgao: "Ministério da Saúde",
        localizador: "0001",
        valor: 150000,
        valorTotal: 150000,
        valorDestinado: 150000,
        dataCriacao: "2024-04-01",
        destinacoes: [
          {
            id: "dest-agua-clara-1",
            destinatario: "Prefeitura Municipal de Água Clara",
            municipio: municipioNome,
            areaAtuacao: "Saúde",
            valor: 150000,
            statusExecucao: "em_execucao",
            dataDestinacao: "2024-04-10",
            prazoInicio: "2024-04-15",
            prazoFim: "2024-12-15",
            gnd: "4 - Investimentos",
            pd: "10.302.1220.20YM",
            observacoes: "Equipamentos essenciais para atendimento da população",
            cnpj: "01.234.567/0001-89"
          }
        ]
      },
      {
        id: `agua-clara-emenda-2`,
        numero: "EMD-2024-002",
        autor: "Deputado Federal João Silva",
        tipo: "individual",
        ano: "2024",
        programa: "Esporte e Lazer",
        acao: "Infraestrutura Esportiva",
        objeto: "Reforma e ampliação da quadra esportiva municipal",
        orgao: "Ministério do Esporte",
        localizador: "0002",
        valor: 300000,
        valorTotal: 300000,
        valorDestinado: 300000,
        dataCriacao: "2024-05-01",
        destinacoes: [
          {
            id: "dest-agua-clara-2",
            destinatario: "Secretaria Municipal de Esportes",
            municipio: municipioNome,
            areaAtuacao: "Esporte e Lazer",
            valor: 300000,
            statusExecucao: "planejamento",
            dataDestinacao: "2024-05-20",
            prazoInicio: "2024-06-01",
            prazoFim: "2024-11-30",
            gnd: "4 - Investimentos",
            pd: "27.812.1365.20YN",
            observacoes: "Fomento ao esporte e lazer da juventude"
          }
        ]
      }
    ]
    
    localStorage.setItem('emendas-parlamentares', JSON.stringify([...allEmendas, ...mockEmendas]))
  }
}

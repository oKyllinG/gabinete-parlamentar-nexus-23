// Types
export interface Obra {
  id: string
  titulo: string
  descricao: string
  valor: number
  status: string
  categoria?: string
  dataInicio: string
  prazoExecucao: string
  observacoes?: string
  municipio: string
}

export interface DestinacaoEmenda {
  id: string
  numero: string
  objeto: string
  destinatario: string
  areaAtuacao: string
  valor: number
  status: string
  prazoInicio: string
  prazoFim: string
  gnd?: string
  observacoes?: string
  municipio: string
}

// Utility functions
export const getObrasByMunicipio = (municipioNome: string): Obra[] => {
  // For now, return empty array - this can be populated with real data later
  const obrasSalvas = localStorage.getItem(`obras-${municipioNome}`)
  if (obrasSalvas) {
    try {
      return JSON.parse(obrasSalvas)
    } catch (error) {
      console.error('Erro ao carregar obras:', error)
      return []
    }
  }
  return []
}

export const getDestinacoesByMunicipio = (municipioNome: string): DestinacaoEmenda[] => {
  // For now, return empty array - this can be populated with real data later  
  const destinacoesSalvas = localStorage.getItem(`destinacoes-${municipioNome}`)
  if (destinacoesSalvas) {
    try {
      return JSON.parse(destinacoesSalvas)
    } catch (error) {
      console.error('Erro ao carregar destinações:', error)
      return []
    }
  }
  return []
}

export const initializeMockDataForAguaClara = () => {
  const municipioId = 1 // Água Clara

  // Deputados Federais (10 mocks)
  const deputadosFederais = [
    {
      id: "1",
      nome: "Dep. Carlos Marun",
      partido: "PSDB",
      votos: 2845,
      percentual: 23.2,
      telefone: "(67) 99111-1111",
      colocacao: 1
    },
    {
      id: "2", 
      nome: "Dep. Rose Modesto",
      partido: "UNIÃO",
      votos: 1950,
      percentual: 15.9,
      telefone: "(67) 99222-2222",
      colocacao: 2
    },
    {
      id: "3",
      nome: "Dep. Beto Pereira",
      partido: "PSDB",
      votos: 1680,
      percentual: 13.7,
      telefone: "(67) 99333-3333",
      colocacao: 3
    },
    {
      id: "4",
      nome: "Dep. Dagoberto Nogueira",
      partido: "PDT",
      votos: 1420,
      percentual: 11.6,
      telefone: "(67) 99444-4444",
      colocacao: 4
    },
    {
      id: "5",
      nome: "Dep. Camila Jara",
      partido: "PT",
      votos: 1280,
      percentual: 10.5,
      telefone: "(67) 99555-5555",
      colocacao: 5
    },
    {
      id: "6",
      nome: "Dep. Luiz Ovando",
      partido: "PP",
      votos: 980,
      percentual: 8.0,
      telefone: "(67) 99666-6666",
      colocacao: 6
    },
    {
      id: "7",
      nome: "Dep. Geraldo Resende",
      partido: "PL",
      votos: 850,
      percentual: 6.9,
      telefone: "(67) 99777-7777",
      colocacao: 7
    },
    {
      id: "8",
      nome: "Dep. Fábio Trad",
      partido: "PSD",
      votos: 720,
      percentual: 5.9,
      telefone: "(67) 99888-8888",
      colocacao: 8
    },
    {
      id: "9",
      nome: "Dep. Marcos Pollon",
      partido: "PL",
      votos: 520,
      percentual: 4.2,
      telefone: "(67) 99999-9999",
      colocacao: 9
    },
    {
      id: "10",
      nome: "Dep. Pedro Kemp",
      partido: "PT",
      votos: 280,
      percentual: 2.3,
      telefone: "(67) 99000-0000",
      colocacao: 10
    }
  ]

  // Deputados Estaduais (10 mocks)
  const deputadosEstaduais = [
    {
      id: "1",
      nome: "Dep. Paulo Corrêa",
      partido: "PSDB",
      votos: 3200,
      percentual: 26.1,
      telefone: "(67) 98111-1111",
      colocacao: 1
    },
    {
      id: "2",
      nome: "Dep. Marçal Filho",
      partido: "PSDB",
      votos: 2100,
      percentual: 17.1,
      telefone: "(67) 98222-2222",
      colocacao: 2
    },
    {
      id: "3",
      nome: "Dep. Renato Câmara",
      partido: "MDB",
      votos: 1850,
      percentual: 15.1,
      telefone: "(67) 98333-3333",
      colocacao: 3
    },
    {
      id: "4",
      nome: "Dep. Evander Vendramini",
      partido: "PP",
      votos: 1520,
      percentual: 12.4,
      telefone: "(67) 98444-4444",
      colocacao: 4
    },
    {
      id: "5",
      nome: "Dep. Antônio Vaz",
      partido: "REPUBLICANOS",
      votos: 1200,
      percentual: 9.8,
      telefone: "(67) 98555-5555",
      colocacao: 5
    },
    {
      id: "6",
      nome: "Dep. Pedro Pedrossian",
      partido: "PSD",
      votos: 980,
      percentual: 8.0,
      telefone: "(67) 98666-6666",
      colocacao: 6
    },
    {
      id: "7",
      nome: "Dep. Barbosinha",
      partido: "PP",
      votos: 750,
      percentual: 6.1,
      telefone: "(67) 98777-7777",
      colocacao: 7
    },
    {
      id: "8",
      nome: "Dep. Mara Caseiro",
      partido: "PSDB",
      votos: 420,
      percentual: 3.4,
      telefone: "(67) 98888-8888",
      colocacao: 8
    },
    {
      id: "9",
      nome: "Dep. Coronel David",
      partido: "PL",
      votos: 280,
      percentual: 2.3,
      telefone: "(67) 98999-9999",
      colocacao: 9
    },
    {
      id: "10",
      nome: "Dep. Professor Rinaldo",
      partido: "PODEMOS",
      votos: 150,
      percentual: 1.2,
      telefone: "(67) 98000-0000",
      colocacao: 10
    }
  ]

  // Histórico do Deputado (20 ações em várias categorias)
  const historicoAcoes = [
    {
      id: "hist-1",
      categoria: "Emendas Parlamentares",
      descricao: "Emenda para reforma da Unidade Básica de Saúde Central",
      valor: 850000,
      municipio: "Água Clara",
      dataRegistro: "2023-03-15T10:00:00.000Z"
    },
    {
      id: "hist-2",
      categoria: "Emendas Parlamentares", 
      descricao: "Recursos para aquisição de ambulância UTI móvel",
      valor: 620000,
      municipio: "Água Clara",
      dataRegistro: "2023-05-22T14:30:00.000Z"
    },
    {
      id: "hist-3",
      categoria: "Obras e Equipamentos",
      descricao: "Pavimentação asfáltica da Rua das Flores",
      valor: 1200000,
      municipio: "Água Clara",
      dataRegistro: "2023-01-10T09:15:00.000Z"
    },
    {
      id: "hist-4",
      categoria: "Obras e Equipamentos",
      descricao: "Construção de quadra poliesportiva no Bairro São José",
      valor: 450000,
      municipio: "Água Clara",
      dataRegistro: "2023-07-08T16:20:00.000Z"
    },
    {
      id: "hist-5",
      categoria: "Recursos Obtidos",
      descricao: "Verba federal para merenda escolar",
      valor: 320000,
      municipio: "Água Clara",
      dataRegistro: "2023-02-28T11:45:00.000Z"
    },
    {
      id: "hist-6",
      categoria: "Recursos Obtidos",
      descricao: "Programa Nacional de Alfabetização",
      valor: 180000,
      municipio: "Água Clara",
      dataRegistro: "2023-08-14T13:00:00.000Z"
    },
    {
      id: "hist-7",
      categoria: "Indicações e Requerimentos",
      descricao: "Solicitação de posto da Polícia Rodoviária Federal",
      valor: 0,
      municipio: "Água Clara",
      dataRegistro: "2023-04-05T08:30:00.000Z"
    },
    {
      id: "hist-8",
      categoria: "Indicações e Requerimentos",
      descricao: "Requerimento para melhorias na BR-262",
      valor: 0,
      municipio: "Água Clara",
      dataRegistro: "2023-06-18T15:45:00.000Z"
    },
    {
      id: "hist-9",
      categoria: "Projetos de Lei",
      descricao: "PL para incentivo ao agronegócio familiar",
      valor: 0,
      municipio: "Água Clara",
      dataRegistro: "2023-09-03T10:20:00.000Z"
    },
    {
      id: "hist-10",
      categoria: "Emendas Parlamentares",
      descricao: "Equipamentos para Centro de Referência da Assistência Social",
      valor: 280000,
      municipio: "Água Clara",
      dataRegistro: "2023-10-12T14:15:00.000Z"
    },
    {
      id: "hist-11",
      categoria: "Obras e Equipamentos",
      descricao: "Reforma do Centro Cultural Municipal",
      valor: 380000,
      municipio: "Água Clara",
      dataRegistro: "2023-11-20T09:00:00.000Z"
    },
    {
      id: "hist-12",
      categoria: "Recursos Obtidos",
      descricao: "Programa Mais Médicos - contratação de profissionais",
      valor: 720000,
      municipio: "Água Clara",
      dataRegistro: "2023-12-08T16:30:00.000Z"
    },
    {
      id: "hist-13",
      categoria: "Emendas Parlamentares",
      descricao: "Aquisição de equipamentos para laboratório de análises clínicas",
      valor: 520000,
      municipio: "Água Clara",
      dataRegistro: "2024-01-15T11:20:00.000Z"
    },
    {
      id: "hist-14",
      categoria: "Obras e Equipamentos",
      descricao: "Construção de creche no Bairro Jardim Primavera",
      valor: 980000,
      municipio: "Água Clara",
      dataRegistro: "2024-02-22T08:45:00.000Z"
    },
    {
      id: "hist-15",
      categoria: "Indicações e Requerimentos",
      descricao: "Solicitação de iluminação pública LED para zona rural",
      valor: 0,
      municipio: "Água Clara",
      dataRegistro: "2024-03-10T14:00:00.000Z"
    },
    {
      id: "hist-16",
      categoria: "Recursos Obtidos",
      descricao: "Programa de distribuição de cestas básicas",
      valor: 150000,
      municipio: "Água Clara",
      dataRegistro: "2024-04-18T10:30:00.000Z"
    },
    {
      id: "hist-17",
      categoria: "Emendas Parlamentares",
      descricao: "Reforma e ampliação da Escola Municipal José da Silva",
      valor: 750000,
      municipio: "Água Clara",
      dataRegistro: "2024-05-25T15:15:00.000Z"
    },
    {
      id: "hist-18",
      categoria: "Obras e Equipamentos",
      descricao: "Sistema de tratamento de água para distrito rural",
      valor: 1100000,
      municipio: "Água Clara",
      dataRegistro: "2024-06-12T12:00:00.000Z"
    },
    {
      id: "hist-19",
      categoria: "Projetos de Lei",
      descricao: "PL para criação de programa de microcrédito rural",
      valor: 0,
      municipio: "Água Clara",
      dataRegistro: "2024-07-08T09:30:00.000Z"
    },
    {
      id: "hist-20",
      categoria: "Outros",
      descricao: "Doação de medicamentos para farmácia municipal",
      valor: 95000,
      municipio: "Água Clara",
      dataRegistro: "2024-08-14T13:45:00.000Z"
    }
  ]

  // Salvar no localStorage se não existir
  if (!localStorage.getItem(`municipio-${municipioId}-deputados-federais`)) {
    localStorage.setItem(`municipio-${municipioId}-deputados-federais`, JSON.stringify(deputadosFederais))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-deputados-estaduais`)) {
    localStorage.setItem(`municipio-${municipioId}-deputados-estaduais`, JSON.stringify(deputadosEstaduais))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-historico-acoes`)) {
    localStorage.setItem(`municipio-${municipioId}-historico-acoes`, JSON.stringify(historicoAcoes))
  }

  // Dados políticos atualizados
  const dadosPoliticos = {
    totalEleitores: 12244,
    votosDeputado: 2845,
    percentualDeputado: 23.2,
    colocacaoDeputado: "1º"
  }

  if (!localStorage.getItem(`municipio-${municipioId}-dados-politicos`)) {
    localStorage.setItem(`municipio-${municipioId}-dados-politicos`, JSON.stringify(dadosPoliticos))
  }

  console.log("Dados mock inicializados para Água Clara")
}

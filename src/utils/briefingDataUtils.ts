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

  // 6 Obras mock
  const obras = [
    {
      id: "obra-1",
      titulo: "Pavimentação da Avenida Central",
      descricao: "Pavimentação asfáltica da Avenida Central, incluindo drenagem e sinalização",
      valor: 2500000,
      status: "Em andamento",
      categoria: "Infraestrutura",
      dataInicio: "2024-01-15",
      prazoExecucao: "2024-12-30",
      observacoes: "Obra prioritária para o desenvolvimento urbano",
      municipio: "Água Clara"
    },
    {
      id: "obra-2",
      titulo: "Construção do Centro de Saúde",
      descricao: "Construção de novo centro de saúde com 10 consultórios e laboratório",
      valor: 3200000,
      status: "Planejada",
      categoria: "Saúde",
      dataInicio: "2024-06-01",
      prazoExecucao: "2025-05-30",
      observacoes: "Atenderá toda a região rural",
      municipio: "Água Clara"
    },
    {
      id: "obra-3",
      titulo: "Reforma da Escola Municipal Santos Dumont",
      descricao: "Reforma completa com ampliação de 6 salas de aula e quadra coberta",
      valor: 1800000,
      status: "Concluída",
      categoria: "Educação",
      dataInicio: "2023-03-10",
      prazoExecucao: "2023-11-20",
      observacoes: "Beneficiará 450 alunos",
      municipio: "Água Clara"
    },
    {
      id: "obra-4",
      titulo: "Sistema de Abastecimento de Água Rural",
      descricao: "Implementação de sistema de captação e distribuição para zona rural",
      valor: 4500000,
      status: "Em licitação",
      categoria: "Saneamento",
      dataInicio: "2024-08-01",
      prazoExecucao: "2025-07-30",
      observacoes: "Atenderá 12 comunidades rurais",
      municipio: "Água Clara"
    },
    {
      id: "obra-5",
      titulo: "Praça da Juventude",
      descricao: "Construção de praça com equipamentos de ginástica e playground",
      valor: 850000,
      status: "Em andamento",
      categoria: "Lazer",
      dataInicio: "2024-02-20",
      prazoExecucao: "2024-08-15",
      observacoes: "Espaço de convivência para todas as idades",
      municipio: "Água Clara"
    },
    {
      id: "obra-6",
      titulo: "Ponte sobre o Córrego das Pedras",
      descricao: "Construção de ponte em concreto para acesso ao distrito rural",
      valor: 1200000,
      status: "Planejada",
      categoria: "Infraestrutura",
      dataInicio: "2024-09-01",
      prazoExecucao: "2024-12-20",
      observacoes: "Ligação essencial para escoamento da produção agrícola",
      municipio: "Água Clara"
    }
  ]

  // 4 Emendas mock
  const emendas = [
    {
      id: "emenda-1",
      numero: "32640001",
      objeto: "Aquisição de ambulância UTI móvel para o município",
      destinatario: "Secretaria Municipal de Saúde",
      areaAtuacao: "Saúde",
      valor: 650000,
      status: "Aprovada",
      prazoInicio: "2024-01-10",
      prazoFim: "2024-12-31",
      gnd: "4",
      observacoes: "Emenda de bancada MS",
      municipio: "Água Clara"
    },
    {
      id: "emenda-2",
      numero: "32640002",
      objeto: "Equipamentos para laboratório de análises clínicas",
      destinatario: "Hospital Municipal",
      areaAtuacao: "Saúde",
      valor: 320000,
      status: "Em execução",
      prazoInicio: "2024-03-15",
      prazoFim: "2024-10-30",
      gnd: "4",
      observacoes: "Melhoria dos serviços diagnósticos",
      municipio: "Água Clara"
    },
    {
      id: "emenda-3",
      numero: "32640003",
      objeto: "Aquisição de ônibus escolar adaptado",
      destinatario: "Secretaria Municipal de Educação",
      areaAtuacao: "Educação",
      valor: 280000,
      status: "Aprovada",
      prazoInicio: "2024-02-01",
      prazoFim: "2024-08-30",
      gnd: "4",
      observacoes: "Transporte para estudantes da zona rural",
      municipio: "Água Clara"
    },
    {
      id: "emenda-4",
      numero: "32640004",
      objeto: "Equipamentos para Centro de Referência da Assistência Social",
      destinatario: "CRAS Municipal",
      areaAtuacao: "Assistência Social",
      valor: 150000,
      status: "Em execução",
      prazoInicio: "2024-04-01",
      prazoFim: "2024-11-30",
      gnd: "4",
      observacoes: "Fortalecimento dos serviços socioassistenciais",
      municipio: "Água Clara"
    }
  ]

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

  // 16 Lideranças Municipais mock (prefeito, vice, secretário de saúde e 13 vereadores)
  const liderancasMunicipais = [
    {
      id: 1,
      nome: "Carlos Eduardo Silva",
      cargo: "Prefeito",
      partido: "PSDB",
      telefone: "(67) 99988-7766",
      votos: 8245,
      ordem: 0
    },
    {
      id: 2,
      nome: "Ana Maria Santos",
      cargo: "Vice-Prefeita",
      partido: "PSDB",
      telefone: "(67) 99977-8855",
      votos: 8245,
      ordem: 1
    },
    {
      id: 3,
      nome: "Dr. Roberto Oliveira",
      cargo: "Secretário de Saúde",
      partido: "PDT",
      telefone: "(67) 99966-9944",
      votos: 0,
      ordem: 2
    },
    {
      id: 4,
      nome: "José da Silva",
      cargo: "Vereador",
      partido: "PT",
      telefone: "(67) 99955-1122",
      votos: 1850,
      ordem: 3
    },
    {
      id: 5,
      nome: "Maria das Graças",
      cargo: "Vereadora",
      partido: "PP",
      telefone: "(67) 99944-3344",
      votos: 1620,
      ordem: 4
    },
    {
      id: 6,
      nome: "João Pedro Costa",
      cargo: "Vereador",
      partido: "MDB",
      telefone: "(67) 99933-5566",
      votos: 1480,
      ordem: 5
    },
    {
      id: 7,
      nome: "Antônio Carlos",
      cargo: "Vereador",
      partido: "PL",
      telefone: "(67) 99922-7788",
      votos: 1320,
      ordem: 6
    },
    {
      id: 8,
      nome: "Luciana Fernandes",
      cargo: "Vereadora",
      partido: "UNIÃO",
      telefone: "(67) 99911-9900",
      votos: 1280,
      ordem: 7
    },
    {
      id: 9,
      nome: "Fernando Almeida",
      cargo: "Vereador",
      partido: "REPUBLICANOS",
      telefone: "(67) 99900-1122",
      votos: 1150,
      ordem: 8
    },
    {
      id: 10,
      nome: "Sandra Regina",
      cargo: "Vereadora",
      partido: "PSB",
      telefone: "(67) 99888-3344",
      votos: 1080,
      ordem: 9
    },
    {
      id: 11,
      nome: "Ricardo Mendes",
      cargo: "Vereador",
      partido: "PODE",
      telefone: "(67) 99877-5566",
      votos: 980,
      ordem: 10
    },
    {
      id: 12,
      nome: "Patrícia Lima",
      cargo: "Vereadora",
      partido: "PV",
      telefone: "(67) 99866-7788",
      votos: 920,
      ordem: 11
    },
    {
      id: 13,
      nome: "Marcos Vinícius",
      cargo: "Vereador",
      partido: "CIDADANIA",
      telefone: "(67) 99855-9900",
      votos: 880,
      ordem: 12
    },
    {
      id: 14,
      nome: "Cláudia Souza",
      cargo: "Vereadora",
      partido: "SOLIDARIEDADE",
      telefone: "(67) 99844-1122",
      votos: 850,
      ordem: 13
    },
    {
      id: 15,
      nome: "Rafael Rodrigues",
      cargo: "Vereador",
      partido: "AVANTE",
      telefone: "(67) 99833-3344",
      votos: 800,
      ordem: 14
    },
    {
      id: 16,
      nome: "Vanessa Castro",
      cargo: "Vereadora",
      partido: "PROS",
      telefone: "(67) 99822-5566",
      votos: 750,
      ordem: 15
    }
  ]

  // Salvar todos os dados no localStorage se não existir
  if (!localStorage.getItem(`obras-Água Clara`)) {
    localStorage.setItem(`obras-Água Clara`, JSON.stringify(obras))
  }

  if (!localStorage.getItem(`destinacoes-Água Clara`)) {
    localStorage.setItem(`destinacoes-Água Clara`, JSON.stringify(emendas))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-deputados-federais`)) {
    localStorage.setItem(`municipio-${municipioId}-deputados-federais`, JSON.stringify(deputadosFederais))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-deputados-estaduais`)) {
    localStorage.setItem(`municipio-${municipioId}-deputados-estaduais`, JSON.stringify(deputadosEstaduais))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-historico-acoes`)) {
    localStorage.setItem(`municipio-${municipioId}-historico-acoes`, JSON.stringify(historicoAcoes))
  }

  if (!localStorage.getItem(`municipio-${municipioId}-liderancas`)) {
    localStorage.setItem(`municipio-${municipioId}-liderancas`, JSON.stringify(liderancasMunicipais))
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

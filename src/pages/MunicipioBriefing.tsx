import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BriefingLayout } from "@/components/briefing/BriefingLayout"
import { initializeMockDataForAguaClara } from "@/utils/briefingDataUtils"
import { getHistoricoByMunicipio, saveHistoricoMunicipio } from "@/utils/historicoDeputadoUtils"
import { AcaoDeputado } from "@/types/historicoDeputado"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface DadosPoliticos {
  totalEleitores: number
  votosDeputado: number
  percentualDeputado: number
  colocacaoDeputado: string
}

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
  colocacao?: number
}

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
}

const municipiosMS: Municipio[] = [
  { id: 1, nome: "Água Clara", regiao: "Fronteira", assessor: "testew" },
  { id: 2, nome: "Alcinópolis", regiao: "Norte", assessor: null },
  { id: 3, nome: "Amambai", regiao: "Fronteira", assessor: null },
  { id: 4, nome: "Anastácio", regiao: "Pantanal", assessor: null },
  { id: 5, nome: "Anaurilândia", regiao: "Bolsão", assessor: null },
  { id: 6, nome: "Angélica", regiao: "Sul", assessor: null },
  { id: 7, nome: "Antônio João", regiao: "Fronteira", assessor: null },
  { id: 8, nome: "Aparecida do Taboado", regiao: "Bolsão", assessor: null },
  { id: 9, nome: "Aquidauana", regiao: "Pantanal", assessor: null },
  { id: 10, nome: "Aral Moreira", regiao: "Fronteira", assessor: null },
  { id: 11, nome: "Bandeirantes", regiao: "Bolsão", assessor: null },
  { id: 12, nome: "Bataguassu", regiao: "Bolsão", assessor: null },
  { id: 13, nome: "Batayporã", regiao: "Sul", assessor: null },
  { id: 14, nome: "Bela Vista", regiao: "Fronteira", assessor: null },
  { id: 15, nome: "Bodoquena", regiao: "Pantanal", assessor: null },
  { id: 16, nome: "Bonito", regiao: "Pantanal", assessor: null },
  { id: 17, nome: "Brasilândia", regiao: "Bolsão", assessor: null },
  { id: 18, nome: "Caarapó", regiao: "Sul", assessor: null },
  { id: 19, nome: "Camapuã", regiao: "Norte", assessor: null },
  { id: 20, nome: "Campo Grande", regiao: "Centro", assessor: null },
  { id: 21, nome: "Caracol", regiao: "Fronteira", assessor: null },
  { id: 22, nome: "Cassilândia", regiao: "Bolsão", assessor: null },
  { id: 23, nome: "Chapadão do Sul", regiao: "Bolsão", assessor: null },
  { id: 24, nome: "Corguinho", regiao: "Centro", assessor: null },
  { id: 25, nome: "Coronel Sapucaia", regiao: "Fronteira", assessor: null },
  { id: 26, nome: "Corumbá", regiao: "Pantanal", assessor: null },
  { id: 27, nome: "Costa Rica", regiao: "Norte", assessor: null },
  { id: 28, nome: "Coxim", regiao: "Norte", assessor: null },
  { id: 29, nome: "Deodápolis", regiao: "Sul", assessor: null },
  { id: 30, nome: "Dois Irmãos do Buriti", regiao: "Centro", assessor: null },
  { id: 31, nome: "Douradina", regiao: "Sul", assessor: null },
  { id: 32, nome: "Dourados", regiao: "Sul", assessor: null },
  { id: 33, nome: "Eldorado", regiao: "Sul", assessor: null },
  { id: 34, nome: "Fátima do Sul", regiao: "Sul", assessor: null },
  { id: 35, nome: "Figueirão", regiao: "Norte", assessor: null },
  { id: 36, nome: "Glória de Dourados", regiao: "Sul", assessor: null },
  { id: 37, nome: "Guia Lopes da Laguna", regiao: "Pantanal", assessor: null },
  { id: 38, nome: "Iguatemi", regiao: "Sul", assessor: null },
  { id: 39, nome: "Inocência", regiao: "Bolsão", assessor: null },
  { id: 40, nome: "Itaporã", regiao: "Sul", assessor: null },
  { id: 41, nome: "Itaquiraí", regiao: "Sul", assessor: null },
  { id: 42, nome: "Ivinhema", regiao: "Sul", assessor: null },
  { id: 43, nome: "Japorã", regiao: "Sul", assessor: null },
  { id: 44, nome: "Jaraguari", regiao: "Centro", assessor: null },
  { id: 45, nome: "Jardim", regiao: "Pantanal", assessor: null },
  { id: 46, nome: "Jateí", regiao: "Sul", assessor: null },
  { id: 47, nome: "Juti", regiao: "Sul", assessor: null },
  { id: 48, nome: "Ladário", regiao: "Pantanal", assessor: null },
  { id: 49, nome: "Laguna Carapã", regiao: "Sul", assessor: null },
  { id: 50, nome: "Maracaju", regiao: "Sul", assessor: null },
  { id: 51, nome: "Miranda", regiao: "Pantanal", assessor: null },
  { id: 52, nome: "Mundo Novo", regiao: "Sul", assessor: null },
  { id: 53, nome: "Naviraí", regiao: "Sul", assessor: null },
  { id: 54, nome: "Nioaque", regiao: "Pantanal", assessor: null },
  { id: 55, nome: "Nova Alvorada do Sul", regiao: "Sul", assessor: null },
  { id: 56, nome: "Nova Andradina", regiao: "Bolsão", assessor: null },
  { id: 57, nome: "Novo Horizonte do Sul", regiao: "Sul", assessor: null },
  { id: 58, nome: "Paranaíba", regiao: "Bolsão", assessor: null },
  { id: 59, nome: "Paranhos", regiao: "Fronteira", assessor: null },
  { id: 60, nome: "Paraíso das Águas", regiao: "Norte", assessor: null },
  { id: 61, nome: "Pedro Gomes", regiao: "Norte", assessor: null },
  { id: 62, nome: "Ponta Porã", regiao: "Fronteira", assessor: null },
  { id: 63, nome: "Porto Murtinho", regiao: "Pantanal", assessor: null },
  { id: 64, nome: "Ribas do Rio Pardo", regiao: "Centro", assessor: null },
  { id: 65, nome: "Rio Brilhante", regiao: "Sul", assessor: null },
  { id: 66, nome: "Rio Negro", regiao: "Norte", assessor: null },
  { id: 67, nome: "Rio Verde de Mato Grosso", regiao: "Norte", assessor: null },
  { id: 68, nome: "Rochedo", regiao: "Centro", assessor: null },
  { id: 69, nome: "Santa Rita do Pardo", regiao: "Bolsão", assessor: null },
  { id: 70, nome: "São Gabriel do Oeste", regiao: "Norte", assessor: null },
  { id: 71, nome: "Selvíria", regiao: "Bolsão", assessor: null },
  { id: 72, nome: "Sete Quedas", regiao: "Norte", assessor: null },
  { id: 73, nome: "Sidrolândia", regiao: "Centro", assessor: null },
  { id: 74, nome: "Sonora", regiao: "Norte", assessor: null },
  { id: 75, nome: "Tacuru", regiao: "Fronteira", assessor: null },
  { id: 76, nome: "Taquarussu", regiao: "Norte", assessor: null },
  { id: 77, nome: "Terenos", regiao: "Centro", assessor: null },
  { id: 78, nome: "Três Lagoas", regiao: "Bolsão", assessor: null },
  { id: 79, nome: "Vicentina", regiao: "Sul", assessor: null }
]

const initializeHistoricoAguaClara = () => {
  const mockHistorico: AcaoDeputado[] = [
    {
      id: 'h1',
      categoria: 'Emendas Parlamentares',
      descricao: 'Emenda destinada para aquisição de ambulância para o município',
      valor: 180000,
      municipio: 'Água Clara',
      dataRegistro: '2024-03-15'
    },
    {
      id: 'h2',
      categoria: 'Obras e Equipamentos',
      descricao: 'Construção de posto de saúde no bairro Centro',
      valor: 850000,
      municipio: 'Água Clara',
      dataRegistro: '2024-02-10'
    },
    {
      id: 'h3',
      categoria: 'Recursos Obtidos',
      descricao: 'Recursos para pavimentação asfáltica da Rua das Flores',
      valor: 320000,
      municipio: 'Água Clara',
      dataRegistro: '2024-01-20'
    },
    {
      id: 'h4',
      categoria: 'Indicações e Requerimentos',
      descricao: 'Indicação para melhorias na iluminação pública',
      valor: 75000,
      municipio: 'Água Clara',
      dataRegistro: '2024-04-05'
    },
    {
      id: 'h5',
      categoria: 'Emendas Parlamentares',
      descricao: 'Equipamentos odontológicos para UBS',
      valor: 95000,
      municipio: 'Água Clara',
      dataRegistro: '2024-05-12'
    },
    {
      id: 'h6',
      categoria: 'Obras e Equipamentos',
      descricao: 'Reforma da escola municipal Dom Pedro II',
      valor: 420000,
      municipio: 'Água Clara',
      dataRegistro: '2023-11-30'
    },
    {
      id: 'h7',
      categoria: 'Projetos de Lei',
      descricao: 'Projeto de incentivo ao empreendedorismo local',
      valor: 0,
      municipio: 'Água Clara',
      dataRegistro: '2024-06-01'
    },
    {
      id: 'h8',
      categoria: 'Recursos Obtidos',
      descricao: 'Verba para compra de medicamentos básicos',
      valor: 150000,
      municipio: 'Água Clara',
      dataRegistro: '2024-03-22'
    },
    {
      id: 'h9',
      categoria: 'Emendas Parlamentares',
      descricao: 'Aquisição de veículo para transporte escolar',
      valor: 220000,
      municipio: 'Água Clara',
      dataRegistro: '2023-12-08'
    },
    {
      id: 'h10',
      categoria: 'Obras e Equipamentos',
      descricao: 'Construção de quadra poliesportiva coberta',
      valor: 380000,
      municipio: 'Água Clara',
      dataRegistro: '2024-04-18'
    },
    {
      id: 'h11',
      categoria: 'Indicações e Requerimentos',
      descricao: 'Solicitação de melhorias no sistema de água',
      valor: 0,
      municipio: 'Água Clara',
      dataRegistro: '2024-02-28'
    },
    {
      id: 'h12',
      categoria: 'Recursos Obtidos',
      descricao: 'Verba para programa de assistência social',
      valor: 120000,
      municipio: 'Água Clara',
      dataRegistro: '2024-01-10'
    },
    {
      id: 'h13',
      categoria: 'Emendas Parlamentares',
      descricao: 'Equipamentos para laboratório de análises clínicas',
      valor: 165000,
      municipio: 'Água Clara',
      dataRegistro: '2024-05-25'
    },
    {
      id: 'h14',
      categoria: 'Obras e Equipamentos',
      descricao: 'Pavimentação da estrada rural do Distrito Industrial',
      valor: 680000,
      municipio: 'Água Clara',
      dataRegistro: '2023-10-15'
    },
    {
      id: 'h15',
      categoria: 'Projetos de Lei',
      descricao: 'Criação do programa municipal de habitação popular',
      valor: 0,
      municipio: 'Água Clara',
      dataRegistro: '2024-03-08'
    },
    {
      id: 'h16',
      categoria: 'Recursos Obtidos',
      descricao: 'Recursos para aquisição de equipamentos agrícolas',
      valor: 280000,
      municipio: 'Água Clara',
      dataRegistro: '2024-04-30'
    },
    {
      id: 'h17',
      categoria: 'Emendas Parlamentares',
      descricao: 'Mobiliário escolar para ensino fundamental',
      valor: 85000,
      municipio: 'Água Clara',
      dataRegistro: '2024-02-14'
    },
    {
      id: 'h18',
      categoria: 'Indicações e Requerimentos',
      descricao: 'Requerimento para instalação de semáforo na praça central',
      valor: 0,
      municipio: 'Água Clara',
      dataRegistro: '2024-05-07'
    },
    {
      id: 'h19',
      categoria: 'Obras e Equipamentos',
      descricao: 'Construção de centro comunitário no bairro Jardim das Acácias',
      valor: 520000,
      municipio: 'Água Clara',
      dataRegistro: '2024-01-25'
    },
    {
      id: 'h20',
      categoria: 'Recursos Obtidos',
      descricao: 'Verba para programa de capacitação profissional',
      valor: 95000,
      municipio: 'Água Clara',
      dataRegistro: '2024-06-03'
    }
  ]

  const existingHistorico = getHistoricoByMunicipio(1) // Água Clara ID = 1
  if (existingHistorico.length === 0) {
    saveHistoricoMunicipio(1, mockHistorico)
  }
}

const MunicipioBriefing = () => {
  const { municipioId } = useParams()
  const navigate = useNavigate()
  
  const municipio = municipiosMS.find(m => m.id === Number(municipioId))

  const [dadosPoliticos, setDadosPoliticos] = useState<DadosPoliticos>({
    totalEleitores: 12244,
    votosDeputado: 400,
    percentualDeputado: 3.27,
    colocacaoDeputado: "5ª"
  })

  const [deputadosFederais, setDeputadosFederais] = useState<Deputado[]>([])
  const [deputadosEstaduais, setDeputadosEstaduais] = useState<Deputado[]>([])
  const [liderancas, setLiderancas] = useState<Lideranca[]>([])
  const [historicoAcoes, setHistoricoAcoes] = useState<AcaoDeputado[]>([])

  useEffect(() => {
    if (municipio) {
      if (municipio.nome === "Água Clara") {
        initializeMockDataForAguaClara()
        initializeHistoricoAguaClara()
      }

      const savedData = localStorage.getItem(`municipio-${municipio.id}-dados-politicos`)
      if (savedData) setDadosPoliticos(JSON.parse(savedData))

      const savedFederais = localStorage.getItem(`municipio-${municipio.id}-deputados-federais`)
      if (savedFederais) setDeputadosFederais(JSON.parse(savedFederais))

      const savedEstaduais = localStorage.getItem(`municipio-${municipio.id}-deputados-estaduais`)
      if (savedEstaduais) setDeputadosEstaduais(JSON.parse(savedEstaduais))

      const savedLiderancas = localStorage.getItem(`municipio-${municipio.id}-liderancas`)
      if (savedLiderancas) setLiderancas(JSON.parse(savedLiderancas))

      const historicoData = getHistoricoByMunicipio(municipio.id)
      setHistoricoAcoes(historicoData)
    }
  }, [municipio])

  const handleSaveDadosPoliticos = (dados: DadosPoliticos) => {
    setDadosPoliticos(dados)
    if (municipio) {
      localStorage.setItem(`municipio-${municipio.id}-dados-politicos`, JSON.stringify(dados))
    }
  }

  const handleSaveDeputadosFederais = (deputados: Deputado[]) => {
    setDeputadosFederais(deputados)
    if (municipio) {
      localStorage.setItem(`municipio-${municipio.id}-deputados-federais`, JSON.stringify(deputados))
    }
  }

  const handleSaveDeputadosEstaduais = (deputados: Deputado[]) => {
    setDeputadosEstaduais(deputados)
    if (municipio) {
      localStorage.setItem(`municipio-${municipio.id}-deputados-estaduais`, JSON.stringify(deputados))
    }
  }

  const handleSaveLiderancas = (novasLiderancas: Lideranca[]) => {
    setLiderancas(novasLiderancas)
    if (municipio) {
      localStorage.setItem(`municipio-${municipio.id}-liderancas`, JSON.stringify(novasLiderancas))
    }
  }

  const handleSaveHistoricoAcoes = (acoes: AcaoDeputado[]) => {
    setHistoricoAcoes(acoes)
    if (municipio) {
      saveHistoricoMunicipio(municipio.id, acoes)
    }
  }
  
  if (!municipio) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Município não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível encontrar o município com o ID: {municipioId}
          </p>
          <Button onClick={() => navigate('/briefing')}>
            Voltar para Briefings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <BriefingLayout 
      municipio={municipio}
      dadosPoliticos={dadosPoliticos}
      deputadosFederais={deputadosFederais}
      deputadosEstaduais={deputadosEstaduais}
      liderancas={liderancas}
      historicoAcoes={historicoAcoes}
      onSaveDadosPoliticos={handleSaveDadosPoliticos}
      onSaveDeputadosFederais={handleSaveDeputadosFederais}
      onSaveDeputadosEstaduais={handleSaveDeputadosEstaduais}
      onSaveLiderancas={handleSaveLiderancas}
      onSaveHistoricoAcoes={handleSaveHistoricoAcoes}
    />
  )
}

export default MunicipioBriefing

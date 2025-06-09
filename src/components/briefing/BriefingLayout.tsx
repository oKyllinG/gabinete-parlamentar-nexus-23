
import { MapPin } from "lucide-react"
import { SortableObras } from "./SortableObras"
import { SortableEmendas } from "./SortableEmendas"
import { ResultadosEleitoraisManager } from "./ResultadosEleitoraisManager"
import { VotacaoHistoricaManager } from "./VotacaoHistoricaManager"
import { DeputadosFederaisManager } from "./DeputadosFederaisManager"
import { DeputadosEstaduaisManager } from "./DeputadosEstaduaisManager"
import { LiderancasManager } from "./LiderancasManager"
import { HistoricoDeputadoManager } from "./HistoricoDeputadoManager"
import { AcaoDeputado } from "@/types/historicoDeputado"
import { getObrasByMunicipio, getDestinacoesByMunicipio, Obra, DestinacaoEmenda } from "@/utils/briefingDataUtils"
import { useState, useEffect } from "react"

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

interface BriefingLayoutProps {
  municipio: Municipio
  dadosPoliticos: DadosPoliticos
  deputadosFederais: Deputado[]
  deputadosEstaduais: Deputado[]
  liderancas: Lideranca[]
  historicoAcoes: AcaoDeputado[]
  onSaveDadosPoliticos: (dados: DadosPoliticos) => void
  onSaveDeputadosFederais: (deputados: Deputado[]) => void
  onSaveDeputadosEstaduais: (deputados: Deputado[]) => void
  onSaveLiderancas: (liderancas: Lideranca[]) => void
  onSaveHistoricoAcoes: (acoes: AcaoDeputado[]) => void
}

export const BriefingLayout = ({ 
  municipio, 
  dadosPoliticos, 
  deputadosFederais,
  deputadosEstaduais,
  liderancas,
  historicoAcoes,
  onSaveDadosPoliticos,
  onSaveDeputadosFederais,
  onSaveDeputadosEstaduais,
  onSaveLiderancas,
  onSaveHistoricoAcoes
}: BriefingLayoutProps) => {
  const [obras, setObras] = useState<Obra[]>([])
  const [emendas, setEmendas] = useState<DestinacaoEmenda[]>([])

  // Carregar obras e emendas do localStorage
  useEffect(() => {
    const obrasData = getObrasByMunicipio(municipio.nome)
    const emendasData = getDestinacoesByMunicipio(municipio.nome)
    setObras(obrasData)
    setEmendas(emendasData)
  }, [municipio.nome])

  const handleSaveObras = (newObras: Obra[]) => {
    setObras(newObras)
    localStorage.setItem(`obras-${municipio.nome}`, JSON.stringify(newObras))
  }

  const handleSaveEmendas = (newEmendas: DestinacaoEmenda[]) => {
    setEmendas(newEmendas)
    localStorage.setItem(`destinacoes-${municipio.nome}`, JSON.stringify(newEmendas))
  }

  const handleAddObra = () => {
    const newObra: Obra = {
      id: `obra-${Date.now()}`,
      titulo: "Nova Obra",
      descricao: "Descrição da obra",
      valor: 0,
      status: "Planejada",
      categoria: "Infraestrutura",
      dataInicio: new Date().toISOString().split('T')[0],
      prazoExecucao: new Date().toISOString().split('T')[0],
      municipio: municipio.nome
    }
    handleSaveObras([...obras, newObra])
  }

  const handleEditObra = (obra: Obra) => {
    console.log("Edit obra:", obra)
    // Implementar modal de edição futuramente
  }

  const handleDeleteObra = (id: string) => {
    handleSaveObras(obras.filter(o => o.id !== id))
  }

  const handleAddEmenda = () => {
    const newEmenda: DestinacaoEmenda = {
      id: `emenda-${Date.now()}`,
      numero: `${Date.now()}`,
      objeto: "Nova emenda parlamentar",
      destinatario: "Prefeitura Municipal",
      areaAtuacao: "Saúde",
      valor: 0,
      status: "Pendente",
      prazoInicio: new Date().toISOString().split('T')[0],
      prazoFim: new Date().toISOString().split('T')[0],
      gnd: "4",
      municipio: municipio.nome
    }
    handleSaveEmendas([...emendas, newEmenda])
  }

  const handleEditEmenda = (emenda: DestinacaoEmenda) => {
    console.log("Edit emenda:", emenda)
    // Implementar modal de edição futuramente
  }

  const handleDeleteEmenda = (id: string) => {
    handleSaveEmendas(emendas.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-6 bg-background p-6">
      {/* Header */}
      <div className="bg-cyan-600 text-white rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{municipio.nome}</h1>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-lg">Região {municipio.regiao}</span>
        </div>
      </div>

      {/* Resultados Eleitorais */}
      <ResultadosEleitoraisManager 
        dadosPoliticos={dadosPoliticos}
        onSave={onSaveDadosPoliticos}
      />

      {/* Votação Histórica */}
      <VotacaoHistoricaManager 
        municipioId={municipio.id}
        dadosPoliticos={dadosPoliticos}
        onUpdateDados={onSaveDadosPoliticos}
      />

      {/* Deputados */}
      <div className="space-y-6">
        {/* Deputados Federais */}
        <DeputadosFederaisManager 
          deputadosFederais={deputadosFederais}
          onSave={onSaveDeputadosFederais}
        />

        {/* Deputados Estaduais */}
        <DeputadosEstaduaisManager 
          deputadosEstaduais={deputadosEstaduais}
          onSave={onSaveDeputadosEstaduais}
        />

        {/* Lideranças Municipais */}
        <LiderancasManager 
          liderancas={liderancas}
          onSave={onSaveLiderancas}
        />
      </div>

      {/* Obras e Equipamentos com Drag and Drop */}
      <SortableObras
        obras={obras}
        onSave={handleSaveObras}
        onAdd={handleAddObra}
        onEdit={handleEditObra}
        onDelete={handleDeleteObra}
      />

      {/* Emendas Parlamentares com Drag and Drop */}
      <SortableEmendas
        emendas={emendas}
        onSave={handleSaveEmendas}
        onAdd={handleAddEmenda}
        onEdit={handleEditEmenda}
        onDelete={handleDeleteEmenda}
      />

      {/* Histórico do Deputado - Movido para o final */}
      <HistoricoDeputadoManager
        acoes={historicoAcoes}
        municipioNome={municipio.nome}
        onSave={onSaveHistoricoAcoes}
      />
    </div>
  )
}

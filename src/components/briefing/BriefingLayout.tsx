
import { MapPin } from "lucide-react"
import { AcoesDeputado } from "./AcoesDeputado"
import { ResultadosEleitoraisManager } from "./ResultadosEleitoraisManager"
import { VotacaoHistoricaManager } from "./VotacaoHistoricaManager"
import { DeputadosFederaisManager } from "./DeputadosFederaisManager"
import { DeputadosEstaduaisManager } from "./DeputadosEstaduaisManager"
import { LiderancasManager } from "./LiderancasManager"
import { HistoricoDeputadoManager } from "./HistoricoDeputadoManager"
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

      {/* Ações do Deputado */}
      <AcoesDeputado municipioNome={municipio.nome} />

      {/* Histórico do Deputado - Movido para o final */}
      <HistoricoDeputadoManager
        acoes={historicoAcoes}
        municipioNome={municipio.nome}
        onSave={onSaveHistoricoAcoes}
      />
    </div>
  )
}

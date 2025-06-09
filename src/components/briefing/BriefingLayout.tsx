
import { MapPin, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="print-container space-y-6 bg-background p-6">
      {/* Header */}
      <div className="print-header bg-blue-600 text-white rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{municipio.nome}</h1>
          </div>
          <Button
            onClick={handlePrint}
            variant="secondary"
            size="sm"
            className="no-print"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-lg">Região {municipio.regiao}</span>
        </div>
      </div>

      {/* Print date header - only visible when printing */}
      <div className="print-only text-center text-sm text-muted-foreground mb-4">
        Briefing Municipal - Gerado em {new Date().toLocaleDateString('pt-BR')}
      </div>

      {/* Resultados Eleitorais */}
      <div className="print-section avoid-break">
        <ResultadosEleitoraisManager 
          dadosPoliticos={dadosPoliticos}
          onSave={onSaveDadosPoliticos}
        />
      </div>

      {/* Votação Histórica */}
      <div className="print-section avoid-break">
        <VotacaoHistoricaManager 
          municipioId={municipio.id}
          dadosPoliticos={dadosPoliticos}
          onUpdateDados={onSaveDadosPoliticos}
        />
      </div>

      {/* Deputados */}
      <div className="space-y-6">
        {/* Deputados Federais */}
        <div className="print-section avoid-break">
          <DeputadosFederaisManager 
            deputadosFederais={deputadosFederais}
            onSave={onSaveDeputadosFederais}
          />
        </div>

        {/* Deputados Estaduais */}
        <div className="print-section avoid-break">
          <DeputadosEstaduaisManager 
            deputadosEstaduais={deputadosEstaduais}
            onSave={onSaveDeputadosEstaduais}
          />
        </div>

        {/* Lideranças Municipais */}
        <div className="print-section avoid-break">
          <LiderancasManager 
            liderancas={liderancas}
            onSave={onSaveLiderancas}
          />
        </div>
      </div>

      {/* Painel de Resumo - AcoesDeputado */}
      <div className="print-section avoid-break">
        <AcoesDeputado 
          municipioNome={municipio.nome}
        />
      </div>

      {/* Histórico do Deputado - Movido para o final */}
      <div className="print-section avoid-break">
        <HistoricoDeputadoManager
          acoes={historicoAcoes}
          municipioNome={municipio.nome}
          onSave={onSaveHistoricoAcoes}
        />
      </div>
    </div>
  )
}

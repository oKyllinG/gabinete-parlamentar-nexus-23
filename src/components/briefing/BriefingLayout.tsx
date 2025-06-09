
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
    // Criar uma nova janela com apenas o conteúdo do briefing
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Obter o conteúdo HTML completo da seção print-container
    const printContent = document.querySelector('.print-container')
    if (!printContent) return

    // CSS específico para impressão
    const printCSS = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          background: white;
        }
        
        .print-container {
          max-width: 100%;
          padding: 20px;
        }
        
        .bg-primary {
          background-color: #1e40af !important;
          color: white !important;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .text-primary-foreground {
          color: white !important;
        }
        
        .bg-card {
          background-color: white !important;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .bg-muted {
          background-color: #f3f4f6 !important;
          padding: 12px;
          border-radius: 6px;
        }
        
        .text-lg {
          font-size: 16px;
          font-weight: bold;
        }
        
        .text-sm {
          font-size: 11px;
        }
        
        .text-xs {
          font-size: 10px;
        }
        
        .grid {
          display: grid;
        }
        
        .flex {
          display: flex;
        }
        
        .items-center {
          align-items: center;
        }
        
        .justify-between {
          justify-content: space-between;
        }
        
        .gap-2 {
          gap: 8px;
        }
        
        .gap-4 {
          gap: 16px;
        }
        
        .space-y-4 > * + * {
          margin-top: 16px;
        }
        
        .space-y-6 > * + * {
          margin-top: 24px;
        }
        
        .border {
          border: 1px solid #e5e7eb;
        }
        
        .rounded-lg {
          border-radius: 8px;
        }
        
        .p-4 {
          padding: 16px;
        }
        
        .p-6 {
          padding: 24px;
        }
        
        .mb-4 {
          margin-bottom: 16px;
        }
        
        .font-bold {
          font-weight: bold;
        }
        
        .font-semibold {
          font-weight: 600;
        }
        
        .no-print {
          display: none !important;
        }
        
        button {
          display: none !important;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 8px;
          border: 1px solid #3b82f6;
          border-radius: 4px;
          font-size: 10px;
          background-color: rgba(59, 130, 246, 0.1);
        }
        
        .w-20 {
          width: 80px;
        }
        
        .h-20 {
          height: 80px;
        }
        
        .rounded-full {
          border-radius: 50%;
        }
        
        .object-cover {
          object-fit: cover;
        }
      </style>
    `

    // Escrever o HTML completo na nova janela
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Briefing Municipal - ${municipio.nome}</title>
          <meta charset="utf-8">
          ${printCSS}
        </head>
        <body>
          <div class="print-container">
            <div style="text-align: center; margin-bottom: 20px;">
              <h1>Briefing Municipal - ${municipio.nome}</h1>
              <p>Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    
    // Aguardar um pouco para carregar e então imprimir
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  return (
    <div className="space-y-6 bg-background p-6 print-container">
      {/* Header */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6 border border-border print-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{municipio.nome}</h1>
          </div>
          <Button
            onClick={handlePrint}
            variant="secondary"
            size="sm"
            className="no-print bg-background text-foreground hover:bg-muted"
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
      <div className="print-section">
        <ResultadosEleitoraisManager 
          dadosPoliticos={dadosPoliticos}
          onSave={onSaveDadosPoliticos}
        />
      </div>

      {/* Votação Histórica */}
      <div className="print-section">
        <VotacaoHistoricaManager 
          municipioId={municipio.id}
          dadosPoliticos={dadosPoliticos}
          onUpdateDados={onSaveDadosPoliticos}
        />
      </div>

      {/* Deputados */}
      <div className="space-y-6">
        {/* Deputados Federais */}
        <div className="print-section">
          <DeputadosFederaisManager 
            deputadosFederais={deputadosFederais}
            onSave={onSaveDeputadosFederais}
          />
        </div>

        {/* Deputados Estaduais */}
        <div className="print-section">
          <DeputadosEstaduaisManager 
            deputadosEstaduais={deputadosEstaduais}
            onSave={onSaveDeputadosEstaduais}
          />
        </div>

        {/* Lideranças Municipais */}
        <div className="print-section">
          <LiderancasManager 
            liderancas={liderancas}
            onSave={onSaveLiderancas}
          />
        </div>
      </div>

      {/* Painel de Resumo - AcoesDeputado */}
      <div className="print-section">
        <AcoesDeputado 
          municipioNome={municipio.nome}
        />
      </div>

      {/* Histórico do Deputado - Movido para o final */}
      <div className="print-section">
        <HistoricoDeputadoManager
          acoes={historicoAcoes}
          municipioNome={municipio.nome}
          onSave={onSaveHistoricoAcoes}
        />
      </div>
    </div>
  )
}

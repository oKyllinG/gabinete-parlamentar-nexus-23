
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
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // Obter o conteúdo da seção print-container
    const printContent = document.querySelector('.print-container')
    if (!printContent) return

    // CSS completo para impressão com cores forçadas
    const printCSS = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Briefing Municipal - ${municipio.nome}</title>
          <style>
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            @page {
              size: A4;
              margin: 1cm;
            }
            
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #000;
              background: white;
              margin: 0;
              padding: 0;
            }
            
            /* Esconder elementos não printáveis */
            .no-print, button, [class*="no-print"] {
              display: none !important;
            }
            
            /* Container principal */
            .print-container {
              width: 100%;
              max-width: none;
              padding: 0;
              margin: 0;
            }
            
            /* Header principal com cor azul */
            .bg-primary {
              background-color: #1e40af !important;
              color: white !important;
              padding: 24px !important;
              border-radius: 8px !important;
              margin-bottom: 24px !important;
            }
            
            .text-primary-foreground {
              color: white !important;
            }
            
            /* Headers dos cards */
            .card-header-primary {
              background-color: #1e40af !important;
              color: white !important;
              padding: 16px 24px !important;
              border-top-left-radius: 8px !important;
              border-top-right-radius: 8px !important;
            }
            
            /* Cards */
            .card {
              border: 1px solid #e5e7eb !important;
              border-radius: 8px !important;
              margin-bottom: 24px !important;
              background: white !important;
              page-break-inside: avoid !important;
            }
            
            .card-content {
              padding: 24px !important;
            }
            
            /* Backgrounds */
            .bg-muted {
              background-color: #f9fafb !important;
              padding: 16px !important;
              border-radius: 8px !important;
              border: 1px solid #e5e7eb !important;
            }
            
            /* Badges */
            .badge {
              display: inline-block !important;
              padding: 4px 8px !important;
              border-radius: 4px !important;
              font-size: 12px !important;
              border: 1px solid #3b82f6 !important;
              background-color: rgba(59, 130, 246, 0.1) !important;
              color: #3b82f6 !important;
            }
            
            /* Texto */
            .text-foreground { color: #0f172a !important; }
            .text-muted-foreground { color: #64748b !important; }
            .text-primary { color: #1e40af !important; }
            .text-success { color: #16a34a !important; }
            .text-warning { color: #eab308 !important; }
            
            /* Layout */
            .grid { display: grid !important; }
            .flex { display: flex !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .gap-2 { gap: 8px !important; }
            .gap-3 { gap: 12px !important; }
            .gap-4 { gap: 16px !important; }
            .gap-6 { gap: 24px !important; }
            
            /* Spacing */
            .space-y-6 > * + * { margin-top: 24px !important; }
            .space-y-4 > * + * { margin-top: 16px !important; }
            .space-y-3 > * + * { margin-top: 12px !important; }
            .space-y-2 > * + * { margin-top: 8px !important; }
            
            .mb-2 { margin-bottom: 8px !important; }
            .mb-4 { margin-bottom: 16px !important; }
            .mb-6 { margin-bottom: 24px !important; }
            .pb-2 { padding-bottom: 8px !important; }
            
            /* Typography */
            .text-2xl { font-size: 24px !important; font-weight: bold !important; }
            .text-xl { font-size: 20px !important; }
            .text-lg { font-size: 18px !important; }
            .text-sm { font-size: 14px !important; }
            .text-xs { font-size: 12px !important; }
            
            .font-bold { font-weight: bold !important; }
            .font-semibold { font-weight: 600 !important; }
            
            /* Border */
            .border { border: 1px solid #e5e7eb !important; }
            .border-b { border-bottom: 1px solid #e5e7eb !important; }
            .rounded { border-radius: 4px !important; }
            .rounded-lg { border-radius: 8px !important; }
            
            /* Avatar e imagens */
            .w-20 { width: 80px !important; }
            .h-20 { height: 80px !important; }
            .w-1 { width: 4px !important; }
            .h-6 { height: 24px !important; }
            .bg-primary-foreground { background-color: white !important; }
            .rounded-full { border-radius: 50% !important; }
            
            /* Grid específico */
            .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
            .md\\:grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)) !important; }
            .md\\:col-span-1 { grid-column: span 1 / span 1 !important; }
            .md\\:col-span-2 { grid-column: span 2 / span 2 !important; }
            .md\\:col-span-3 { grid-column: span 3 / span 3 !important; }
            .md\\:col-span-4 { grid-column: span 4 / span 4 !important; }
            
            /* Tabelas */
            table { border-collapse: collapse !important; width: 100% !important; }
            th, td { border: 1px solid #e5e7eb !important; padding: 8px !important; text-align: left !important; }
            th { background-color: #f9fafb !important; font-weight: 600 !important; }
            
            /* Garantir visibilidade */
            h1, h2, h3, h4, h5, h6, p, div, span, td, th, li {
              display: block !important;
              visibility: visible !important;
              opacity: 1 !important;
            }
            
            /* Quebra de página */
            .print-section {
              page-break-inside: avoid !important;
              display: block !important;
              visibility: visible !important;
            }
          </style>
        </head>
        <body>
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">Briefing Municipal - ${municipio.nome}</h1>
            <p style="color: #666; font-size: 14px;">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `

    printWindow.document.write(printCSS)
    printWindow.document.close()
    
    // Aguardar carregamento e imprimir
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 1000)
  }

  return (
    <div className="space-y-6 bg-background p-6 print-container">
      {/* Header */}
      <div className="bg-blue-600 text-white rounded-lg p-6 border border-border print-header">
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


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

    // Obter todas as folhas de estilo da página atual
    const styleSheets = Array.from(document.styleSheets)
    let allCSS = ''

    try {
      styleSheets.forEach(sheet => {
        try {
          if (sheet.href || sheet.ownerNode) {
            const rules = Array.from(sheet.cssRules || sheet.rules || [])
            rules.forEach(rule => {
              allCSS += rule.cssText + '\n'
            })
          }
        } catch (e) {
          console.log('Could not access stylesheet:', e)
        }
      })
    } catch (e) {
      console.log('Error reading stylesheets:', e)
    }

    // CSS adicional específico para impressão com cores forçadas
    const additionalCSS = `
      body {
        font-family: Arial, sans-serif !important;
        font-size: 12px !important;
        line-height: 1.4 !important;
        color: #000 !important;
        background: white !important;
        margin: 0 !important;
        padding: 20px !important;
      }
      
      .print-container {
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      /* Forçar cores dos headers */
      .bg-primary, [class*="bg-primary"] {
        background-color: #1e40af !important;
        color: white !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      .text-primary-foreground {
        color: white !important;
      }
      
      /* Forçar cores dos cards */
      .bg-muted, [class*="bg-muted"] {
        background-color: #f3f4f6 !important;
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Esconder elementos não printáveis */
      .no-print, button, [class*="no-print"] {
        display: none !important;
        visibility: hidden !important;
      }
      
      /* Forçar bordas visíveis */
      .border, [class*="border"] {
        border: 1px solid #e5e7eb !important;
      }
      
      /* Badges */
      .badge, [class*="badge"] {
        border: 1px solid #3b82f6 !important;
        background-color: rgba(59, 130, 246, 0.1) !important;
        color: #3b82f6 !important;
        padding: 4px 8px !important;
        border-radius: 4px !important;
        display: inline-block !important;
      }
      
      /* Garantir que todas as cores sejam forçadas */
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `

    // Escrever o HTML completo na nova janela
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Briefing Municipal - ${municipio.nome}</title>
          <meta charset="utf-8">
          <style>
            ${allCSS}
            ${additionalCSS}
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
    `)

    printWindow.document.close()
    
    // Aguardar um pouco para carregar e então imprimir
    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 1000)
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


import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportDialogProps {
  obras: any[]
  onClose: () => void
}

export function ExportDialog({ obras, onClose }: ExportDialogProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf")
  const [includeFields, setIncludeFields] = useState({
    identificacao: true,
    financeiro: true,
    execucao: true,
    responsaveis: true,
    descricao: false
  })

  const campos = [
    { key: "identificacao", label: "Identificação (Nome, Município, Categoria)", default: true },
    { key: "financeiro", label: "Dados Financeiros", default: true },
    { key: "execucao", label: "Status e Execução", default: true },
    { key: "responsaveis", label: "Responsáveis", default: true },
    { key: "descricao", label: "Descrição e Justificativa", default: false }
  ]

  const handleExport = () => {
    if (obras.length === 0) {
      toast({
        title: "Nenhuma obra para exportar",
        description: "Não há obras para serem exportadas.",
        variant: "destructive"
      })
      return
    }

    const selectedFields = Object.entries(includeFields)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key)

    if (selectedFields.length === 0) {
      toast({
        title: "Selecione ao menos um campo",
        description: "Você deve selecionar pelo menos um campo para exportar.",
        variant: "destructive"
      })
      return
    }

    // Simular exportação
    setTimeout(() => {
      toast({
        title: "Exportação concluída",
        description: `${obras.length} obra(s) exportada(s) em formato ${exportFormat.toUpperCase()}.`
      })
      onClose()
    }, 1000)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const valorTotal = obras.reduce((sum, obra) => sum + (obra.valorTotal || 0), 0)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exportar Relatório de Obras</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumo da Exportação</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de obras:</span>
                <p className="font-medium">{obras.length}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor total:</span>
                <p className="font-medium">{formatCurrency(valorTotal)}</p>
              </div>
            </div>
          </div>

          {/* Formato */}
          <div>
            <Label className="text-base font-medium">Formato de Exportação</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  exportFormat === "pdf" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setExportFormat("pdf")}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div>
                    <h4 className="font-medium">PDF</h4>
                    <p className="text-sm text-muted-foreground">Relatório formatado</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  exportFormat === "csv" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => setExportFormat("csv")}
              >
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-medium">CSV</h4>
                    <p className="text-sm text-muted-foreground">Planilha de dados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Campos para incluir */}
          <div>
            <Label className="text-base font-medium">Campos a Incluir</Label>
            <div className="space-y-3 mt-3">
              {campos.map((campo) => (
                <div key={campo.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={campo.key}
                    checked={includeFields[campo.key as keyof typeof includeFields]}
                    onCheckedChange={(checked) =>
                      setIncludeFields({
                        ...includeFields,
                        [campo.key]: checked as boolean
                      })
                    }
                  />
                  <Label htmlFor={campo.key} className="text-sm font-normal cursor-pointer">
                    {campo.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preview das obras */}
          <div>
            <Label className="text-base font-medium">Obras a serem exportadas ({obras.length})</Label>
            <div className="mt-3 max-h-40 overflow-y-auto border rounded-lg">
              {obras.map((obra, index) => (
                <div key={obra.id || index} className="p-3 border-b last:border-b-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="font-medium text-sm">{obra.nome}</h5>
                      <p className="text-xs text-muted-foreground">
                        {obra.municipio} • {obra.categoria} • {obra.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(obra.valorTotal || 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {obra.percentualExecucao || 0}% concluído
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Exportar {exportFormat.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

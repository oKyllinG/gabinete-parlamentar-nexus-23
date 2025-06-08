
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { exportObras } from "@/utils/exportUtils"

interface ExportDialogProps {
  obras: any[]
  onClose: () => void
}

export function ExportDialog({ obras, onClose }: ExportDialogProps) {
  const { toast } = useToast()
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("csv")
  const [includeFields, setIncludeFields] = useState({
    identificacao: true,
    financeiro: true,
    execucao: true,
    responsaveis: true,
    descricao: false
  })

  // Filtros
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedCategoria, setSelectedCategoria] = useState<string>("all")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")

  const campos = [
    { key: "identificacao", label: "Identificação (Nome, Município, Categoria)", default: true },
    { key: "financeiro", label: "Dados Financeiros", default: true },
    { key: "execucao", label: "Status e Execução", default: true },
    { key: "responsaveis", label: "Responsáveis", default: true },
    { key: "descricao", label: "Descrição e Justificativa", default: false }
  ]

  // Obter valores únicos para os filtros
  const municipios = [...new Set(obras.map(obra => obra.municipio))].sort()
  const status = [...new Set(obras.map(obra => obra.status))].sort()
  const categorias = [...new Set(obras.map(obra => obra.categoria))].sort()
  const areas = [...new Set(obras.map(obra => obra.area))].sort()

  // Filtrar obras com base nos filtros selecionados
  const getFilteredObras = () => {
    let filtered = obras;
    
    if (selectedMunicipio !== "all") {
      filtered = filtered.filter(obra => obra.municipio === selectedMunicipio)
    }
    
    if (selectedStatus !== "all") {
      filtered = filtered.filter(obra => obra.status === selectedStatus)
    }
    
    if (selectedCategoria !== "all") {
      filtered = filtered.filter(obra => obra.categoria === selectedCategoria)
    }
    
    if (selectedArea !== "all") {
      filtered = filtered.filter(obra => obra.area === selectedArea)
    }
    
    if (startDate) {
      filtered = filtered.filter(obra => 
        obra.dataInicio && new Date(obra.dataInicio) >= new Date(startDate)
      )
    }
    
    if (endDate) {
      filtered = filtered.filter(obra => 
        obra.dataTermino && new Date(obra.dataTermino) <= new Date(endDate)
      )
    }
    
    return filtered
  }

  const filteredObras = getFilteredObras()

  const handleExport = () => {
    if (filteredObras.length === 0) {
      toast({
        title: "Nenhuma obra para exportar",
        description: "Não há obras que atendam aos filtros selecionados.",
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

    // Exportar usando a função real
    exportObras(
      filteredObras,
      selectedMunicipio !== "all" ? selectedMunicipio : undefined,
      selectedStatus !== "all" ? selectedStatus : undefined,
      selectedCategoria !== "all" ? selectedCategoria : undefined,
      selectedArea !== "all" ? selectedArea : undefined,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    )

    toast({
      title: "Exportação concluída",
      description: `${filteredObras.length} obra(s) exportada(s) em formato ${exportFormat.toUpperCase()}.`
    })
    onClose()
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const valorTotal = filteredObras.reduce((sum, obra) => sum + (obra.valorTotal || 0), 0)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Exportar Relatório de Obras</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Filtros */}
          <div className="border rounded-lg p-4 space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Filtros de Exportação
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm">Município</Label>
                <Select value={selectedMunicipio} onValueChange={setSelectedMunicipio}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os municípios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os municípios</SelectItem>
                    {municipios.map(municipio => (
                      <SelectItem key={municipio} value={municipio}>{municipio}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Status</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    {status.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Categoria</Label>
                <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categorias.map(categoria => (
                      <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Área</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as áreas</SelectItem>
                    {areas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm">Data Início</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm">Data Término</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Resumo da Exportação</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total de obras:</span>
                <p className="font-medium">{filteredObras.length}</p>
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

          {/* Preview das obras filtradas */}
          <div>
            <Label className="text-base font-medium">Obras a serem exportadas ({filteredObras.length})</Label>
            {filteredObras.length > 0 ? (
              <div className="mt-3 max-h-40 overflow-y-auto border rounded-lg">
                {filteredObras.map((obra, index) => (
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
            ) : (
              <div className="mt-3 p-4 text-center text-muted-foreground border rounded-lg">
                Nenhuma obra encontrada com os filtros selecionados
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={filteredObras.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar {exportFormat.toUpperCase()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, FileText, Download, Building, Construction, Pause, CheckCircle } from "lucide-react"
import { ObraForm } from "@/components/obras/ObraForm"
import { CategoriaManager } from "@/components/obras/CategoriaManager"
import { ExportDialog } from "@/components/obras/ExportDialog"

interface Obra {
  id: string
  nome: string
  municipio: string
  categoria: string // Programa (PAC, etc.)
  area: string // Saúde, Infraestrutura, etc.
  status: "Em Planejamento" | "Em Execução" | "Paralisada" | "Concluída"
  valorTotal: number
  percentualExecucao: number
  dataInicio?: string
  dataTermino?: string
  responsavelGabinete: string
}

const mockObras: Obra[] = [
  {
    id: "1",
    nome: "Construção do Centro de Saúde Municipal",
    municipio: "São Paulo",
    categoria: "PAC",
    area: "Saúde",
    status: "Em Execução",
    valorTotal: 2500000,
    percentualExecucao: 65,
    dataInicio: "2024-01-15",
    dataTermino: "2024-12-20",
    responsavelGabinete: "Ana Silva"
  },
  {
    id: "2", 
    nome: "Revitalização da Praça Central",
    municipio: "Campinas",
    categoria: "Emenda Parlamentar",
    area: "Infraestrutura",
    status: "Concluída",
    valorTotal: 800000,
    percentualExecucao: 100,
    dataInicio: "2023-08-10",
    dataTermino: "2024-02-15",
    responsavelGabinete: "Carlos Santos"
  },
  {
    id: "3",
    nome: "Ampliação da Escola Municipal",
    municipio: "Santos",
    categoria: "FNDE",
    area: "Educação",
    status: "Paralisada",
    valorTotal: 1200000,
    percentualExecucao: 30,
    dataInicio: "2024-03-01",
    responsavelGabinete: "Maria Costa"
  },
  {
    id: "4",
    nome: "Ponte sobre o Rio Verde",
    municipio: "Ribeirão Preto",
    categoria: "PAC",
    area: "Infraestrutura",
    status: "Em Planejamento",
    valorTotal: 5000000,
    percentualExecucao: 0,
    responsavelGabinete: "João Oliveira"
  }
]

const ObrasEquipamentos = () => {
  const [obras, setObras] = useState<Obra[]>(mockObras)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all")
  const [areaFilter, setAreaFilter] = useState<string>("all")
  const [showObraForm, setShowObraForm] = useState(false)
  const [showCategoriaManager, setShowCategoriaManager] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [editingObra, setEditingObra] = useState<Obra | null>(null)

  const filteredObras = obras.filter(obra => {
    const matchesSearch = obra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.municipio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || obra.status === statusFilter
    const matchesCategoria = categoriaFilter === "all" || obra.categoria === categoriaFilter
    const matchesArea = areaFilter === "all" || obra.area === areaFilter
    return matchesSearch && matchesStatus && matchesCategoria && matchesArea
  })

  // Calcular estatísticas das obras filtradas em vez de todas as obras
  const stats = {
    total: filteredObras.length,
    emExecucao: filteredObras.filter(o => o.status === "Em Execução").length,
    paralisadas: filteredObras.filter(o => o.status === "Paralisada").length,
    concluidas: filteredObras.filter(o => o.status === "Concluída").length,
    valorTotal: filteredObras.reduce((sum, obra) => sum + obra.valorTotal, 0)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Execução": return "bg-blue-100 text-blue-800"
      case "Paralisada": return "bg-red-100 text-red-800"
      case "Concluída": return "bg-green-100 text-green-800"
      case "Em Planejamento": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Execução": return <Construction className="w-4 h-4" />
      case "Paralisada": return <Pause className="w-4 h-4" />
      case "Concluída": return <CheckCircle className="w-4 h-4" />
      case "Em Planejamento": return <Building className="w-4 h-4" />
      default: return <Building className="w-4 h-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleEditObra = (obra: Obra) => {
    setEditingObra(obra)
    setShowObraForm(true)
  }

  const handleNewObra = () => {
    setEditingObra(null)
    setShowObraForm(true)
  }

  // Get unique values for filters
  const categorias = [...new Set(obras.map(obra => obra.categoria))].sort()
  const areas = [...new Set(obras.map(obra => obra.area))].sort()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Obras e Equipamentos</h1>
          <p className="text-muted-foreground">Gerencie obras públicas e equipamentos</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCategoriaManager(true)}
          >
            <Building className="w-4 h-4 mr-2" />
            Categorias
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowExportDialog(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={handleNewObra}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Obra
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Obras</CardTitle>
            <Building className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            {(searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all") && (
              <p className="text-xs text-muted-foreground">filtradas</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Execução</CardTitle>
            <Construction className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.emExecucao}</div>
            {(searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all") && (
              <p className="text-xs text-muted-foreground">filtradas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paralisadas</CardTitle>
            <Pause className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.paralisadas}</div>
            {(searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all") && (
              <p className="text-xs text-muted-foreground">filtradas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.concluidas}</div>
            {(searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all") && (
              <p className="text-xs text-muted-foreground">filtradas</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{formatCurrency(stats.valorTotal)}</div>
            {(searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all") && (
              <p className="text-xs text-muted-foreground">filtrado</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome da obra ou município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Em Planejamento">Em Planejamento</SelectItem>
            <SelectItem value="Em Execução">Em Execução</SelectItem>
            <SelectItem value="Paralisada">Paralisada</SelectItem>
            <SelectItem value="Concluída">Concluída</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Categorias</SelectItem>
            {categorias.map(categoria => (
              <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={areaFilter} onValueChange={setAreaFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Áreas</SelectItem>
            {areas.map(area => (
              <SelectItem key={area} value={area}>{area}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Obras List */}
      <div className="grid gap-4">
        {filteredObras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{obra.nome}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{obra.municipio}</Badge>
                    <Badge variant="outline">{obra.categoria}</Badge>
                    <Badge variant="outline">{obra.area}</Badge>
                    <Badge className={getStatusColor(obra.status)}>
                      {getStatusIcon(obra.status)}
                      <span className="ml-1">{obra.status}</span>
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditObra(obra)}
                >
                  Editar
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Valor Total:</span>
                  <p className="font-medium">{formatCurrency(obra.valorTotal)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Execução:</span>
                  <p className="font-medium">{obra.percentualExecucao}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Responsável:</span>
                  <p className="font-medium">{obra.responsavelGabinete}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Previsão:</span>
                  <p className="font-medium">
                    {obra.dataTermino ? new Date(obra.dataTermino).toLocaleDateString('pt-BR') : 'Não definida'}
                  </p>
                </div>
              </div>

              {obra.percentualExecucao > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso da Obra</span>
                    <span>{obra.percentualExecucao}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${obra.percentualExecucao}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredObras.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma obra encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || categoriaFilter !== "all" || areaFilter !== "all"
                ? "Tente ajustar os filtros ou fazer uma nova busca" 
                : "Comece cadastrando sua primeira obra"}
            </p>
            {!searchTerm && statusFilter === "all" && categoriaFilter === "all" && areaFilter === "all" && (
              <Button onClick={handleNewObra}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Obra
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      {showObraForm && (
        <ObraForm
          obra={editingObra}
          onClose={() => {
            setShowObraForm(false)
            setEditingObra(null)
          }}
          onSave={(novaObraData) => {
            // Calcular valorTotal a partir das fontes de recurso
            const valorTotal = novaObraData.fontesRecurso?.reduce((sum, fonte) => sum + (fonte.valor || 0), 0) || 0
            
            const novaObra: Obra = {
              id: editingObra?.id || Date.now().toString(),
              nome: novaObraData.nome,
              municipio: novaObraData.municipio,
              categoria: novaObraData.categoria,
              area: novaObraData.area || novaObraData.categoria, // Fallback para compatibilidade
              status: novaObraData.status,
              valorTotal: valorTotal,
              percentualExecucao: novaObraData.percentualExecucao,
              dataInicio: novaObraData.dataInicioEfetiva || novaObraData.dataInicioPrevista,
              dataTermino: novaObraData.dataTerminoPrevista,
              responsavelGabinete: novaObraData.responsavelGabinete
            }

            if (editingObra) {
              setObras(obras.map(o => o.id === editingObra.id ? novaObra : o))
            } else {
              setObras([...obras, novaObra])
            }
            setShowObraForm(false)
            setEditingObra(null)
          }}
        />
      )}

      {showCategoriaManager && (
        <CategoriaManager
          onClose={() => setShowCategoriaManager(false)}
        />
      )}

      {showExportDialog && (
        <ExportDialog
          obras={filteredObras}
          onClose={() => setShowExportDialog(false)}
        />
      )}
    </div>
  )
}

export default ObrasEquipamentos

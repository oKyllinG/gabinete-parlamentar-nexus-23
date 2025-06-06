
import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { FileText, Plus, Search, Calendar, User, Building, FileCheck, Eye, Edit, Trash2, ChevronUp, ChevronDown, Filter, Download, Paperclip } from "lucide-react"
import { OficioForm } from "@/components/oficios/OficioForm"

type SortField = 'numero' | 'data' | 'tipo' | 'status' | 'assunto' | 'municipio'
type SortDirection = 'asc' | 'desc'

export default function Oficios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null })
  const [selectedOficio, setSelectedOficio] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("todos")
  const [sortField, setSortField] = useState<SortField>('data')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Mock data para demonstração
  const oficios = [
    {
      id: 1,
      numero: "253/2025/CG",
      data: "2025-05-10",
      dataFormatada: "10/05/2025",
      tipo: "enviado",
      status: "protocolado",
      assunto: "SOLICITAÇÃO DE CONSTRUÇÃO DE ESCOLA NA REGIÃO SUL DE DOURADOS/MS, NO BAIRRO ESPLANADA",
      destinatario: "Marçal Gonçalves Leite Filho - Prefeito",
      orgao: "Prefeitura Municipal",
      municipio: "Dourados",
      responsavel: "Leonardo Silva",
      protocolo: "2025001234",
      temArquivo: true,
      temProtocolo: true
    },
    {
      id: 2,
      numero: "OF/2025/002",
      data: "2025-05-08",
      dataFormatada: "08/05/2025",
      tipo: "recebido",
      status: "pendente",
      assunto: "Resposta sobre infraestrutura urbana no centro da cidade",
      origem: "Secretaria de Obras Municipal",
      orgao: "Prefeitura Municipal",
      municipio: "Campo Grande",
      responsavel: "Maria Silva",
      protocolo: null,
      temArquivo: true,
      temProtocolo: false
    },
    {
      id: 3,
      numero: "CONV/2025/001",
      data: "2025-05-12",
      dataFormatada: "12/05/2025",
      tipo: "convite",
      status: "aceito",
      assunto: "Convite para Audiência Pública sobre Meio Ambiente e Sustentabilidade",
      origem: "Câmara Municipal",
      orgao: "Câmara Municipal",
      municipio: "Três Lagoas",
      responsavel: "João Santos",
      evento: "Audiência Pública",
      dataEvento: "20/05/2025",
      temArquivo: true,
      temProtocolo: false
    },
    {
      id: 4,
      numero: "254/2025/CG",
      data: "2025-05-15",
      dataFormatada: "15/05/2025",
      tipo: "enviado",
      status: "enviado",
      assunto: "PEDIDO DE INFORMAÇÕES SOBRE OBRAS DE SANEAMENTO",
      destinatario: "João Carlos Silva - Secretário",
      orgao: "Secretaria de Infraestrutura",
      municipio: "Corumbá",
      responsavel: "Ana Paula",
      protocolo: null,
      temArquivo: true,
      temProtocolo: false
    }
  ]

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  const sortedOficios = useMemo(() => {
    const sorted = [...oficios].sort((a, b) => {
      let aValue, bValue
      
      switch (sortField) {
        case 'numero':
          aValue = a.numero
          bValue = b.numero
          break
        case 'data':
          aValue = new Date(a.data)
          bValue = new Date(b.data)
          break
        case 'tipo':
          aValue = a.tipo
          bValue = b.tipo
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'assunto':
          aValue = a.assunto
          bValue = b.assunto
          break
        case 'municipio':
          aValue = a.municipio
          bValue = b.municipio
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [sortField, sortDirection])

  const getStatusBadge = (status: string) => {
    const statusMap = {
      protocolado: { label: "Protocolado", className: "bg-blue-50 text-blue-700 border border-blue-200" },
      pendente: { label: "Pendente", className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
      aceito: { label: "Aceito", className: "bg-green-50 text-green-700 border border-green-200" },
      enviado: { label: "Enviado", className: "bg-gray-50 text-gray-700 border border-gray-200" }
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, className: "bg-gray-50 text-gray-700 border border-gray-200" }
    return (
      <Badge variant="outline" className={`font-medium ${statusInfo.className}`}>
        {statusInfo.label}
      </Badge>
    )
  }

  const getTipoBadge = (tipo: string) => {
    const tipoMap = {
      enviado: { label: "Enviado", className: "bg-blue-50 text-blue-700 border border-blue-200" },
      recebido: { label: "Recebido", className: "bg-green-50 text-green-700 border border-green-200" },
      convite: { label: "Convite", className: "bg-purple-50 text-purple-700 border border-purple-200" }
    }
    const tipoInfo = tipoMap[tipo as keyof typeof tipoMap] || { label: tipo, className: "bg-gray-50 text-gray-700 border border-gray-200" }
    return (
      <Badge variant="outline" className={`font-medium ${tipoInfo.className}`}>
        {tipoInfo.label}
      </Badge>
    )
  }

  const filteredOficios = sortedOficios.filter(oficio => {
    const matchesSearch = oficio.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oficio.assunto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oficio.municipio.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "todos") return matchesSearch
    if (activeTab === "enviados") return matchesSearch && oficio.tipo === "enviado"
    if (activeTab === "recebidos") return matchesSearch && oficio.tipo === "recebido"
    if (activeTab === "convites") return matchesSearch && oficio.tipo === "convite"
    if (activeTab === "protocolados") return matchesSearch && oficio.status === "protocolado"
    
    return matchesSearch
  })

  const handleView = (oficio: any) => {
    setSelectedOficio(oficio)
    setIsViewOpen(true)
  }

  const handleEdit = (oficio: any) => {
    setSelectedOficio(oficio)
    setIsEditOpen(true)
  }

  const handleDelete = (id: number) => {
    setDeleteDialog({ open: true, id })
  }

  const confirmDelete = () => {
    // Aqui seria implementada a lógica de exclusão
    console.log('Excluindo ofício:', deleteDialog.id)
    setDeleteDialog({ open: false, id: null })
  }

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "todos": return oficios.length
      case "enviados": return oficios.filter(o => o.tipo === "enviado").length
      case "recebidos": return oficios.filter(o => o.tipo === "recebido").length
      case "convites": return oficios.filter(o => o.tipo === "convite").length
      case "protocolados": return oficios.filter(o => o.status === "protocolado").length
      default: return 0
    }
  }

  const handleDownloadFile = (oficio: any, tipo: 'arquivo' | 'protocolo') => {
    // Aqui seria implementada a lógica de download
    console.log(`Baixando ${tipo} do ofício:`, oficio.numero)
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Ofícios</p>
                <p className="text-2xl font-bold text-foreground">{oficios.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Protocolados</p>
                <p className="text-2xl font-bold text-foreground">{getTabCount("protocolados")}</p>
              </div>
              <FileCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{oficios.filter(o => o.status === "pendente").length}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
                <p className="text-2xl font-bold text-foreground">{oficios.filter(o => new Date(o.data).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <Building className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header da página */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestão de Ofícios</h1>
          <p className="text-muted-foreground">Gerencie os ofícios enviados, recebidos e convites</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4" />
                Novo Ofício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Novo Ofício</DialogTitle>
                <DialogDescription>
                  Cadastre os ofícios enviados, recebidos ou convites
                </DialogDescription>
              </DialogHeader>
              <OficioForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros e busca */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar por número, assunto ou município..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-primary"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs e conteúdo principal */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 bg-muted/50">
              <TabsTrigger value="todos" className="data-[state=active]:bg-white">
                Todos ({getTabCount("todos")})
              </TabsTrigger>
              <TabsTrigger value="enviados" className="data-[state=active]:bg-white">
                Enviados ({getTabCount("enviados")})
              </TabsTrigger>
              <TabsTrigger value="recebidos" className="data-[state=active]:bg-white">
                Recebidos ({getTabCount("recebidos")})
              </TabsTrigger>
              <TabsTrigger value="convites" className="data-[state=active]:bg-white">
                Convites ({getTabCount("convites")})
              </TabsTrigger>
              <TabsTrigger value="protocolados" className="data-[state=active]:bg-white">
                Protocolados ({getTabCount("protocolados")})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-muted/50">
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('numero')}
                      >
                        <div className="flex items-center gap-2">
                          Número
                          {getSortIcon('numero')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('data')}
                      >
                        <div className="flex items-center gap-2">
                          Data
                          {getSortIcon('data')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('tipo')}
                      >
                        <div className="flex items-center gap-2">
                          Tipo
                          {getSortIcon('tipo')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('status')}
                      >
                        <div className="flex items-center gap-2">
                          Status
                          {getSortIcon('status')}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('assunto')}
                      >
                        <div className="flex items-center gap-2">
                          Assunto
                          {getSortIcon('assunto')}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Origem/Destino</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-muted/70 font-semibold"
                        onClick={() => handleSort('municipio')}
                      >
                        <div className="flex items-center gap-2">
                          Município
                          {getSortIcon('municipio')}
                        </div>
                      </TableHead>
                      <TableHead className="font-semibold">Anexos</TableHead>
                      <TableHead className="font-semibold text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOficios.map((oficio) => (
                      <TableRow key={oficio.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span className="font-mono text-sm">{oficio.numero}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{oficio.dataFormatada}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getTipoBadge(oficio.tipo)}</TableCell>
                        <TableCell>{getStatusBadge(oficio.status)}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate font-medium" title={oficio.assunto}>
                            {oficio.assunto}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Resp: {oficio.responsavel}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-2">
                            {oficio.tipo === "enviado" ? (
                              <User className="w-4 h-4 text-muted-foreground mt-0.5" />
                            ) : (
                              <Building className="w-4 h-4 text-muted-foreground mt-0.5" />
                            )}
                            <div className="text-sm">
                              <div className="font-medium">
                                {oficio.tipo === "enviado" ? oficio.destinatario : oficio.origem}
                              </div>
                              <div className="text-xs text-muted-foreground">{oficio.orgao}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                            <Building className="w-3 h-3" />
                            {oficio.municipio}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {oficio.temArquivo && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadFile(oficio, 'arquivo')}
                                className="h-7 px-2 text-xs bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                              >
                                <Paperclip className="w-3 h-3 mr-1" />
                                Arquivo
                              </Button>
                            )}
                            {oficio.temProtocolo && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadFile(oficio, 'protocolo')}
                                className="h-7 px-2 text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              >
                                <FileCheck className="w-3 h-3 mr-1" />
                                Protocolo
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 justify-center">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleView(oficio)}
                              className="hover:bg-blue-100 hover:text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEdit(oficio)}
                              className="hover:bg-green-100 hover:text-green-600"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(oficio.id)}
                              className="hover:bg-red-100 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filteredOficios.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Nenhum ofício encontrado</p>
                    <p className="text-sm">Ajuste os filtros ou adicione novos ofícios</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>

      {/* Dialog de visualização */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Ofício</DialogTitle>
          </DialogHeader>
          {selectedOficio && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número</label>
                  <p className="font-mono">{selectedOficio.numero}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data</label>
                  <p>{selectedOficio.dataFormatada}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assunto</label>
                <p className="mt-1">{selectedOficio.assunto}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo</label>
                  <div className="mt-1">{getTipoBadge(selectedOficio.tipo)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedOficio.status)}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Ofício</DialogTitle>
          </DialogHeader>
          <OficioForm 
            oficio={selectedOficio}
            onClose={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, id: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O ofício será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

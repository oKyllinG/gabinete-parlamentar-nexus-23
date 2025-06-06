
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FileText, Plus, Search, Calendar, User, Building, FileCheck, Eye, Edit, Trash2 } from "lucide-react"
import { OficioForm } from "@/components/oficios/OficioForm"

export default function Oficios() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("todos")

  // Mock data para demonstração
  const oficios = [
    {
      id: 1,
      numero: "253/2025/CG",
      data: "10/05/2025",
      tipo: "enviado",
      status: "protocolado",
      assunto: "SOLICITAÇÃO DE CONSTRUÇÃO DE ESCOLA NA REGIÃO SUL DE DOURADOS/MS, NO BAIRRO ESPLANADA",
      destinatario: "Marçal Gonçalves Leite Filho - Prefeito (Prefeitura)",
      municipio: "Dourados",
      responsavel: "Leonardo"
    },
    {
      id: 2,
      numero: "OF/2025/002",
      data: "08/05/2025",
      tipo: "recebido",
      status: "pendente",
      assunto: "Resposta sobre infraestrutura urbana",
      origem: "Secretaria de Obras Municipal",
      municipio: "Campo Grande",
      responsavel: "Maria Silva"
    },
    {
      id: 3,
      numero: "CONV/2025/001",
      data: "12/05/2025",
      tipo: "convite",
      status: "aceito",
      assunto: "Convite para Audiência Pública sobre Meio Ambiente",
      origem: "Câmara Municipal",
      municipio: "Três Lagoas",
      responsavel: "João Santos"
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusMap = {
      protocolado: { label: "Protocolado", variant: "default" as const },
      pendente: { label: "Pendente", variant: "destructive" as const },
      aceito: { label: "Aceito", variant: "secondary" as const },
      enviado: { label: "Enviado", variant: "outline" as const }
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: "outline" as const }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const getTipoBadge = (tipo: string) => {
    const tipoMap = {
      enviado: { label: "Enviado", icon: "↗️" },
      recebido: { label: "Recebido", icon: "↙️" },
      convite: { label: "Convite", icon: "📅" }
    }
    const tipoInfo = tipoMap[tipo as keyof typeof tipoMap] || { label: tipo, icon: "📄" }
    return <span className="flex items-center gap-1 text-sm text-muted-foreground">{tipoInfo.icon} {tipoInfo.label}</span>
  }

  const filteredOficios = oficios.filter(oficio => {
    const matchesSearch = oficio.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         oficio.assunto.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === "todos") return matchesSearch
    if (activeTab === "enviados") return matchesSearch && oficio.tipo === "enviado"
    if (activeTab === "recebidos") return matchesSearch && oficio.tipo === "recebido"
    if (activeTab === "convites") return matchesSearch && oficio.tipo === "convite"
    if (activeTab === "protocolados") return matchesSearch && oficio.status === "protocolado"
    
    return matchesSearch
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Ofícios</h1>
          <p className="text-muted-foreground">Gerencie os ofícios enviados e recebidos</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Relatório
          </Button>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Registrar Ofício
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Registrar Novo Ofício</DialogTitle>
                <DialogDescription>
                  Cadastre os ofícios enviados ou recebidos
                </DialogDescription>
              </DialogHeader>
              <OficioForm onClose={() => setIsFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Pesquisar ofícios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="enviados">Enviados</TabsTrigger>
              <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
              <TabsTrigger value="convites">Convites</TabsTrigger>
              <TabsTrigger value="protocolados">Protocolados</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assunto</TableHead>
                    <TableHead>Origem/Destino</TableHead>
                    <TableHead>Município</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOficios.map((oficio) => (
                    <TableRow key={oficio.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          {oficio.numero}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          {oficio.data}
                        </div>
                      </TableCell>
                      <TableCell>{getTipoBadge(oficio.tipo)}</TableCell>
                      <TableCell>{getStatusBadge(oficio.status)}</TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={oficio.assunto}>
                          {oficio.assunto}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {oficio.tipo === "enviado" ? (
                            <>
                              <User className="w-4 h-4 text-muted-foreground" />
                              {oficio.destinatario}
                            </>
                          ) : (
                            <>
                              <Building className="w-4 h-4 text-muted-foreground" />
                              {oficio.origem}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{oficio.municipio}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          {oficio.status === "protocolado" && (
                            <Button variant="ghost" size="sm">
                              <FileCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredOficios.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum ofício encontrado
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardHeader>
      </Card>
    </div>
  )
}

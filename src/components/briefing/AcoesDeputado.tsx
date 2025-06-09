
import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, FileText, Wrench, Building, Target, Plus, GripVertical, Edit, Trash2 } from "lucide-react"
import { getObrasByMunicipio, getDestinacoesByMunicipio, type Obra, type DestinacaoEmenda } from "@/utils/briefingDataUtils"

// Sortable Obra Item Component
const SortableObraItem = ({ obra, onEdit, onDelete }: { obra: Obra, onEdit: (obra: Obra) => void, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: obra.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
      case 'concluida':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'em andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'planejada':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <button
          {...listeners}
          className="mt-1 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h5 className="font-semibold text-gray-900 text-sm leading-tight flex-1 pr-2">
              {obra.titulo}
            </h5>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge className={`text-xs ${getStatusColor(obra.status)}`}>
                {obra.status}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onEdit(obra)} className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(obra.id)} className="h-6 w-6 p-0 text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {obra.descricao}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-semibold text-green-700">{formatCurrency(obra.valor)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span>Início: {formatDate(obra.dataInicio)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>Prazo: {formatDate(obra.prazoExecucao)}</span>
            </div>
          </div>
          
          {obra.observacoes && (
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Obs:</strong> {obra.observacoes}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sortable Emenda Item Component
const SortableEmendaItem = ({ destinacao, onEdit, onDelete }: { destinacao: DestinacaoEmenda, onEdit: (destinacao: DestinacaoEmenda) => void, onDelete: (id: string) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: destinacao.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovada':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'pendente':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start gap-3">
        <button
          {...listeners}
          className="mt-1 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing flex-shrink-0"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                  {destinacao.numero}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                {destinacao.objeto}
              </h4>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Badge className={`text-xs ${getStatusColor(destinacao.status)}`}>
                {destinacao.status}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onEdit(destinacao)} className="h-6 w-6 p-0">
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(destinacao.id)} className="h-6 w-6 p-0 text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <span className="font-medium">{destinacao.destinatario}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Wrench className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="font-medium">{destinacao.areaAtuacao}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="font-semibold text-green-700">{formatCurrency(destinacao.valor)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
              <span>Início: {formatDate(destinacao.prazoInicio)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-red-500 flex-shrink-0" />
              <span>Prazo: {formatDate(destinacao.prazoFim)}</span>
            </div>

            {destinacao.gnd && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span>GND: {destinacao.gnd}</span>
              </div>
            )}
          </div>
          
          {destinacao.observacoes && (
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Obs:</strong> {destinacao.observacoes}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface AcoesDeputadoProps {
  municipioNome: string
}

export const AcoesDeputado = ({ municipioNome }: AcoesDeputadoProps) => {
  const [obras, setObras] = useState<Obra[]>([])
  const [destinacoes, setDestinacoes] = useState<DestinacaoEmenda[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load data from localStorage
  useEffect(() => {
    const obrasData = getObrasByMunicipio(municipioNome)
    const emendasData = getDestinacoesByMunicipio(municipioNome)
    setObras(obrasData)
    setDestinacoes(emendasData)
  }, [municipioNome])

  const handleObrasDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = obras.findIndex(item => item.id === active.id)
      const newIndex = obras.findIndex(item => item.id === over.id)
      const newOrder = arrayMove(obras, oldIndex, newIndex)
      setObras(newOrder)
      localStorage.setItem(`obras-${municipioNome}`, JSON.stringify(newOrder))
    }
  }

  const handleEmendasDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = destinacoes.findIndex(item => item.id === active.id)
      const newIndex = destinacoes.findIndex(item => item.id === over.id)
      const newOrder = arrayMove(destinacoes, oldIndex, newIndex)
      setDestinacoes(newOrder)
      localStorage.setItem(`destinacoes-${municipioNome}`, JSON.stringify(newOrder))
    }
  }

  const handleAddObra = () => {
    const newObra: Obra = {
      id: `obra-${Date.now()}`,
      titulo: "Nova Obra",
      descricao: "Descrição da obra",
      valor: 0,
      status: "Planejada",
      categoria: "Infraestrutura",
      dataInicio: new Date().toISOString().split('T')[0],
      prazoExecucao: new Date().toISOString().split('T')[0],
      municipio: municipioNome
    }
    const newObras = [...obras, newObra]
    setObras(newObras)
    localStorage.setItem(`obras-${municipioNome}`, JSON.stringify(newObras))
  }

  const handleAddEmenda = () => {
    const newEmenda: DestinacaoEmenda = {
      id: `emenda-${Date.now()}`,
      numero: `${Date.now()}`,
      objeto: "Nova emenda parlamentar",
      destinatario: "Prefeitura Municipal",
      areaAtuacao: "Saúde",
      valor: 0,
      status: "Pendente",
      prazoInicio: new Date().toISOString().split('T')[0],
      prazoFim: new Date().toISOString().split('T')[0],
      gnd: "4",
      municipio: municipioNome
    }
    const newEmendas = [...destinacoes, newEmenda]
    setDestinacoes(newEmendas)
    localStorage.setItem(`destinacoes-${municipioNome}`, JSON.stringify(newEmendas))
  }

  const handleEditObra = (obra: Obra) => {
    console.log("Edit obra:", obra)
    // Future implementation
  }

  const handleEditEmenda = (emenda: DestinacaoEmenda) => {
    console.log("Edit emenda:", emenda)
    // Future implementation
  }

  const handleDeleteObra = (id: string) => {
    const newObras = obras.filter(o => o.id !== id)
    setObras(newObras)
    localStorage.setItem(`obras-${municipioNome}`, JSON.stringify(newObras))
  }

  const handleDeleteEmenda = (id: string) => {
    const newEmendas = destinacoes.filter(e => e.id !== id)
    setDestinacoes(newEmendas)
    localStorage.setItem(`destinacoes-${municipioNome}`, JSON.stringify(newEmendas))
  }

  // Agrupar obras por categoria
  const obrasPorCategoria = obras.reduce((acc, obra) => {
    const categoria = obra.categoria || 'Outras'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(obra)
    return acc
  }, {} as Record<string, Obra[]>)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (obras.length === 0 && destinacoes.length === 0) {
    return (
      <Card className="border-gray-300">
        <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded"></div>
              <CardTitle className="text-lg font-bold">Ações do Deputado</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddObra}>
                <Plus className="h-4 w-4" />
                Obra
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddEmenda}>
                <Plus className="h-4 w-4" />
                Emenda
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhuma obra ou destinação de emenda registrada para este município</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold">Ações do Deputado</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleAddObra}>
              <Plus className="h-4 w-4" />
              Obra
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddEmenda}>
              <Plus className="h-4 w-4" />
              Emenda
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Obras Section */}
        {obras.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-800">Obras e Equipamentos</h3>
              <Badge variant="outline" className="ml-2">{obras.length}</Badge>
            </div>

            {Object.entries(obrasPorCategoria).map(([categoria, obrasCategoria]) => (
              <div key={categoria} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  <h4 className="text-md font-semibold text-gray-700">{categoria}</h4>
                  <Badge variant="secondary" className="text-xs">{obrasCategoria.length}</Badge>
                </div>
                
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleObrasDragEnd}
                >
                  <SortableContext items={obrasCategoria.map(item => item.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {obrasCategoria.map((obra) => (
                        <SortableObraItem
                          key={obra.id}
                          obra={obra}
                          onEdit={handleEditObra}
                          onDelete={handleDeleteObra}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ))}
          </div>
        )}

        {/* Destinações de Emendas Section */}
        {destinacoes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-800">Destinações de Emendas Parlamentares</h3>
              <Badge variant="outline" className="ml-2">{destinacoes.length}</Badge>
            </div>
            
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleEmendasDragEnd}
            >
              <SortableContext items={destinacoes.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {destinacoes.map((destinacao) => (
                    <SortableEmendaItem
                      key={destinacao.id}
                      destinacao={destinacao}
                      onEdit={handleEditEmenda}
                      onDelete={handleDeleteEmenda}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Resumo das Ações</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{obras.length}</div>
              <div className="text-gray-600">Obras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{destinacoes.length}</div>
              <div className="text-gray-600">Destinações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(obras.reduce((sum, obra) => sum + obra.valor, 0))}
              </div>
              <div className="text-gray-600">Total Obras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(destinacoes.reduce((sum, destinacao) => sum + destinacao.valor, 0))}
              </div>
              <div className="text-gray-600">Total Destinações</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

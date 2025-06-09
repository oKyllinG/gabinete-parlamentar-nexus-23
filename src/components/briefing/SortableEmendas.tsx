import { useState, useEffect } from "react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, GripVertical, Edit, Trash2, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { DestinacaoEmenda } from "@/utils/briefingDataUtils"

interface SortableEmendaItemProps {
  emenda: DestinacaoEmenda
  onEdit: (emenda: DestinacaoEmenda) => void
  onDelete: (id: string) => void
}

const SortableEmendaItem = ({ emenda, onEdit, onDelete }: SortableEmendaItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: emenda.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aprovada": return "bg-green-100 text-green-800"
      case "Em execução": return "bg-blue-100 text-blue-800"
      case "Pendente": return "bg-yellow-100 text-yellow-800"
      case "Cancelada": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Aprovada": return <CheckCircle className="w-4 h-4" />
      case "Em execução": return <Clock className="w-4 h-4" />
      case "Pendente": return <AlertCircle className="w-4 h-4" />
      case "Cancelada": return <AlertCircle className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card className="mb-3 hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <button
              {...listeners}
              className="mt-2 p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </button>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">Emenda {emenda.numero}</h4>
                  <Badge variant="outline">{emenda.gnd}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(emenda)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => onDelete(emenda.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{emenda.objeto}</p>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">{emenda.areaAtuacao}</Badge>
                <Badge className={getStatusColor(emenda.status)}>
                  {getStatusIcon(emenda.status)}
                  <span className="ml-1">{emenda.status}</span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Destinatário:</span>
                  <p className="font-medium">{emenda.destinatario}</p>
                </div>
                <div>
                  <span className="text-gray-500">Valor:</span>
                  <p className="font-medium">{formatCurrency(emenda.valor)}</p>
                </div>
                <div>
                  <span className="text-gray-500">Prazo:</span>
                  <p className="font-medium">
                    {new Date(emenda.prazoInicio).toLocaleDateString('pt-BR')} - {new Date(emenda.prazoFim).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              
              {emenda.observacoes && (
                <div className="mt-2">
                  <span className="text-gray-500 text-sm">Observações:</span>
                  <p className="text-sm text-gray-600">{emenda.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SortableEmendasProps {
  emendas: DestinacaoEmenda[]
  onSave: (emendas: DestinacaoEmenda[]) => void
  onAdd: () => void
  onEdit: (emenda: DestinacaoEmenda) => void
  onDelete: (id: string) => void
}

export const SortableEmendas = ({ emendas, onSave, onAdd, onEdit, onDelete }: SortableEmendasProps) => {
  const [items, setItems] = useState(emendas)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      
      const newOrder = arrayMove(items, oldIndex, newIndex)
      setItems(newOrder)
      onSave(newOrder)
    }
  }

  // Update local state when emendas prop changes
  useEffect(() => {
    setItems(emendas)
  }, [emendas])

  const totalValor = items.reduce((sum, emenda) => sum + emenda.valor, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <div>
              <CardTitle className="text-lg font-bold">Emendas Parlamentares</CardTitle>
              <p className="text-sm opacity-90">
                {items.length} emenda(s) • {formatCurrency(totalValor)}
              </p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onAdd}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma emenda cadastrada</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {items.map((emenda) => (
                <SortableEmendaItem
                  key={emenda.id}
                  emenda={emenda}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  )
}

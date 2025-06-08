import { useState } from "react"
import { Plus, Edit3, Trash2, Check, X, GripVertical } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {
  CSS,
} from '@dnd-kit/utilities'

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface LiderancasMunicipaisProps {
  municipio: Municipio
}

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
  ordem: number
}

interface SortableLiderancaItemProps {
  lideranca: Lideranca
  isEditing: boolean
  editData: Partial<Lideranca>
  onEdit: (lideranca: Lideranca) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onDelete: (id: number) => void
  onEditDataChange: (data: Partial<Lideranca>) => void
}

const SortableLiderancaItem = ({ 
  lideranca, 
  isEditing, 
  editData, 
  onEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onEditDataChange 
}: SortableLiderancaItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lideranca.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-4 p-4 border rounded-lg bg-background"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <Avatar className="h-16 w-16">
        <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
        <AvatarFallback>
          {lideranca.nome.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={editData.nome || ""}
              onChange={(e) => onEditDataChange({...editData, nome: e.target.value})}
              placeholder="Nome"
            />
            <Input
              value={editData.cargo || ""}
              onChange={(e) => onEditDataChange({...editData, cargo: e.target.value})}
              placeholder="Cargo"
            />
            <Input
              value={editData.partido || ""}
              onChange={(e) => onEditDataChange({...editData, partido: e.target.value})}
              placeholder="Partido"
            />
            <Input
              value={editData.telefone || ""}
              onChange={(e) => onEditDataChange({...editData, telefone: e.target.value})}
              placeholder="Telefone"
            />
            <Input
              type="number"
              value={editData.votos || ""}
              onChange={(e) => onEditDataChange({...editData, votos: Number(e.target.value)})}
              placeholder="Votos"
            />
            <Input
              value={editData.foto || ""}
              onChange={(e) => onEditDataChange({...editData, foto: e.target.value})}
              placeholder="URL da foto"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{lideranca.nome}</h4>
              <Badge variant="secondary">{lideranca.partido}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{lideranca.cargo}</p>
            <p className="text-sm text-muted-foreground">{lideranca.telefone}</p>
            {lideranca.votos && (
              <p className="text-sm text-muted-foreground">Votos: {lideranca.votos.toLocaleString()}</p>
            )}
          </>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={onSaveEdit}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" onClick={() => onEdit(lideranca)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-destructive"
              onClick={() => onDelete(lideranca.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export const SortableLiderancasMunicipais = ({ municipio }: LiderancasMunicipaisProps) => {
  // Carregar dados do localStorage
  const loadLiderancas = (): Lideranca[] => {
    const saved = localStorage.getItem(`municipio-${municipio.id}-liderancas`)
    if (saved) {
      const liderancas = JSON.parse(saved)
      return liderancas.map((l: any, index: number) => ({
        ...l,
        ordem: l.ordem !== undefined ? l.ordem : index
      })).sort((a: Lideranca, b: Lideranca) => a.ordem - b.ordem)
    }
    return [
      {
        id: 1,
        nome: "João Silva",
        cargo: "Prefeito",
        partido: "PSDB",
        telefone: "(67) 99999-9999",
        votos: 5000,
        ordem: 0
      },
      {
        id: 2,
        nome: "Maria Santos",
        cargo: "Vereadora",
        partido: "PT",
        telefone: "(67) 88888-8888",
        votos: 1200,
        ordem: 1
      }
    ]
  }

  const [liderancas, setLiderancas] = useState<Lideranca[]>(loadLiderancas)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editData, setEditData] = useState<Partial<Lideranca>>({})
  const [newLideranca, setNewLideranca] = useState<Partial<Lideranca>>({
    nome: "",
    cargo: "",
    partido: "",
    telefone: "",
    votos: 0,
    foto: ""
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const saveLiderancas = (newLiderancas: Lideranca[]) => {
    localStorage.setItem(`municipio-${municipio.id}-liderancas`, JSON.stringify(newLiderancas))
    setLiderancas(newLiderancas)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = liderancas.findIndex(item => item.id === active.id)
      const newIndex = liderancas.findIndex(item => item.id === over.id)
      
      const newLiderancas = arrayMove(liderancas, oldIndex, newIndex)
      
      const updatedLiderancas = newLiderancas.map((lideranca, index) => ({
        ...lideranca,
        ordem: index
      }))
      
      saveLiderancas(updatedLiderancas)
    }
  }

  const handleEdit = (lideranca: Lideranca) => {
    setEditingId(lideranca.id)
    setEditData(lideranca)
  }

  const handleSaveEdit = () => {
    if (editingId && editData) {
      const updatedLiderancas = liderancas.map(l => 
        l.id === editingId ? { ...l, ...editData } : l
      )
      saveLiderancas(updatedLiderancas)
      setEditingId(null)
      setEditData({})
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleDelete = (id: number) => {
    const updatedLiderancas = liderancas.filter(l => l.id !== id)
    const reorderedLiderancas = updatedLiderancas.map((l, index) => ({
      ...l,
      ordem: index
    }))
    saveLiderancas(reorderedLiderancas)
  }

  const handleAddNew = () => {
    if (newLideranca.nome && newLideranca.cargo && newLideranca.partido && newLideranca.telefone) {
      const newId = Math.max(...liderancas.map(l => l.id), 0) + 1
      const newOrder = liderancas.length
      const updatedLiderancas = [...liderancas, { 
        ...newLideranca, 
        id: newId,
        ordem: newOrder
      } as Lideranca]
      saveLiderancas(updatedLiderancas)
      setNewLideranca({ nome: "", cargo: "", partido: "", telefone: "", votos: 0, foto: "" })
      setShowAddForm(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lideranças Municipais</CardTitle>
        <Button 
          size="sm" 
          className="flex items-center gap-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar Liderança
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {showAddForm && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h4 className="font-semibold mb-3">Nova Liderança</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label htmlFor="new-nome">Nome</Label>
                  <Input
                    id="new-nome"
                    value={newLideranca.nome}
                    onChange={(e) => setNewLideranca({...newLideranca, nome: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-cargo">Cargo</Label>
                  <Input
                    id="new-cargo"
                    value={newLideranca.cargo}
                    onChange={(e) => setNewLideranca({...newLideranca, cargo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-partido">Partido</Label>
                  <Input
                    id="new-partido"
                    value={newLideranca.partido}
                    onChange={(e) => setNewLideranca({...newLideranca, partido: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-telefone">Telefone</Label>
                  <Input
                    id="new-telefone"
                    value={newLideranca.telefone}
                    onChange={(e) => setNewLideranca({...newLideranca, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-votos">Votos</Label>
                  <Input
                    id="new-votos"
                    type="number"
                    value={newLideranca.votos}
                    onChange={(e) => setNewLideranca({...newLideranca, votos: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-foto">URL da Foto</Label>
                  <Input
                    id="new-foto"
                    value={newLideranca.foto}
                    onChange={(e) => setNewLideranca({...newLideranca, foto: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddNew}>
                  <Check className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={liderancas.map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              {liderancas.map((lideranca) => (
                <SortableLiderancaItem
                  key={lideranca.id}
                  lideranca={lideranca}
                  isEditing={editingId === lideranca.id}
                  editData={editData}
                  onEdit={handleEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDelete}
                  onEditDataChange={setEditData}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  )
}

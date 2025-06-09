import { useState } from "react"
import { Plus, Edit3, Trash2, Check, X, GripVertical, Phone } from "lucide-react"
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
      className="flex items-center gap-6 p-6 border rounded-lg bg-background"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <Avatar className="h-20 w-20">
        <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
        <AvatarFallback className="text-lg font-semibold">
          {lideranca.nome.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-3">
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
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6 flex-1">
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-4">
                  <h4 className="text-2xl font-bold truncate">{lideranca.nome}</h4>
                  <Badge variant="secondary" className="text-lg px-4 py-2 whitespace-nowrap">
                    {lideranca.partido}
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground font-semibold">{lideranca.cargo}</p>
              </div>
              
              {/* Votos - alinhados */}
              <div className="text-center bg-muted/50 rounded-lg p-4 min-w-[120px]">
                <p className="text-sm text-muted-foreground font-medium mb-1">Votos</p>
                <p className="text-2xl font-bold">{lideranca.votos?.toLocaleString() || '0'}</p>
              </div>
            </div>
            
            {/* Telefone no final com ícone */}
            <div className="flex items-center gap-3 text-xl ml-6">
              <Phone className="h-6 w-6 text-muted-foreground" />
              <span className="font-semibold whitespace-nowrap">{lideranca.telefone}</span>
            </div>
          </div>
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
  // Carregar dados do localStorage com dados mock para Água Clara
  const loadLiderancas = (): Lideranca[] => {
    const saved = localStorage.getItem(`municipio-${municipio.id}-liderancas`)
    if (saved) {
      const liderancas = JSON.parse(saved)
      return liderancas.map((l: any, index: number) => ({
        ...l,
        ordem: l.ordem !== undefined ? l.ordem : index
      })).sort((a: Lideranca, b: Lideranca) => a.ordem - b.ordem)
    }
    
    // Mock data para Água Clara (id: 1)
    if (municipio.id === 1) {
      return [
        {
          id: 1,
          nome: "Carlos Eduardo Silva",
          cargo: "Prefeito",
          partido: "PSDB",
          telefone: "(67) 99988-7766",
          votos: 8245,
          ordem: 0
        },
        {
          id: 2,
          nome: "Ana Maria Santos",
          cargo: "Vice-Prefeita",
          partido: "PSDB",
          telefone: "(67) 99977-8855",
          votos: 8245,
          ordem: 1
        },
        {
          id: 3,
          nome: "Dr. Roberto Oliveira",
          cargo: "Secretário de Saúde",
          partido: "PDT",
          telefone: "(67) 99966-9944",
          votos: 0,
          ordem: 2
        },
        {
          id: 4,
          nome: "José da Silva",
          cargo: "Vereador",
          partido: "PT",
          telefone: "(67) 99955-1122",
          votos: 1850,
          ordem: 3
        },
        {
          id: 5,
          nome: "Maria das Graças",
          cargo: "Vereadora",
          partido: "PP",
          telefone: "(67) 99944-3344",
          votos: 1620,
          ordem: 4
        },
        {
          id: 6,
          nome: "João Pedro Costa",
          cargo: "Vereador",
          partido: "MDB",
          telefone: "(67) 99933-5566",
          votos: 1480,
          ordem: 5
        },
        {
          id: 7,
          nome: "Antônio Carlos",
          cargo: "Vereador",
          partido: "PL",
          telefone: "(67) 99922-7788",
          votos: 1320,
          ordem: 6
        },
        {
          id: 8,
          nome: "Luciana Fernandes",
          cargo: "Vereadora",
          partido: "UNIÃO",
          telefone: "(67) 99911-9900",
          votos: 1280,
          ordem: 7
        },
        {
          id: 9,
          nome: "Fernando Almeida",
          cargo: "Vereador",
          partido: "REPUBLICANOS",
          telefone: "(67) 99900-1122",
          votos: 1150,
          ordem: 8
        },
        {
          id: 10,
          nome: "Sandra Regina",
          cargo: "Vereadora",
          partido: "PSB",
          telefone: "(67) 99888-3344",
          votos: 1080,
          ordem: 9
        },
        {
          id: 11,
          nome: "Ricardo Mendes",
          cargo: "Vereador",
          partido: "PODE",
          telefone: "(67) 99877-5566",
          votos: 980,
          ordem: 10
        },
        {
          id: 12,
          nome: "Patrícia Lima",
          cargo: "Vereadora",
          partido: "PV",
          telefone: "(67) 99866-7788",
          votos: 920,
          ordem: 11
        },
        {
          id: 13,
          nome: "Marcos Vinícius",
          cargo: "Vereador",
          partido: "CIDADANIA",
          telefone: "(67) 99855-9900",
          votos: 880,
          ordem: 12
        },
        {
          id: 14,
          nome: "Cláudia Souza",
          cargo: "Vereadora",
          partido: "SOLIDARIEDADE",
          telefone: "(67) 99844-1122",
          votos: 850,
          ordem: 13
        },
        {
          id: 15,
          nome: "Rafael Rodrigues",
          cargo: "Vereador",
          partido: "AVANTE",
          telefone: "(67) 99833-3344",
          votos: 800,
          ordem: 14
        },
        {
          id: 16,
          nome: "Vanessa Castro",
          cargo: "Vereadora",
          partido: "PROS",
          telefone: "(67) 99822-5566",
          votos: 750,
          ordem: 15
        }
      ]
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

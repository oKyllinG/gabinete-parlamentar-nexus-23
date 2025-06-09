
import { useState } from "react"
import { Plus, Edit3, Trash2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
}

interface EditableLiderancasMunicipaisProps {
  liderancas: Lideranca[]
  onSave: (liderancas: Lideranca[]) => void
  onCancel: () => void
}

export const EditableLiderancasMunicipais = ({ liderancas, onSave, onCancel }: EditableLiderancasMunicipaisProps) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editData, setEditData] = useState<Partial<Lideranca>>({})
  const [newLideranca, setNewLideranca] = useState<Partial<Lideranca>>({
    nome: "",
    cargo: "",
    partido: "",
    telefone: ""
  })

  const handleEdit = (lideranca: Lideranca) => {
    setEditingId(lideranca.id)
    setEditData(lideranca)
  }

  const handleSaveEdit = () => {
    if (editingId && editData) {
      const updatedLiderancas = liderancas.map(l => 
        l.id === editingId ? { ...l, ...editData } : l
      )
      onSave(updatedLiderancas)
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
    onSave(updatedLiderancas)
  }

  const handleAddNew = () => {
    if (newLideranca.nome && newLideranca.cargo && newLideranca.partido && newLideranca.telefone) {
      const newId = Math.max(...liderancas.map(l => l.id), 0) + 1
      const updatedLiderancas = [...liderancas, { ...newLideranca, id: newId } as Lideranca]
      onSave(updatedLiderancas)
      setNewLideranca({ nome: "", cargo: "", partido: "", telefone: "" })
      setShowAddForm(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lideranças Municipais</CardTitle>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Liderança
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
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

          {liderancas.map((lideranca) => (
            <div key={lideranca.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                <AvatarFallback>
                  {lideranca.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                {editingId === lideranca.id ? (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={editData.nome || ""}
                      onChange={(e) => setEditData({...editData, nome: e.target.value})}
                      placeholder="Nome"
                    />
                    <Input
                      value={editData.cargo || ""}
                      onChange={(e) => setEditData({...editData, cargo: e.target.value})}
                      placeholder="Cargo"
                    />
                    <Input
                      value={editData.partido || ""}
                      onChange={(e) => setEditData({...editData, partido: e.target.value})}
                      placeholder="Partido"
                    />
                    <Input
                      value={editData.telefone || ""}
                      onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                      placeholder="Telefone"
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
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {editingId === lideranca.id ? (
                  <>
                    <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(lideranca)}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive"
                      onClick={() => handleDelete(lideranca.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

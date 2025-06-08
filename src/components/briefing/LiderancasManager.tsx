
import { useState } from "react"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface LiderancasManagerProps {
  liderancas: Lideranca[]
  onSave: (liderancas: Lideranca[]) => void
}

export const LiderancasManager = ({ liderancas, onSave }: LiderancasManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState<Partial<Lideranca>>({})
  const [newLideranca, setNewLideranca] = useState<Partial<Lideranca>>({
    nome: "", cargo: "", partido: "", telefone: "", votos: 0, foto: ""
  })

  const handleAdd = () => {
    if (newLideranca.nome && newLideranca.cargo && newLideranca.partido && newLideranca.telefone) {
      const newId = Math.max(...liderancas.map(l => l.id), 0) + 1
      const updatedLiderancas = [...liderancas, { 
        ...newLideranca, 
        id: newId,
        votos: newLideranca.votos || 0
      } as Lideranca]
      onSave(updatedLiderancas)
      setNewLideranca({ nome: "", cargo: "", partido: "", telefone: "", votos: 0, foto: "" })
      setShowAddForm(false)
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
      onSave(updatedLiderancas)
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: number) => {
    const updatedLiderancas = liderancas.filter(l => l.id !== id)
    onSave(updatedLiderancas)
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold">Lideranças Municipais</CardTitle>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {showAddForm && (
          <div className="p-4 border rounded-lg bg-gray-50 mb-4">
            <h4 className="font-semibold mb-3">Nova Liderança</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
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
              <Button size="sm" onClick={handleAdd} className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="h-4 w-4 mr-1" />
                Salvar
              </Button>
              <Button size="sm" onClick={() => setShowAddForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {liderancas.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma liderança cadastrada
          </div>
        ) : (
          <div className="space-y-4">
            {liderancas.map((lideranca) => (
              <div key={lideranca.id} className="flex items-center gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Avatar className="h-24 w-24 border-2 border-gray-200">
                  <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                  <AvatarFallback className="bg-gray-100 text-gray-700 text-xl font-semibold">
                    {lideranca.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  {editingId === lideranca.id ? (
                    <div className="grid grid-cols-3 gap-3">
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
                      <Input
                        type="number"
                        value={editData.votos || ""}
                        onChange={(e) => setEditData({...editData, votos: Number(e.target.value)})}
                        placeholder="Votos"
                      />
                      <Input
                        value={editData.foto || ""}
                        onChange={(e) => setEditData({...editData, foto: e.target.value})}
                        placeholder="URL da foto"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-gray-900 text-xl">{lideranca.nome}</h4>
                            <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                              {lideranca.partido}
                            </Badge>
                          </div>
                          <p className="text-gray-600 font-medium">{lideranca.cargo}</p>
                          <p className="text-gray-500 text-sm">{lideranca.telefone}</p>
                        </div>
                        
                        <div className="text-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                          <div className="text-blue-600 font-bold text-2xl">
                            {lideranca.votos?.toLocaleString() || '0'}
                          </div>
                          <div className="text-blue-500 text-xs font-medium">VOTOS</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {editingId === lideranca.id ? (
                    <>
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => setEditingId(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleEdit(lideranca)} className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" onClick={() => handleDelete(lideranca.id)} className="bg-red-600 hover:bg-red-700 text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


import { useState } from "react"
import { Plus, Edit3, Trash2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
  categoria: string
}

interface EditableLiderancasMunicipaisProps {
  liderancas: Lideranca[]
  onSave: (liderancas: Lideranca[]) => void
  onCancel: () => void
}

const CATEGORIAS = {
  "Executivo Municipal": [
    "Prefeito", "Prefeita",
    "Vice-Prefeito", "Vice-Prefeita", 
    "Chefe de Gabinete"
  ],
  "Secretários": [
    "Secretário de Administração", "Secretária de Administração",
    "Secretário de Agricultura", "Secretária de Agricultura",
    "Secretário de Assistência Social", "Secretária de Assistência Social",
    "Secretário de Cultura", "Secretária de Cultura",
    "Secretário de Desenvolvimento Econômico", "Secretária de Desenvolvimento Econômico",
    "Secretário de Educação", "Secretária de Educação",
    "Secretário de Esporte e Lazer", "Secretária de Esporte e Lazer",
    "Secretário de Fazenda", "Secretária de Fazenda",
    "Secretário de Infraestrutura", "Secretária de Infraestrutura",
    "Secretário de Meio Ambiente", "Secretária de Meio Ambiente",
    "Secretário de Obras", "Secretária de Obras",
    "Secretário de Planejamento", "Secretária de Planejamento",
    "Secretário de Saúde", "Secretária de Saúde",
    "Secretário de Segurança", "Secretária de Segurança",
    "Secretário de Transporte", "Secretária de Transporte",
    "Secretário de Turismo", "Secretária de Turismo",
    "Secretário de Habitação", "Secretária de Habitação"
  ],
  "Câmara Municipal": [
    "Vereador", "Vereadora",
    "Presidente da Câmara Municipal",
    "1º Vice-Presidente da Câmara", "1ª Vice-Presidente da Câmara",
    "2º Vice-Presidente da Câmara", "2ª Vice-Presidente da Câmara", 
    "1º Secretário da Câmara", "1ª Secretária da Câmara",
    "2º Secretário da Câmara", "2ª Secretária da Câmara"
  ]
}

const getCategoriaFromCargo = (cargo: string): string => {
  for (const [categoria, cargos] of Object.entries(CATEGORIAS)) {
    if (cargos.includes(cargo)) {
      return categoria
    }
  }
  return "Outros"
}

export const EditableLiderancasMunicipais = ({ liderancas, onSave, onCancel }: EditableLiderancasMunicipaisProps) => {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editData, setEditData] = useState<Partial<Lideranca>>({})
  const [newLideranca, setNewLideranca] = useState<Partial<Lideranca>>({
    nome: "",
    cargo: "",
    partido: "",
    telefone: "",
    foto: "",
    categoria: ""
  })

  const handleEdit = (lideranca: Lideranca) => {
    setEditingId(lideranca.id)
    setEditData(lideranca)
  }

  const handleSaveEdit = () => {
    if (editingId && editData) {
      const categoria = getCategoriaFromCargo(editData.cargo || "")
      const updatedLiderancas = liderancas.map(l => 
        l.id === editingId ? { ...l, ...editData, categoria } : l
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
      const categoria = getCategoriaFromCargo(newLideranca.cargo)
      const updatedLiderancas = [...liderancas, { 
        ...newLideranca, 
        id: newId,
        categoria
      } as Lideranca]
      onSave(updatedLiderancas)
      setNewLideranca({ nome: "", cargo: "", partido: "", telefone: "", foto: "", categoria: "" })
      setShowAddForm(false)
    }
  }

  const handleCargoChange = (cargo: string, isEdit: boolean = false) => {
    const categoria = getCategoriaFromCargo(cargo)
    if (isEdit) {
      setEditData({...editData, cargo, categoria})
    } else {
      setNewLideranca({...newLideranca, cargo, categoria})
    }
  }

  // Organizar lideranças por categoria
  const liderancasPorCategoria = liderancas.reduce((acc, lideranca) => {
    const categoria = lideranca.categoria || getCategoriaFromCargo(lideranca.cargo)
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(lideranca)
    return acc
  }, {} as Record<string, Lideranca[]>)

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
        <div className="space-y-6">
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
                  <Select onValueChange={(value) => handleCargoChange(value, false)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIAS).map(([categoria, cargos]) => (
                        <div key={categoria}>
                          <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                            {categoria}
                          </div>
                          {cargos.map((cargo) => (
                            <SelectItem key={cargo} value={cargo}>
                              {cargo}
                            </SelectItem>
                          ))}
                        </div>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="col-span-2">
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

          {Object.entries(liderancasPorCategoria).map(([categoria, liderancasCategoria]) => (
            <div key={categoria} className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b pb-2">
                {categoria}
              </h3>
              {liderancasCategoria.map((lideranca) => (
                <div key={lideranca.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                    <AvatarFallback className="text-lg">
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
                        <Select onValueChange={(value) => handleCargoChange(value, true)}>
                          <SelectTrigger>
                            <SelectValue placeholder={editData.cargo || "Selecione o cargo"} />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(CATEGORIAS).map(([cat, cargos]) => (
                              <div key={cat}>
                                <div className="px-2 py-1 text-sm font-semibold text-muted-foreground">
                                  {cat}
                                </div>
                                {cargos.map((cargo) => (
                                  <SelectItem key={cargo} value={cargo}>
                                    {cargo}
                                  </SelectItem>
                                ))}
                              </div>
                            ))}
                          </SelectContent>
                        </Select>
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
                          value={editData.foto || ""}
                          onChange={(e) => setEditData({...editData, foto: e.target.value})}
                          placeholder="URL da foto"
                          className="col-span-2"
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

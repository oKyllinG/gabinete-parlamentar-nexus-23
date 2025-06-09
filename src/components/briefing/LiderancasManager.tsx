
import { useState } from "react"
import { Plus, Edit, Trash2, Check, X, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
}

interface LiderancasManagerProps {
  liderancas: Lideranca[]
  onSave: (liderancas: Lideranca[]) => void
}

const cargosPredefinidos = {
  "Executivo Municipal": [
    "Prefeito",
    "Prefeita", 
    "Vice-Prefeito",
    "Vice-Prefeita",
    "Chefe de Gabinete"
  ],
  "Secretários": [
    "Secretário de Administração",
    "Secretária de Administração",
    "Secretário de Agricultura",
    "Secretária de Agricultura", 
    "Secretário de Assistência Social",
    "Secretária de Assistência Social",
    "Secretário de Cultura",
    "Secretária de Cultura",
    "Secretário de Educação",
    "Secretária de Educação",
    "Secretário de Esportes",
    "Secretária de Esportes",
    "Secretário de Finanças",
    "Secretária de Finanças",
    "Secretário de Governo",
    "Secretária de Governo",
    "Secretário de Infraestrutura",
    "Secretária de Infraestrutura",
    "Secretário de Meio Ambiente",
    "Secretária de Meio Ambiente",
    "Secretário de Obras",
    "Secretária de Obras",
    "Secretário de Planejamento",
    "Secretária de Planejamento",
    "Secretário de Saúde",
    "Secretária de Saúde",
    "Secretário de Segurança",
    "Secretária de Segurança",
    "Secretário de Transporte",
    "Secretária de Transporte",
    "Secretário de Turismo",
    "Secretária de Turismo"
  ],
  "Câmara Municipal": [
    "Vereador",
    "Vereadora",
    "Presidente da Câmara",
    "Presidenta da Câmara",
    "1º Vice-Presidente",
    "1ª Vice-Presidente", 
    "2º Vice-Presidente",
    "2ª Vice-Presidente",
    "1º Secretário",
    "1ª Secretária",
    "2º Secretário", 
    "2ª Secretária"
  ]
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

  // Separate leadership by type for better organization
  const prefeito = liderancas.find(l => l.cargo.toLowerCase().includes('prefeito') || l.cargo.toLowerCase().includes('prefeita'))
  const vicePrefeito = liderancas.find(l => l.cargo.toLowerCase().includes('vice'))
  const chefeGabinete = liderancas.find(l => l.cargo.toLowerCase().includes('chefe de gabinete'))
  const secretarios = liderancas.filter(l => l.cargo.toLowerCase().includes('secretário') || l.cargo.toLowerCase().includes('secretária'))
  const vereadores = liderancas.filter(l => 
    l.cargo.toLowerCase().includes('vereador') || 
    l.cargo.toLowerCase().includes('vereadora') ||
    l.cargo.toLowerCase().includes('presidente da câmara') ||
    l.cargo.toLowerCase().includes('presidenta da câmara') ||
    l.cargo.toLowerCase().includes('vice-presidente') ||
    l.cargo.toLowerCase().includes('secretário') && l.cargo.toLowerCase().includes('câmara') ||
    l.cargo.toLowerCase().includes('secretária') && l.cargo.toLowerCase().includes('câmara')
  ).sort((a, b) => (b.votos || 0) - (a.votos || 0))
  const outros = liderancas.filter(l => 
    !l.cargo.toLowerCase().includes('prefeito') && 
    !l.cargo.toLowerCase().includes('prefeita') &&
    !l.cargo.toLowerCase().includes('vice') &&
    !l.cargo.toLowerCase().includes('chefe de gabinete') &&
    !l.cargo.toLowerCase().includes('secretário') &&
    !l.cargo.toLowerCase().includes('secretária') &&
    !l.cargo.toLowerCase().includes('vereador') &&
    !l.cargo.toLowerCase().includes('vereadora') &&
    !l.cargo.toLowerCase().includes('presidente da câmara') &&
    !l.cargo.toLowerCase().includes('presidenta da câmara')
  )

  const renderLideranca = (lideranca: Lideranca) => (
    <div key={lideranca.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <Avatar className="h-16 w-16 border-2 border-gray-200">
        <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
        <AvatarFallback className="bg-gray-100 text-gray-700 text-lg font-semibold">
          {lideranca.nome.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        {editingId === lideranca.id ? (
          <div className="grid grid-cols-2 gap-3">
            <Input
              value={editData.nome || ""}
              onChange={(e) => setEditData({...editData, nome: e.target.value})}
              placeholder="Nome"
            />
            <Select value={editData.cargo || ""} onValueChange={(value) => setEditData({...editData, cargo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(cargosPredefinidos).map(([categoria, cargos]) => (
                  <div key={categoria}>
                    <div className="px-2 py-1 text-sm font-semibold text-gray-600 border-b">{categoria}</div>
                    {cargos.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
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
            <div className="flex items-center gap-6 flex-1">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-gray-900 text-lg">{lideranca.nome}</h4>
                  <div className="min-w-[100px] text-center">
                    <Badge variant="outline" className="border-gray-400 text-gray-700 bg-gray-100 text-lg px-3 py-1">
                      {lideranca.partido}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">{lideranca.cargo}</p>
              </div>
              
              {/* Votos alinhados à direita com largura fixa */}
              <div className="text-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 min-w-[120px]">
                <div className="text-blue-600 font-bold text-lg">
                  {(lideranca.votos || 0).toLocaleString()}
                </div>
                <div className="text-blue-500 text-xs font-medium">VOTOS</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-gray-600">
          <Phone className="h-4 w-4" />
          <span className="text-base font-medium">{lideranca.telefone}</span>
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
    </div>
  )

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
          <div className="p-4 border rounded-lg bg-gray-50 mb-6">
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
                <Select value={newLideranca.cargo || ""} onValueChange={(value) => setNewLideranca({...newLideranca, cargo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(cargosPredefinidos).map(([categoria, cargos]) => (
                      <div key={categoria}>
                        <div className="px-2 py-1 text-sm font-semibold text-gray-600 border-b">{categoria}</div>
                        {cargos.map((cargo) => (
                          <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
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
          <div className="space-y-6">
            {/* Executivo Municipal */}
            {(prefeito || vicePrefeito || chefeGabinete) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Executivo Municipal</h3>
                <div className="space-y-3">
                  {prefeito && renderLideranca(prefeito)}
                  {vicePrefeito && renderLideranca(vicePrefeito)}
                  {chefeGabinete && renderLideranca(chefeGabinete)}
                </div>
              </div>
            )}

            {/* Secretários */}
            {secretarios.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Secretários</h3>
                <div className="space-y-3">
                  {secretarios.map(renderLideranca)}
                </div>
              </div>
            )}

            {/* Vereadores */}
            {vereadores.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">
                  Câmara Municipal ({vereadores.filter(v => v.cargo.toLowerCase().includes('vereador')).length} vereadores)
                </h3>
                <div className="space-y-3">
                  {vereadores.map(renderLideranca)}
                </div>
              </div>
            )}

            {/* Outros */}
            {outros.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Outras Lideranças</h3>
                <div className="space-y-3">
                  {outros.map(renderLideranca)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

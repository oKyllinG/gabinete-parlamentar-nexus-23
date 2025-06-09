import { useState } from "react"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
  colocacao?: number
}

interface DeputadosFederaisManagerProps {
  deputadosFederais: Deputado[]
  onSave: (deputados: Deputado[]) => void
}

export const DeputadosFederaisManager = ({ deputadosFederais, onSave }: DeputadosFederaisManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Deputado>>({})
  const [newDeputado, setNewDeputado] = useState<Partial<Deputado>>({
    nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1
  })

  const handleAdd = () => {
    if (newDeputado.nome && newDeputado.partido) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosFederais, { 
        ...newDeputado, 
        id: newId,
        votos: newDeputado.votos || 0,
        percentual: newDeputado.percentual || 0,
        telefone: newDeputado.telefone || "",
        colocacao: newDeputado.colocacao || deputadosFederais.length + 1
      } as Deputado]
      onSave(updatedDeputados)
      setNewDeputado({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1 })
      setShowAddForm(false)
    }
  }

  const handleEdit = (deputado: Deputado) => {
    setEditingId(deputado.id)
    setEditData(deputado)
  }

  const handleSaveEdit = () => {
    if (editingId && editData) {
      const updatedDeputados = deputadosFederais.map(d => 
        d.id === editingId ? { ...d, ...editData } : d
      )
      onSave(updatedDeputados)
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: string) => {
    const updatedDeputados = deputadosFederais.filter(d => d.id !== id)
    onSave(updatedDeputados)
  }

  const deputadosOrdenados = [...deputadosFederais].sort((a, b) => {
    if (a.colocacao && b.colocacao) return a.colocacao - b.colocacao
    if (a.colocacao && !b.colocacao) return -1
    if (!a.colocacao && b.colocacao) return 1
    return 0
  })

  return (
    <Card className="border-gray-300 h-full">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold">Deputados Federais</CardTitle>
          </div>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 text-white no-print"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 print-card-content">
        {showAddForm && (
          <div className="p-4 border rounded-lg bg-gray-50 mb-4 no-print">
            <h4 className="font-semibold mb-3">Novo Deputado Federal</h4>
            <div className="grid grid-cols-5 gap-3 mb-3">
              <div>
                <Label htmlFor="fed-pos">Posição</Label>
                <Input
                  id="fed-pos"
                  type="number"
                  placeholder="1"
                  value={newDeputado.colocacao}
                  onChange={(e) => setNewDeputado({...newDeputado, colocacao: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="fed-nome">Nome</Label>
                <Input
                  id="fed-nome"
                  placeholder="Nome"
                  value={newDeputado.nome}
                  onChange={(e) => setNewDeputado({...newDeputado, nome: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fed-partido">Partido</Label>
                <Input
                  id="fed-partido"
                  placeholder="Partido"
                  value={newDeputado.partido}
                  onChange={(e) => setNewDeputado({...newDeputado, partido: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="fed-votos">Votos</Label>
                <Input
                  id="fed-votos"
                  type="number"
                  placeholder="Votos"
                  value={newDeputado.votos}
                  onChange={(e) => setNewDeputado({...newDeputado, votos: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="fed-percentual">%</Label>
                <Input
                  id="fed-percentual"
                  type="number"
                  step="0.01"
                  placeholder="Percentual"
                  value={newDeputado.percentual}
                  onChange={(e) => setNewDeputado({...newDeputado, percentual: Number(e.target.value)})}
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

        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-300 font-semibold">Pos.</th>
                <th className="text-left p-3 border border-gray-300 font-semibold">Nome</th>
                <th className="text-left p-3 border border-gray-300 font-semibold">Partido</th>
                <th className="text-left p-3 border border-gray-300 font-semibold">Votos</th>
                <th className="text-left p-3 border border-gray-300 font-semibold">%</th>
                <th className="text-left p-3 border border-gray-300 font-semibold no-print">Ações</th>
              </tr>
            </thead>
            <tbody>
              {deputadosOrdenados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-300">
                    Nenhum deputado cadastrado
                  </td>
                </tr>
              ) : (
                deputadosOrdenados.map((deputado) => (
                  <tr key={deputado.id} className="border-b border-gray-200">
                    {editingId === deputado.id ? (
                      <>
                        <td className="p-3 border border-gray-300">
                          <Input
                            type="number"
                            value={editData.colocacao || ""}
                            onChange={(e) => setEditData({...editData, colocacao: Number(e.target.value)})}
                            className="w-16"
                          />
                        </td>
                        <td className="p-3 border border-gray-300">
                          <Input
                            value={editData.nome || ""}
                            onChange={(e) => setEditData({...editData, nome: e.target.value})}
                          />
                        </td>
                        <td className="p-3 border border-gray-300">
                          <Input
                            value={editData.partido || ""}
                            onChange={(e) => setEditData({...editData, partido: e.target.value})}
                          />
                        </td>
                        <td className="p-3 border border-gray-300">
                          <Input
                            type="number"
                            value={editData.votos || ""}
                            onChange={(e) => setEditData({...editData, votos: Number(e.target.value)})}
                          />
                        </td>
                        <td className="p-3 border border-gray-300">
                          <Input
                            type="number"
                            step="0.01"
                            value={editData.percentual || ""}
                            onChange={(e) => setEditData({...editData, percentual: Number(e.target.value)})}
                          />
                        </td>
                        <td className="p-3 border border-gray-300 no-print">
                          <div className="flex gap-1">
                            <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700 text-white">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => setEditingId(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 border border-gray-300 font-medium">{deputado.colocacao || "-"}</td>
                        <td className="p-3 border border-gray-300">{deputado.nome}</td>
                        <td className="p-3 border border-gray-300">
                          <Badge variant="outline" className="text-xs">{deputado.partido}</Badge>
                        </td>
                        <td className="p-3 border border-gray-300">{deputado.votos.toLocaleString()}</td>
                        <td className="p-3 border border-gray-300">{deputado.percentual.toFixed(2)}%</td>
                        <td className="p-3 border border-gray-300 no-print">
                          <div className="flex gap-1">
                            <Button size="sm" onClick={() => handleEdit(deputado)} className="bg-blue-600 hover:bg-blue-700 text-white">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleDelete(deputado.id)} className="bg-red-600 hover:bg-red-700 text-white">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

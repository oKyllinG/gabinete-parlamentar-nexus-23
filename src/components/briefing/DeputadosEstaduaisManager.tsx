
import { useState } from "react"
import { Plus, Edit, Trash2, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
  colocacao?: number
}

interface DeputadosEstaduaisManagerProps {
  deputadosEstaduais: Deputado[]
  onSave: (deputados: Deputado[]) => void
}

export const DeputadosEstaduaisManager = ({ deputadosEstaduais, onSave }: DeputadosEstaduaisManagerProps) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Deputado>>({})
  const [newDeputado, setNewDeputado] = useState<Partial<Deputado>>({
    nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1
  })

  const handleAdd = () => {
    if (newDeputado.nome && newDeputado.partido) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosEstaduais, {
        ...newDeputado,
        id: newId,
        votos: newDeputado.votos || 0,
        percentual: newDeputado.percentual || 0,
        telefone: newDeputado.telefone || "",
        colocacao: newDeputado.colocacao || deputadosEstaduais.length + 1
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
      const updatedDeputados = deputadosEstaduais.map(d =>
        d.id === editingId ? { ...d, ...editData } as Deputado : d
      )
      onSave(updatedDeputados)
      setEditingId(null)
      setEditData({})
    }
  }

  const handleDelete = (id: string) => {
    const updatedDeputados = deputadosEstaduais.filter(d => d.id !== id)
    onSave(updatedDeputados)
  }

  const deputadosOrdenados = [...deputadosEstaduais].sort((a, b) => {
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
            <CardTitle className="text-lg font-bold">Deputados Estaduais</CardTitle>
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
      <CardContent className="p-0 print:p-0">
         {showAddForm && (
          <div className="p-4 border-b bg-gray-50 no-print">
            <h4 className="font-semibold mb-3">Novo Deputado</h4>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Input type="number" placeholder="Pos." value={newDeputado.colocacao} onChange={(e) => setNewDeputado({...newDeputado, colocacao: Number(e.target.value)})} />
              <Input placeholder="Nome" value={newDeputado.nome} onChange={(e) => setNewDeputado({...newDeputado, nome: e.target.value})} />
              <Input placeholder="Partido" value={newDeputado.partido} onChange={(e) => setNewDeputado({...newDeputado, partido: e.target.value})} />
              <Input type="number" placeholder="Votos" value={newDeputado.votos} onChange={(e) => setNewDeputado({...newDeputado, votos: Number(e.target.value)})} />
              <Input type="number" step="0.01" placeholder="%" value={newDeputado.percentual} onChange={(e) => setNewDeputado({...newDeputado, percentual: Number(e.target.value)})} />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Cancelar</Button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse deputies-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border font-semibold pos-col">Pos.</th>
                <th className="text-left p-2 border font-semibold name-col">Nome</th>
                <th className="text-left p-2 border font-semibold party-col">Partido</th>
                <th className="text-left p-2 border font-semibold votes-col">Votos</th>
                <th className="text-left p-2 border font-semibold percent-col">%</th>
                <th className="text-left p-2 border font-semibold no-print">Ações</th>
              </tr>
            </thead>
            <tbody>
              {deputadosOrdenados.map((deputado) => (
                <tr key={deputado.id} className="border-b">
                   {editingId === deputado.id ? (
                      <>
                        <td className="p-1 border"><Input type="number" value={editData.colocacao} onChange={(e) => setEditData({...editData, colocacao: Number(e.target.value)})} className="h-8"/></td>
                        <td className="p-1 border"><Input value={editData.nome} onChange={(e) => setEditData({...editData, nome: e.target.value})} className="h-8"/></td>
                        <td className="p-1 border"><Input value={editData.partido} onChange={(e) => setEditData({...editData, partido: e.target.value})} className="h-8"/></td>
                        <td className="p-1 border"><Input type="number" value={editData.votos} onChange={(e) => setEditData({...editData, votos: Number(e.target.value)})} className="h-8"/></td>
                        <td className="p-1 border"><Input type="number" value={editData.percentual} onChange={(e) => setEditData({...editData, percentual: Number(e.target.value)})} className="h-8"/></td>
                        <td className="p-1 border no-print">
                            <div className="flex gap-1">
                                <Button size="icon" className="h-8 w-8 bg-green-600" onClick={handleSaveEdit}><Check className="h-4 w-4" /></Button>
                                <Button size="icon" className="h-8 w-8" variant="ghost" onClick={() => setEditingId(null)}><X className="h-4 w-4" /></Button>
                            </div>
                        </td>
                      </>
                   ) : (
                    <>
                        <td className="p-2 border font-medium print:text-[7pt]">{deputado.colocacao || "-"}</td>
                        <td className="p-2 border">{deputado.nome}</td>
                        <td className="p-2 border print:text-[7pt]">
                          <span className="print:bg-transparent print:border-0 print:p-0 print:text-inherit print:font-normal">
                            <Badge variant="outline" className="text-xs print:bg-transparent print:border-0 print:p-0 print:text-inherit print:font-normal print:inline">
                              {deputado.partido}
                            </Badge>
                          </span>
                        </td>
                        <td className="p-2 border print:text-[7pt]">{deputado.votos.toLocaleString()}</td>
                        <td className="p-2 border print:text-[7pt]">{deputado.percentual.toFixed(2)}%</td>
                        <td className="p-2 border no-print">
                            <div className="flex gap-1">
                                <Button size="icon" className="h-8 w-8" onClick={() => handleEdit(deputado)}><Edit className="h-4 w-4" /></Button>
                                <Button size="icon" className="h-8 w-8" variant="destructive" onClick={() => handleDelete(deputado.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </td>
                    </>
                   )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

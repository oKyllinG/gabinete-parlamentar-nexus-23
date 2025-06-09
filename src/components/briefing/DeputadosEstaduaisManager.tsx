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
        d.id === editingId ? { ...d, ...editData } : d
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
      <CardContent className="p-4 print-card-content">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 border border-gray-300 font-semibold print:text-[7pt]">Pos.</th>
                <th className="text-left p-3 border border-gray-300 font-semibold print:w-[40%]">Nome</th>
                <th className="text-left p-3 border border-gray-300 font-semibold print:text-[7pt]">Partido</th>
                <th className="text-left p-3 border border-gray-300 font-semibold print:text-[7pt]">Votos</th>
                <th className="text-left p-3 border border-gray-300 font-semibold print:text-[7pt]">%</th>
                <th className="text-left p-3 border border-gray-300 font-semibold no-print">Ações</th>
              </tr>
            </thead>
            <tbody>
              {deputadosOrdenados.map((deputado) => (
                <tr key={deputado.id} className="border-b border-gray-200">
                  <td className="p-3 border border-gray-300 font-medium print:text-[7pt]">{deputado.colocacao || "-"}</td>
                  <td className="p-3 border border-gray-300">{deputado.nome}</td>
                  <td className="p-3 border border-gray-300 print:text-[7pt]">
                    <Badge variant="outline" className="text-xs">{deputado.partido}</Badge>
                  </td>
                  <td className="p-3 border border-gray-300 print:text-[7pt]">{deputado.votos.toLocaleString()}</td>
                  <td className="p-3 border border-gray-300 print:text-[7pt]">{deputado.percentual.toFixed(2)}%</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

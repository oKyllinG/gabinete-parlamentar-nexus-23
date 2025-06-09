
import { useState } from "react"
import { Edit, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DadosPoliticos {
  totalEleitores: number
  votosDeputado: number
  percentualDeputado: number
  colocacaoDeputado: string
}

interface ResultadosEleitoraisManagerProps {
  municipio: { nome: string; regiao: string }
  dadosPoliticos: DadosPoliticos
  onSave: (dados: DadosPoliticos) => void
}

export const ResultadosEleitoraisManager = ({ municipio, dadosPoliticos, onSave }: ResultadosEleitoraisManagerProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<DadosPoliticos>(dadosPoliticos)

  const handleSave = () => {
    onSave(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(dadosPoliticos)
    setIsEditing(false)
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300 print-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <div>
              <CardTitle className="text-lg font-bold">{municipio.nome}</CardTitle>
              <p className="text-sm opacity-90">{municipio.regiao}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 no-print">
            {!isEditing ? (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Total de Eleitores</label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.totalEleitores}
                onChange={(e) => setEditData({...editData, totalEleitores: Number(e.target.value)})}
                className="mt-1"
              />
            ) : (
              <p className="text-lg font-semibold">{dadosPoliticos.totalEleitores.toLocaleString()}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Votos do Deputado</label>
            {isEditing ? (
              <Input
                type="number"
                value={editData.votosDeputado}
                onChange={(e) => setEditData({...editData, votosDeputado: Number(e.target.value)})}
                className="mt-1"
              />
            ) : (
              <p className="text-lg font-semibold">{dadosPoliticos.votosDeputado.toLocaleString()}</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Percentual do Deputado</label>
            {isEditing ? (
              <Input
                type="number"
                step="0.01"
                value={editData.percentualDeputado}
                onChange={(e) => setEditData({...editData, percentualDeputado: Number(e.target.value)})}
                className="mt-1"
              />
            ) : (
              <p className="text-lg font-semibold">{dadosPoliticos.percentualDeputado.toFixed(2)}%</p>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Colocação do Deputado</label>
            {isEditing ? (
              <Input
                value={editData.colocacaoDeputado}
                onChange={(e) => setEditData({...editData, colocacaoDeputado: e.target.value})}
                className="mt-1"
              />
            ) : (
              <p className="text-lg font-semibold">{dadosPoliticos.colocacaoDeputado}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

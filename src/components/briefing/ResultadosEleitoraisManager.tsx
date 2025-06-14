
import { useState } from "react"
import { Edit3, Check, X } from "lucide-react"
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
  dadosPoliticos: DadosPoliticos
  onSave: (dados: DadosPoliticos) => void
}

export const ResultadosEleitoraisManager = ({ dadosPoliticos, onSave }: ResultadosEleitoraisManagerProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(dadosPoliticos)

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
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold">Resultados Eleitorais</CardTitle>
          </div>
          <div className="flex items-center gap-2 no-print">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4" />
                  Salvar
                </Button>
                <Button size="sm" onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 print-card-content">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs text-blue-700 mb-1">Total de Eleitores</div>
            <div className="text-2xl font-bold text-blue-900">
              {isEditing ? (
                <Input
                  value={editData.totalEleitores}
                  onChange={(e) => setEditData({...editData, totalEleitores: Number(e.target.value)})}
                  className="text-center font-bold text-2xl"
                />
              ) : (
                dadosPoliticos.totalEleitores.toLocaleString()
              )}
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-xs text-green-700 mb-1">Votos do Deputado</div>
            <div className="text-2xl font-bold text-green-900">
              {isEditing ? (
                <Input
                  value={editData.votosDeputado}
                  onChange={(e) => setEditData({...editData, votosDeputado: Number(e.target.value)})}
                  className="text-center font-bold text-2xl"
                />
              ) : (
                dadosPoliticos.votosDeputado.toLocaleString()
              )}
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-xs text-orange-700 mb-1">Porcentagem</div>
            <div className="text-2xl font-bold text-orange-900">
              {isEditing ? (
                <Input
                  value={editData.percentualDeputado}
                  onChange={(e) => setEditData({...editData, percentualDeputado: Number(e.target.value)})}
                  className="text-center font-bold text-2xl"
                />
              ) : (
                `${dadosPoliticos.percentualDeputado.toFixed(2)}%`
              )}
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-xs text-purple-700 mb-1">Colocação</div>
            <div className="text-2xl font-bold text-purple-900">
              {isEditing ? (
                <Input
                  value={editData.colocacaoDeputado}
                  onChange={(e) => setEditData({...editData, colocacaoDeputado: e.target.value})}
                  className="text-center font-bold text-2xl"
                />
              ) : (
                dadosPoliticos.colocacaoDeputado
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

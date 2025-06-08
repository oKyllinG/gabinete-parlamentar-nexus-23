
import { useState } from "react"
import { Edit3, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface DadosPoliticos {
  totalEleitores: number
  votosDeputado: number
  percentualDeputado: number
  colocacaoDeputado: string
}

interface ResultadosEleitoraisProps {
  municipio: Municipio
  dadosPoliticos: DadosPoliticos
  onSave: (dados: DadosPoliticos) => void
}

export const ResultadosEleitorais = ({ municipio, dadosPoliticos, onSave }: ResultadosEleitoraisProps) => {
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resultados Eleitorais 2022</CardTitle>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                Salvar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {isEditing ? (
                <Input
                  value={editData.totalEleitores}
                  onChange={(e) => setEditData({...editData, totalEleitores: Number(e.target.value)})}
                  className="text-center text-2xl font-bold"
                />
              ) : (
                dadosPoliticos.totalEleitores.toLocaleString()
              )}
            </div>
            <div className="text-sm text-muted-foreground">Total de Eleitores</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {isEditing ? (
                <Input
                  value={editData.votosDeputado}
                  onChange={(e) => setEditData({...editData, votosDeputado: Number(e.target.value)})}
                  className="text-center text-2xl font-bold"
                />
              ) : (
                dadosPoliticos.votosDeputado
              )}
            </div>
            <div className="text-sm text-muted-foreground">Votos Recebidos</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {isEditing ? (
                <Input
                  value={editData.percentualDeputado}
                  onChange={(e) => setEditData({...editData, percentualDeputado: Number(e.target.value)})}
                  className="text-center text-2xl font-bold"
                />
              ) : (
                `${dadosPoliticos.percentualDeputado.toFixed(2)}%`
              )}
            </div>
            <div className="text-sm text-muted-foreground">Percentual</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {isEditing ? (
                <Input
                  value={editData.colocacaoDeputado}
                  onChange={(e) => setEditData({...editData, colocacaoDeputado: e.target.value})}
                  className="text-center text-2xl font-bold"
                />
              ) : (
                dadosPoliticos.colocacaoDeputado
              )}
            </div>
            <div className="text-sm text-muted-foreground">Colocação</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

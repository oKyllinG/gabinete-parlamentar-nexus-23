import { useState } from "react"
import { Edit3, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface VotacaoHistorica {
  ano: number
  votos: number
}

interface DadosPoliticos {
  totalEleitores: number
  votosDeputado: number
  percentualDeputado: number
  colocacaoDeputado: string
}

interface VotacaoHistoricaManagerProps {
  municipioId: number
  dadosPoliticos: DadosPoliticos
  onUpdateDados: (dados: DadosPoliticos) => void
}

export const VotacaoHistoricaManager = ({ municipioId, dadosPoliticos, onUpdateDados }: VotacaoHistoricaManagerProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editDataResultados, setEditDataResultados] = useState(dadosPoliticos)
  const [votacaoHistorica, setVotacaoHistorica] = useState<VotacaoHistorica[]>(() => {
    const saved = localStorage.getItem(`municipio-${municipioId}-votacao-historica`)
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      { ano: 2002, votos: 199 },
      { ano: 2006, votos: 371 },
      { ano: 2010, votos: 36 },
      { ano: 2014, votos: 65 },
      { ano: 2018, votos: 164 },
      { ano: 2022, votos: dadosPoliticos.votosDeputado }
    ]
  })

  const handleVotacaoChange = (ano: number, novoValor: number) => {
    setVotacaoHistorica(prev => 
      prev.map(item => item.ano === ano ? { ...item, votos: novoValor } : item)
    )
    if (ano === 2022) {
      setEditDataResultados(prev => ({ ...prev, votosDeputado: novoValor }))
    }
  }

  const handleSave = () => {
    localStorage.setItem(`municipio-${municipioId}-votacao-historica`, JSON.stringify(votacaoHistorica))
    const dados2022 = votacaoHistorica.find(v => v.ano === 2022)
    if (dados2022) {
      const novosResultados = { ...editDataResultados, votosDeputado: dados2022.votos }
      onUpdateDados(novosResultados)
      setEditDataResultados(novosResultados)
    }
    setIsEditing(false)
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold text-white">Votação Histórica - Geraldo Resende</CardTitle>
          </div>
          <div className="flex items-center gap-2 no-print">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4" />
                  Salvar
                </Button>
                <Button size="sm" onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                  <X className="h-4 w-4" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Edit3 className="h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 print:p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cyan-600">
                <th className="text-white font-bold text-center p-2 border border-gray-300">
                  ELEITORES<br />2022
                </th>
                {votacaoHistorica.map((item) => (
                  <th key={item.ano} className="text-white font-bold text-center p-2 border border-gray-300">
                    {item.ano}
                  </th>
                ))}
                <th className="text-white font-bold text-center p-2 border border-gray-300">
                  COLOCAÇÃO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center font-medium p-2 border border-gray-300 bg-cyan-100">
                  {dadosPoliticos.totalEleitores.toLocaleString()}
                </td>
                {votacaoHistorica.map((item) => (
                  <td key={item.ano} className="text-center font-medium p-2 border border-gray-300">
                     {item.votos}
                  </td>
                ))}
                <td className="text-center font-medium p-2 border border-gray-300 bg-cyan-100">
                  {dadosPoliticos.colocacaoDeputado}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

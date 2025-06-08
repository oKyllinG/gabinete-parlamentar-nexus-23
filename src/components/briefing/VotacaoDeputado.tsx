
import { useState } from "react"
import { Edit3, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface VotacaoDeputadoProps {
  municipio: Municipio
  dadosPoliticos: DadosPoliticos
  onSave: (dados: DadosPoliticos) => void
}

// Dados históricos mock - podem ser expandidos para serem editáveis também
const votacaoHistorica = [
  { ano: 2002, votos: 199 },
  { ano: 2006, votos: 371 },
  { ano: 2010, votos: 36 },
  { ano: 2014, votos: 65 },
  { ano: 2018, votos: 164 },
  { ano: 2022, votos: 0 } // será substituído pelo valor atual
]

export const VotacaoDeputado = ({ municipio, dadosPoliticos, onSave }: VotacaoDeputadoProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(dadosPoliticos)

  // Substitui o valor de 2022 pelos dados atuais
  const votacaoComDadosAtuais = votacaoHistorica.map(item => 
    item.ano === 2022 ? { ...item, votos: dadosPoliticos.votosDeputado } : item
  )

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
        <CardTitle>Votação do Deputado Geraldo Resende</CardTitle>
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-cyan-500 hover:bg-cyan-500">
                <TableHead className="text-white font-bold text-center">
                  ELEITORES<br />2022
                </TableHead>
                <TableHead className="text-white font-bold text-center" colSpan={6}>
                  VOTOS GERALDO RESENDE
                </TableHead>
                <TableHead className="text-white font-bold text-center">
                  COLOCAÇÃO
                </TableHead>
              </TableRow>
              <TableRow className="bg-cyan-400 hover:bg-cyan-400">
                <TableHead className="text-white font-bold text-center">
                  {isEditing ? (
                    <Input
                      value={editData.totalEleitores}
                      onChange={(e) => setEditData({...editData, totalEleitores: Number(e.target.value)})}
                      className="w-24 text-center text-black"
                    />
                  ) : (
                    dadosPoliticos.totalEleitores.toLocaleString()
                  )}
                </TableHead>
                {votacaoComDadosAtuais.map((item) => (
                  <TableHead key={item.ano} className="text-white font-bold text-center">
                    {item.ano}
                  </TableHead>
                ))}
                <TableHead className="text-white font-bold text-center">
                  {isEditing ? (
                    <Input
                      value={editData.colocacaoDeputado}
                      onChange={(e) => setEditData({...editData, colocacaoDeputado: e.target.value})}
                      className="w-16 text-center text-black"
                    />
                  ) : (
                    dadosPoliticos.colocacaoDeputado
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center font-medium">
                  {/* Espaço para eleitores */}
                </TableCell>
                {votacaoComDadosAtuais.map((item) => (
                  <TableCell key={item.ano} className="text-center font-medium">
                    {item.ano === 2022 ? (
                      isEditing ? (
                        <Input
                          value={editData.votosDeputado}
                          onChange={(e) => setEditData({...editData, votosDeputado: Number(e.target.value)})}
                          className="w-20 text-center"
                        />
                      ) : (
                        item.votos
                      )
                    ) : (
                      item.votos
                    )}
                  </TableCell>
                ))}
                <TableCell className="text-center font-medium">
                  {/* Espaço para colocação */}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

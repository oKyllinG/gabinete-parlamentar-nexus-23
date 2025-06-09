import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
        </div>
      </CardHeader>
      <CardContent className="p-0 print:p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse deputies-table">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2 border font-semibold print:w-[8%] print:text-[7pt]">Pos.</th>
                <th className="text-left p-2 border font-semibold print:w-[45%]">Nome</th>
                <th className="text-left p-2 border font-semibold print:w-[15%] print:text-[7pt]">Partido</th>
                <th className="text-left p-2 border font-semibold print:w-[16%] print:text-[7pt]">Votos</th>
                <th className="text-left p-2 border font-semibold print:w-[16%] print:text-[7pt]">%</th>
              </tr>
            </thead>
            <tbody>
              {deputadosOrdenados.map((deputado) => (
                <tr key={deputado.id} className="border-b">
                  <td className="p-2 border font-medium print:text-[7pt]">{deputado.colocacao || "-"}</td>
                  <td className="p-2 border">{deputado.nome}</td>
                  <td className="p-2 border print:text-[7pt]">
                    <Badge variant="outline" className="text-xs">{deputado.partido}</Badge>
                  </td>
                  <td className="p-2 border print:text-[7pt]">{deputado.votos.toLocaleString()}</td>
                  <td className="p-2 border print:text-[7pt]">{deputado.percentual.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

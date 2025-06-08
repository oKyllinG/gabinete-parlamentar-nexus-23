
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
}

export const ResultadosEleitorais = ({ municipio, dadosPoliticos }: ResultadosEleitoraisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Eleitorais 2022</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dadosPoliticos.totalEleitores.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total de Eleitores</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dadosPoliticos.votosDeputado}
            </div>
            <div className="text-sm text-muted-foreground">Votos Recebidos</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dadosPoliticos.percentualDeputado.toFixed(2)}%
            </div>
            <div className="text-sm text-muted-foreground">Percentual</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {dadosPoliticos.colocacaoDeputado}
            </div>
            <div className="text-sm text-muted-foreground">Colocação</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface ResultadosEleitoraisProps {
  municipio: Municipio
}

// Dados mock dos resultados eleitorais
const resultadosData = {
  totalEleitores: 12244,
  votos: 400,
  percentual: 3.27,
  colocacao: 5
}

export const ResultadosEleitorais = ({ municipio }: ResultadosEleitoraisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Eleitorais 2022</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {resultadosData.totalEleitores.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total de Eleitores</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {resultadosData.votos}
            </div>
            <div className="text-sm text-muted-foreground">Votos Recebidos</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {resultadosData.percentual}%
            </div>
            <div className="text-sm text-muted-foreground">Percentual</div>
          </div>
          
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">
              {resultadosData.colocacao}ª
            </div>
            <div className="text-sm text-muted-foreground">Colocação</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

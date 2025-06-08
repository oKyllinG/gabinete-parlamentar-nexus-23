
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface VotacaoDeputadoProps {
  municipio: Municipio
}

// Dados mock da votação do deputado (baseado na imagem fornecida)
const votacaoData = {
  eleitores2022: 12244,
  anos: [
    { ano: 2002, votos: 199 },
    { ano: 2006, votos: 371 },
    { ano: 2010, votos: 36 },
    { ano: 2014, votos: 65 },
    { ano: 2018, votos: 164 },
    { ano: 2022, votos: 400 }
  ],
  colocacao: "5ª"
}

export const VotacaoDeputado = ({ municipio }: VotacaoDeputadoProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Votação do Deputado Geraldo Resende</CardTitle>
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
                  {votacaoData.eleitores2022.toLocaleString()}
                </TableHead>
                {votacaoData.anos.map((item) => (
                  <TableHead key={item.ano} className="text-white font-bold text-center">
                    {item.ano}
                  </TableHead>
                ))}
                <TableHead className="text-white font-bold text-center">
                  {votacaoData.colocacao}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center font-medium">
                  {/* Espaço para eleitores */}
                </TableCell>
                {votacaoData.anos.map((item) => (
                  <TableCell key={item.ano} className="text-center font-medium">
                    {item.votos}
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

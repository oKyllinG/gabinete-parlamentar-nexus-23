
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
}

interface DeputadosTableProps {
  tipo: "federal" | "estadual"
  municipio: Municipio
  deputados: Deputado[]
}

export const DeputadosTable = ({ tipo, municipio, deputados }: DeputadosTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pos.</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Partido</TableHead>
          <TableHead className="text-right">Votos</TableHead>
          <TableHead className="text-right">%</TableHead>
          <TableHead>Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deputados.length > 0 ? (
          deputados.map((deputado, index) => (
            <TableRow key={deputado.id}>
              <TableCell>{index + 1}º</TableCell>
              <TableCell className="font-medium">{deputado.nome}</TableCell>
              <TableCell>{deputado.partido}</TableCell>
              <TableCell className="text-right">{deputado.votos.toLocaleString()}</TableCell>
              <TableCell className="text-right">{deputado.percentual.toFixed(2)}%</TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {deputado.telefone || "Sem telefone"}
                </span>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              Nenhum deputado cadastrado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

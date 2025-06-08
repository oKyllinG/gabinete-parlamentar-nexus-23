
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  municipio: { nome: string }
  deputados: Deputado[]
}

export const DeputadosTable = ({ tipo, municipio, deputados }: DeputadosTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Partido</TableHead>
            <TableHead>Votos</TableHead>
            <TableHead>%</TableHead>
            <TableHead>Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deputados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Nenhum deputado {tipo} cadastrado para {municipio.nome}
              </TableCell>
            </TableRow>
          ) : (
            deputados.map((deputado) => (
              <TableRow key={deputado.id}>
                <TableCell className="font-medium">{deputado.nome}</TableCell>
                <TableCell>{deputado.partido}</TableCell>
                <TableCell>{deputado.votos.toLocaleString()}</TableCell>
                <TableCell>{deputado.percentual.toFixed(2)}%</TableCell>
                <TableCell>{deputado.telefone}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

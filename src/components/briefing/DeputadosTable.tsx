
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
  colocacao?: number
}

interface DeputadosTableProps {
  tipo: "federal" | "estadual"
  municipio: { nome: string }
  deputados: Deputado[]
}

export const DeputadosTable = ({ tipo, municipio, deputados }: DeputadosTableProps) => {
  // Ordenar deputados por colocação (menor número = melhor colocação)
  const deputadosOrdenados = [...deputados].sort((a, b) => {
    if (a.colocacao && b.colocacao) {
      return a.colocacao - b.colocacao
    }
    if (a.colocacao && !b.colocacao) return -1
    if (!a.colocacao && b.colocacao) return 1
    return 0
  })

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Colocação</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Partido</TableHead>
            <TableHead>Votos</TableHead>
            <TableHead>%</TableHead>
            <TableHead>Telefone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deputadosOrdenados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Nenhum deputado {tipo} cadastrado para {municipio.nome}
              </TableCell>
            </TableRow>
          ) : (
            deputadosOrdenados.map((deputado) => (
              <TableRow key={deputado.id}>
                <TableCell className="font-medium">
                  {deputado.colocacao ? `${deputado.colocacao}°` : "-"}
                </TableCell>
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

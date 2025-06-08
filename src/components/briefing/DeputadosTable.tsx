
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface DeputadosTableProps {
  tipo: "federal" | "estadual"
  municipio: Municipio
}

// Dados mock dos deputados
const deputadosFederais = [
  { nome: "Deputado Federal 1", partido: "PSDB", votos: 1250 },
  { nome: "Deputado Federal 2", partido: "PT", votos: 980 },
  { nome: "Deputado Federal 3", partido: "MDB", votos: 750 }
]

const deputadosEstaduais = [
  { nome: "Deputado Estadual 1", partido: "PSDB", votos: 890 },
  { nome: "Deputado Estadual 2", partido: "PP", votos: 650 },
  { nome: "Deputado Estadual 3", partido: "PL", votos: 520 }
]

export const DeputadosTable = ({ tipo, municipio }: DeputadosTableProps) => {
  const deputados = tipo === "federal" ? deputadosFederais : deputadosEstaduais

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Partido</TableHead>
          <TableHead className="text-right">Votos</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {deputados.map((deputado, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{deputado.nome}</TableCell>
            <TableCell>{deputado.partido}</TableCell>
            <TableCell className="text-right">{deputado.votos.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

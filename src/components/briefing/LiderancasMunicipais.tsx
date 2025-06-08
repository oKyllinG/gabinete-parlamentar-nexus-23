
import { useState } from "react"
import { Plus, Edit3, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface LiderancasMunicipaisProps {
  municipio: Municipio
}

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  foto?: string
}

// Dados mock das lideranças
const liderancasData: Lideranca[] = [
  {
    id: 1,
    nome: "João Silva",
    cargo: "Prefeito",
    partido: "PSDB",
    telefone: "(67) 99999-9999"
  },
  {
    id: 2,
    nome: "Maria Santos",
    cargo: "Vereadora",
    partido: "PT",
    telefone: "(67) 88888-8888"
  }
]

export const LiderancasMunicipais = ({ municipio }: LiderancasMunicipaisProps) => {
  const [liderancas, setLiderancas] = useState<Lideranca[]>(liderancasData)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lideranças Municipais</CardTitle>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Liderança
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liderancas.map((lideranca) => (
            <div key={lideranca.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                <AvatarFallback>
                  {lideranca.nome.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{lideranca.nome}</h4>
                  <Badge variant="secondary">{lideranca.partido}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{lideranca.cargo}</p>
                <p className="text-sm text-muted-foreground">{lideranca.telefone}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

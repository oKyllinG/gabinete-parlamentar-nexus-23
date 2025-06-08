
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus } from "lucide-react"

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
  prefeito?: {
    nome: string
    partido: string
    votos: number
    telefone: string
  }
  vicePrefeito?: {
    nome: string
    partido: string
    telefone: string
  }
  secretarios?: Array<{
    nome: string
    cargo: string
    telefone: string
  }>
  presidentes?: Array<{
    nome: string
    partido: string
    votos: number
    telefone: string
  }>
}

interface EditarDadosPoliticosProps {
  municipio: Municipio
  dados?: DadosPoliticos
  onSave: (dados: DadosPoliticos) => void
  trigger?: React.ReactNode
}

export const EditarDadosPoliticos = ({ municipio, dados, onSave, trigger }: EditarDadosPoliticosProps) => {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<DadosPoliticos>({
    totalEleitores: dados?.totalEleitores || 0,
    votosDeputado: dados?.votosDeputado || 0,
    percentualDeputado: dados?.percentualDeputado || 0,
    colocacaoDeputado: dados?.colocacaoDeputado || "1ª",
    prefeito: dados?.prefeito || { nome: "", partido: "", votos: 0, telefone: "" },
    vicePrefeito: dados?.vicePrefeito || { nome: "", partido: "", telefone: "" },
    secretarios: dados?.secretarios || [],
    presidentes: dados?.presidentes || []
  })

  const handleSave = () => {
    onSave(formData)
    setOpen(false)
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Edit className="h-4 w-4 mr-2" />
      Editar Dados
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Dados Políticos - {municipio.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dados Eleitorais */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dados Eleitorais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="totalEleitores">Total de Eleitores</Label>
                <Input
                  id="totalEleitores"
                  type="number"
                  value={formData.totalEleitores}
                  onChange={(e) => setFormData(prev => ({ ...prev, totalEleitores: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="votosDeputado">Votos do Deputado</Label>
                <Input
                  id="votosDeputado"
                  type="number"
                  value={formData.votosDeputado}
                  onChange={(e) => setFormData(prev => ({ ...prev, votosDeputado: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="percentualDeputado">Percentual (%)</Label>
                <Input
                  id="percentualDeputado"
                  type="number"
                  step="0.01"
                  value={formData.percentualDeputado}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentualDeputado: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="colocacaoDeputado">Colocação</Label>
                <Select value={formData.colocacaoDeputado} onValueChange={(value) => setFormData(prev => ({ ...prev, colocacaoDeputado: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ª">1ª</SelectItem>
                    <SelectItem value="2ª">2ª</SelectItem>
                    <SelectItem value="3ª">3ª</SelectItem>
                    <SelectItem value="4ª">4ª</SelectItem>
                    <SelectItem value="5ª">5ª</SelectItem>
                    <SelectItem value="6ª">6ª</SelectItem>
                    <SelectItem value="7ª">7ª</SelectItem>
                    <SelectItem value="8ª">8ª</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Prefeito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Prefeito</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prefeitoNome">Nome</Label>
                <Input
                  id="prefeitoNome"
                  value={formData.prefeito?.nome || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    prefeito: { ...prev.prefeito!, nome: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="prefeitoPartido">Partido</Label>
                <Input
                  id="prefeitoPartido"
                  value={formData.prefeito?.partido || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    prefeito: { ...prev.prefeito!, partido: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="prefeitoVotos">Votos</Label>
                <Input
                  id="prefeitoVotos"
                  type="number"
                  value={formData.prefeito?.votos || 0}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    prefeito: { ...prev.prefeito!, votos: Number(e.target.value) }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="prefeitoTelefone">Telefone</Label>
                <Input
                  id="prefeitoTelefone"
                  value={formData.prefeito?.telefone || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    prefeito: { ...prev.prefeito!, telefone: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>

          {/* Vice-Prefeito */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vice-Prefeito</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vicePrefeitoNome">Nome</Label>
                <Input
                  id="vicePrefeitoNome"
                  value={formData.vicePrefeito?.nome || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vicePrefeito: { ...prev.vicePrefeito!, nome: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="vicePrefeitoPartido">Partido</Label>
                <Input
                  id="vicePrefeitoPartido"
                  value={formData.vicePrefeito?.partido || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vicePrefeito: { ...prev.vicePrefeito!, partido: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="vicePrefeitoTelefone">Telefone</Label>
                <Input
                  id="vicePrefeitoTelefone"
                  value={formData.vicePrefeito?.telefone || ""}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    vicePrefeito: { ...prev.vicePrefeito!, telefone: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

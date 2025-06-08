
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
}

interface GerenciarDeputadosProps {
  tipo: "federal" | "estadual"
  municipio: { nome: string }
  deputados: Deputado[]
  onSave: (deputados: Deputado[]) => void
}

export const GerenciarDeputados = ({ tipo, municipio, deputados, onSave }: GerenciarDeputadosProps) => {
  const [open, setOpen] = useState(false)
  const [editingDeputado, setEditingDeputado] = useState<Deputado | null>(null)
  const [formData, setFormData] = useState<Omit<Deputado, 'id'>>({
    nome: "",
    partido: "",
    votos: 0,
    percentual: 0,
    telefone: ""
  })

  const handleAddDeputado = () => {
    const newDeputado: Deputado = {
      id: Date.now().toString(),
      ...formData
    }
    onSave([...deputados, newDeputado])
    setFormData({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "" })
  }

  const handleEditDeputado = (deputado: Deputado) => {
    setEditingDeputado(deputado)
    setFormData({
      nome: deputado.nome,
      partido: deputado.partido,
      votos: deputado.votos,
      percentual: deputado.percentual,
      telefone: deputado.telefone
    })
  }

  const handleUpdateDeputado = () => {
    if (!editingDeputado) return
    
    const updatedDeputados = deputados.map(dep => 
      dep.id === editingDeputado.id 
        ? { ...editingDeputado, ...formData }
        : dep
    )
    onSave(updatedDeputados)
    setEditingDeputado(null)
    setFormData({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "" })
  }

  const handleDeleteDeputado = (id: string) => {
    onSave(deputados.filter(dep => dep.id !== id))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Gerenciar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Gerenciar Deputados {tipo === "federal" ? "Federais" : "Estaduais"} - {municipio.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário */}
          <div className="border p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold">
              {editingDeputado ? "Editar" : "Adicionar"} Deputado
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="partido">Partido</Label>
                <Input
                  id="partido"
                  value={formData.partido}
                  onChange={(e) => setFormData(prev => ({ ...prev, partido: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="votos">Votos</Label>
                <Input
                  id="votos"
                  type="number"
                  value={formData.votos}
                  onChange={(e) => setFormData(prev => ({ ...prev, votos: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="percentual">Percentual (%)</Label>
                <Input
                  id="percentual"
                  type="number"
                  step="0.01"
                  value={formData.percentual}
                  onChange={(e) => setFormData(prev => ({ ...prev, percentual: Number(e.target.value) }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              {editingDeputado ? (
                <>
                  <Button onClick={handleUpdateDeputado}>Atualizar</Button>
                  <Button variant="outline" onClick={() => {
                    setEditingDeputado(null)
                    setFormData({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "" })
                  }}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button onClick={handleAddDeputado}>Adicionar</Button>
              )}
            </div>
          </div>

          {/* Lista de Deputados */}
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Partido</TableHead>
                  <TableHead>Votos</TableHead>
                  <TableHead>%</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deputados.map((deputado) => (
                  <TableRow key={deputado.id}>
                    <TableCell>{deputado.nome}</TableCell>
                    <TableCell>{deputado.partido}</TableCell>
                    <TableCell>{deputado.votos.toLocaleString()}</TableCell>
                    <TableCell>{deputado.percentual.toFixed(2)}%</TableCell>
                    <TableCell>{deputado.telefone}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditDeputado(deputado)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive"
                          onClick={() => handleDeleteDeputado(deputado.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {deputados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      Nenhum deputado cadastrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

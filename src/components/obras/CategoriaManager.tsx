
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Save, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Categoria {
  id: string
  nome: string
  descricao: string
  cor: string
  obrasVinculadas: number
}

interface CategoriaManagerProps {
  onClose: () => void
}

const coresDisponiveis = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#84CC16", // Lime
  "#EC4899", // Pink
  "#6B7280"  // Gray
]

export function CategoriaManager({ onClose }: CategoriaManagerProps) {
  const { toast } = useToast()
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: "1", nome: "Infraestrutura", descricao: "Obras de infraestrutura urbana", cor: "#3B82F6", obrasVinculadas: 8 },
    { id: "2", nome: "Saúde", descricao: "Equipamentos e obras de saúde", cor: "#10B981", obrasVinculadas: 5 },
    { id: "3", nome: "Educação", descricao: "Escolas e equipamentos educacionais", cor: "#F59E0B", obrasVinculadas: 12 },
    { id: "4", nome: "Segurança", descricao: "Delegacias e equipamentos de segurança", cor: "#EF4444", obrasVinculadas: 3 },
    { id: "5", nome: "Meio Ambiente", descricao: "Obras ambientais e sustentáveis", cor: "#84CC16", obrasVinculadas: 2 },
    { id: "6", nome: "Cultura", descricao: "Centros culturais e bibliotecas", cor: "#8B5CF6", obrasVinculadas: 4 },
    { id: "7", nome: "Esporte", descricao: "Quadras e complexos esportivos", cor: "#06B6D4", obrasVinculadas: 6 },
    { id: "8", nome: "Habitação", descricao: "Conjuntos habitacionais", cor: "#EC4899", obrasVinculadas: 1 }
  ])

  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [newCategoria, setNewCategoria] = useState({
    nome: "",
    descricao: "",
    cor: coresDisponiveis[0]
  })

  const handleEdit = (categoria: Categoria) => {
    setEditingCategoria({ ...categoria })
  }

  const handleSaveEdit = () => {
    if (!editingCategoria?.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive"
      })
      return
    }

    setCategorias(categorias.map(cat => 
      cat.id === editingCategoria.id ? editingCategoria : cat
    ))
    setEditingCategoria(null)
    
    toast({
      title: "Categoria atualizada",
      description: "A categoria foi atualizada com sucesso."
    })
  }

  const handleDelete = (categoria: Categoria) => {
    if (categoria.obrasVinculadas > 0) {
      toast({
        title: "Não é possível excluir",
        description: `Esta categoria possui ${categoria.obrasVinculadas} obra(s) vinculada(s).`,
        variant: "destructive"
      })
      return
    }

    setCategorias(categorias.filter(cat => cat.id !== categoria.id))
    
    toast({
      title: "Categoria excluída",
      description: "A categoria foi excluída com sucesso."
    })
  }

  const handleAddNew = () => {
    if (!newCategoria.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "O nome da categoria é obrigatório.",
        variant: "destructive"
      })
      return
    }

    const novaCategoria: Categoria = {
      id: Date.now().toString(),
      nome: newCategoria.nome,
      descricao: newCategoria.descricao,
      cor: newCategoria.cor,
      obrasVinculadas: 0
    }

    setCategorias([...categorias, novaCategoria])
    setNewCategoria({ nome: "", descricao: "", cor: coresDisponiveis[0] })
    setShowNewForm(false)
    
    toast({
      title: "Categoria criada",
      description: "A nova categoria foi criada com sucesso."
    })
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Gerenciar Categorias de Obras
            <Button onClick={() => setShowNewForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* New Category Form */}
          {showNewForm && (
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-medium mb-3">Nova Categoria</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="new-nome">Nome *</Label>
                  <Input
                    id="new-nome"
                    value={newCategoria.nome}
                    onChange={(e) => setNewCategoria({ ...newCategoria, nome: e.target.value })}
                    placeholder="Ex: Meio Ambiente"
                  />
                </div>
                <div>
                  <Label htmlFor="new-descricao">Descrição</Label>
                  <Input
                    id="new-descricao"
                    value={newCategoria.descricao}
                    onChange={(e) => setNewCategoria({ ...newCategoria, descricao: e.target.value })}
                    placeholder="Breve descrição da categoria"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <Label>Cor da Categoria</Label>
                <div className="flex gap-2 mt-2">
                  {coresDisponiveis.map((cor) => (
                    <button
                      key={cor}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategoria.cor === cor ? 'border-gray-900' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: cor }}
                      onClick={() => setNewCategoria({ ...newCategoria, cor })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowNewForm(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleAddNew}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </div>
          )}

          {/* Categories List */}
          <div className="grid gap-3">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {editingCategoria?.id === categoria.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome *</Label>
                        <Input
                          value={editingCategoria.nome}
                          onChange={(e) => setEditingCategoria({ 
                            ...editingCategoria, 
                            nome: e.target.value 
                          })}
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Input
                          value={editingCategoria.descricao}
                          onChange={(e) => setEditingCategoria({ 
                            ...editingCategoria, 
                            descricao: e.target.value 
                          })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Cor</Label>
                      <div className="flex gap-2 mt-2">
                        {coresDisponiveis.map((cor) => (
                          <button
                            key={cor}
                            className={`w-8 h-8 rounded-full border-2 ${
                              editingCategoria.cor === cor ? 'border-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: cor }}
                            onClick={() => setEditingCategoria({ 
                              ...editingCategoria, 
                              cor 
                            })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditingCategoria(null)}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSaveEdit}>
                        <Save className="w-4 h-4 mr-2" />
                        Salvar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: categoria.cor }}
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{categoria.nome}</h4>
                        <p className="text-sm text-muted-foreground">{categoria.descricao}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {categoria.obrasVinculadas} obra(s)
                      </Badge>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(categoria)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(categoria)}
                          disabled={categoria.obrasVinculadas > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {categorias.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Nenhuma categoria cadastrada</p>
              <Button onClick={() => setShowNewForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar primeira categoria
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

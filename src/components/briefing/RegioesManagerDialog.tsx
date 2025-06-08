
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Edit3 } from "lucide-react"

interface Regiao {
  nome: string
  cor: string
}

interface RegioesManagerDialogProps {
  regioes: string[]
  onSave: (regioes: string[]) => void
  onCancel: () => void
}

const coresDisponiveis = [
  { nome: "Azul", valor: "bg-blue-100 text-blue-800", preview: "bg-blue-500" },
  { nome: "Verde", valor: "bg-green-100 text-green-800", preview: "bg-green-500" },
  { nome: "Amarelo", valor: "bg-yellow-100 text-yellow-800", preview: "bg-yellow-500" },
  { nome: "Roxo", valor: "bg-purple-100 text-purple-800", preview: "bg-purple-500" },
  { nome: "Vermelho", valor: "bg-red-100 text-red-800", preview: "bg-red-500" },
  { nome: "Cinza", valor: "bg-gray-100 text-gray-800", preview: "bg-gray-500" },
  { nome: "Rosa", valor: "bg-pink-100 text-pink-800", preview: "bg-pink-500" },
  { nome: "Laranja", valor: "bg-orange-100 text-orange-800", preview: "bg-orange-500" },
  { nome: "Índigo", valor: "bg-indigo-100 text-indigo-800", preview: "bg-indigo-500" },
  { nome: "Teal", valor: "bg-teal-100 text-teal-800", preview: "bg-teal-500" }
]

export const RegioesManagerDialog = ({ regioes, onSave, onCancel }: RegioesManagerDialogProps) => {
  const [currentRegioes, setCurrentRegioes] = useState<Regiao[]>(
    regioes.map(regiao => ({
      nome: regiao,
      cor: getDefaultColor(regiao)
    }))
  )
  const [newRegiao, setNewRegiao] = useState("")
  const [newRegiaoColor, setNewRegiaoColor] = useState(coresDisponiveis[0].valor)
  const [editingRegiao, setEditingRegiao] = useState<number | null>(null)

  function getDefaultColor(regiao: string) {
    const colorMap: { [key: string]: string } = {
      "Fronteira": "bg-blue-100 text-blue-800",
      "Norte": "bg-green-100 text-green-800",
      "Pantanal": "bg-yellow-100 text-yellow-800",
      "Bolsão": "bg-purple-100 text-purple-800",
      "Sul": "bg-red-100 text-red-800",
      "Centro": "bg-gray-100 text-gray-800"
    }
    return colorMap[regiao] || "bg-gray-100 text-gray-800"
  }

  const handleAddRegiao = () => {
    if (newRegiao.trim() && !currentRegioes.some(r => r.nome === newRegiao.trim())) {
      setCurrentRegioes(prev => [...prev, { nome: newRegiao.trim(), cor: newRegiaoColor }])
      setNewRegiao("")
      setNewRegiaoColor(coresDisponiveis[0].valor)
    }
  }

  const handleRemoveRegiao = (index: number) => {
    setCurrentRegioes(prev => prev.filter((_, i) => i !== index))
  }

  const handleEditRegiao = (index: number) => {
    setEditingRegiao(index)
  }

  const handleSaveEdit = (index: number, novoNome: string, novaCor: string) => {
    setCurrentRegioes(prev => 
      prev.map((regiao, i) => 
        i === index ? { nome: novoNome, cor: novaCor } : regiao
      )
    )
    setEditingRegiao(null)
  }

  const handleSave = () => {
    onSave(currentRegioes.map(r => r.nome))
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Gerenciar Regiões</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Adicione ou remova regiões conforme necessário. As regiões existentes nos municípios serão atualizadas automaticamente.
          </div>
          
          <div className="space-y-3">
            <Label>Regiões Atuais</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {currentRegioes.map((regiao, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  {editingRegiao === index ? (
                    <EditRegiaoForm
                      regiao={regiao}
                      onSave={(nome, cor) => handleSaveEdit(index, nome, cor)}
                      onCancel={() => setEditingRegiao(null)}
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${regiao.cor.split(' ')[0]}`}></div>
                        <span className="text-sm font-medium">{regiao.nome}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRegiao(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveRegiao(index)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="nova-regiao">Adicionar Nova Região</Label>
            <div className="flex gap-2">
              <Input
                id="nova-regiao"
                value={newRegiao}
                onChange={(e) => setNewRegiao(e.target.value)}
                placeholder="Nome da nova região"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRegiao()}
                className="flex-1"
              />
              <Select value={newRegiaoColor} onValueChange={setNewRegiaoColor}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${newRegiaoColor.split(' ')[0]}`}></div>
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {coresDisponiveis.map(cor => (
                    <SelectItem key={cor.valor} value={cor.valor}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${cor.preview}`}></div>
                        {cor.nome}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                onClick={handleAddRegiao}
                disabled={!newRegiao.trim() || currentRegioes.some(r => r.nome === newRegiao.trim())}
                className="px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const EditRegiaoForm = ({ 
  regiao, 
  onSave, 
  onCancel 
}: { 
  regiao: Regiao
  onSave: (nome: string, cor: string) => void
  onCancel: () => void 
}) => {
  const [nome, setNome] = useState(regiao.nome)
  const [cor, setCor] = useState(regiao.cor)

  const coresDisponiveis = [
    { nome: "Azul", valor: "bg-blue-100 text-blue-800", preview: "bg-blue-500" },
    { nome: "Verde", valor: "bg-green-100 text-green-800", preview: "bg-green-500" },
    { nome: "Amarelo", valor: "bg-yellow-100 text-yellow-800", preview: "bg-yellow-500" },
    { nome: "Roxo", valor: "bg-purple-100 text-purple-800", preview: "bg-purple-500" },
    { nome: "Vermelho", valor: "bg-red-100 text-red-800", preview: "bg-red-500" },
    { nome: "Cinza", valor: "bg-gray-100 text-gray-800", preview: "bg-gray-500" },
    { nome: "Rosa", valor: "bg-pink-100 text-pink-800", preview: "bg-pink-500" },
    { nome: "Laranja", valor: "bg-orange-100 text-orange-800", preview: "bg-orange-500" },
    { nome: "Índigo", valor: "bg-indigo-100 text-indigo-800", preview: "bg-indigo-500" },
    { nome: "Teal", valor: "bg-teal-100 text-teal-800", preview: "bg-teal-500" }
  ]

  return (
    <div className="flex items-center gap-2 w-full">
      <Input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="flex-1"
      />
      <Select value={cor} onValueChange={setCor}>
        <SelectTrigger className="w-24">
          <div className={`w-4 h-4 rounded-full ${cor.split(' ')[0]}`}></div>
        </SelectTrigger>
        <SelectContent>
          {coresDisponiveis.map(corOp => (
            <SelectItem key={corOp.valor} value={corOp.valor}>
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${corOp.preview}`}></div>
                {corOp.nome}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" onClick={() => onSave(nome, cor)}>
        ✓
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        ✕
      </Button>
    </div>
  )
}

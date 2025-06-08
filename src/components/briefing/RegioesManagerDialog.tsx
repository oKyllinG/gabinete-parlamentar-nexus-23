
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus } from "lucide-react"

interface RegioesManagerDialogProps {
  regioes: string[]
  onSave: (regioes: string[]) => void
  onCancel: () => void
}

export const RegioesManagerDialog = ({ regioes, onSave, onCancel }: RegioesManagerDialogProps) => {
  const [currentRegioes, setCurrentRegioes] = useState<string[]>([...regioes])
  const [newRegiao, setNewRegiao] = useState("")

  const handleAddRegiao = () => {
    if (newRegiao.trim() && !currentRegioes.includes(newRegiao.trim())) {
      setCurrentRegioes(prev => [...prev, newRegiao.trim()])
      setNewRegiao("")
    }
  }

  const handleRemoveRegiao = (regiao: string) => {
    setCurrentRegioes(prev => prev.filter(r => r !== regiao))
  }

  const handleSave = () => {
    onSave(currentRegioes)
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
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
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{regiao}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRegiao(regiao)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nova-regiao">Adicionar Nova Região</Label>
            <div className="flex gap-2">
              <Input
                id="nova-regiao"
                value={newRegiao}
                onChange={(e) => setNewRegiao(e.target.value)}
                placeholder="Nome da nova região"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRegiao()}
              />
              <Button
                type="button"
                onClick={handleAddRegiao}
                disabled={!newRegiao.trim() || currentRegioes.includes(newRegiao.trim())}
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
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface EditMunicipioDialogProps {
  municipio: Municipio
  onSave: (municipio: Municipio) => void
  onCancel: () => void
}

const regioes = ["Fronteira", "Norte", "Pantanal", "Bolsão", "Sul", "Centro"]

export const EditMunicipioDialog = ({ municipio, onSave, onCancel }: EditMunicipioDialogProps) => {
  const [assessor, setAssessor] = useState(municipio.assessor || "")
  const [regiao, setRegiao] = useState(municipio.regiao)

  const handleSave = () => {
    onSave({
      ...municipio,
      assessor: assessor.trim() || null,
      regiao
    })
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar {municipio.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Altere as informações do município abaixo. Clique em salvar quando terminar.
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assessor">Assessor</Label>
            <Input
              id="assessor"
              value={assessor}
              onChange={(e) => setAssessor(e.target.value)}
              placeholder="Nome do assessor responsável"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="regiao">Região</Label>
            <Select value={regiao} onValueChange={setRegiao}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regioes.map(r => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

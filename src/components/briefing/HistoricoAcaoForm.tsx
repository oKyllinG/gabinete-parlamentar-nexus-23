
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AcaoDeputado } from "@/types/historicoDeputado"
import { generateId } from "@/utils/historicoDeputadoUtils"

interface HistoricoAcaoFormProps {
  acao?: AcaoDeputado
  municipioNome: string
  onSave: (acao: AcaoDeputado) => void
  onCancel: () => void
}

export const HistoricoAcaoForm = ({ acao, municipioNome, onSave, onCancel }: HistoricoAcaoFormProps) => {
  const [formData, setFormData] = useState<Omit<AcaoDeputado, 'id' | 'municipio' | 'dataRegistro'>>({
    categoria: acao?.categoria || "",
    descricao: acao?.descricao || "",
    valor: acao?.valor || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.categoria || !formData.descricao || formData.valor <= 0) {
      return
    }

    const novaAcao: AcaoDeputado = {
      id: acao?.id || generateId(),
      municipio: municipioNome,
      dataRegistro: acao?.dataRegistro || new Date().toISOString(),
      ...formData
    }

    onSave(novaAcao)
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <Input
          id="categoria"
          value={formData.categoria}
          onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
          placeholder="Digite a categoria (ex: Emendas Parlamentares, Obras, etc.)"
        />
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <Textarea
          id="descricao"
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Descreva a ação ou investimento..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="valor">Valor</Label>
        <Input
          id="valor"
          type="number"
          step="0.01"
          min="0"
          value={formData.valor}
          onChange={(e) => setFormData(prev => ({ ...prev, valor: Number(e.target.value) }))}
          placeholder="0,00"
        />
        {formData.valor > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            {formatCurrency(formData.valor)}
          </p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={!formData.categoria || !formData.descricao || formData.valor <= 0}
        >
          {acao ? "Atualizar" : "Adicionar"}
        </Button>
      </div>
    </form>
  )
}

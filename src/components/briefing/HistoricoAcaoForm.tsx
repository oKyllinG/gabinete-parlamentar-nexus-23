
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AcaoDeputado, CATEGORIAS_HISTORICO } from "@/types/historicoDeputado"
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
    valor: acao?.valor || 0,
    ano: acao?.ano || new Date().getFullYear().toString(),
    observacoes: acao?.observacoes || ""
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
        <Select value={formData.categoria} onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIAS_HISTORICO.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

      <div className="grid grid-cols-2 gap-4">
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

        <div>
          <Label htmlFor="ano">Ano</Label>
          <Input
            id="ano"
            value={formData.ano}
            onChange={(e) => setFormData(prev => ({ ...prev, ano: e.target.value }))}
            placeholder="2024"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="observacoes">Observações (opcional)</Label>
        <Textarea
          id="observacoes"
          value={formData.observacoes}
          onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
          placeholder="Observações adicionais..."
          rows={2}
        />
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

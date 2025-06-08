
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Plus, X, Calendar, DollarSign, Users, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FonteRecurso {
  id: string
  descricao: string
  valor: number
  dataLiberacao: string
}

interface ObraFormData {
  nome: string
  municipio: string
  area: string
  categoria: string
  descricao: string
  justificativa: string
  fontesRecurso: FonteRecurso[]
  status: "Em Planejamento" | "Em Execução" | "Paralisada" | "Concluída"
  percentualExecucao: number
  dataInicioPrevista: string
  dataInicioEfetiva: string
  dataTerminoPrevista: string
  atualizacoes: string
  motivosAtraso: string
  orgaoExecutor: string
  empresaContratada: string
  responsavelGabinete: string
  nivelPrioridade: "Baixa" | "Média" | "Alta" | "Crítica"
  proximasAcoes: string
  dataLembrete: string
  telefoneWhatsapp: string
}

interface ObraFormProps {
  obra?: any
  onClose: () => void
  onSave: (obra: ObraFormData) => void
}

const categorias = [
  "Infraestrutura",
  "Saúde", 
  "Educação",
  "Segurança",
  "Meio Ambiente",
  "Cultura",
  "Esporte",
  "Habitação"
]

export function ObraForm({ obra, onClose, onSave }: ObraFormProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ObraFormData>({
    nome: obra?.nome || "",
    municipio: obra?.municipio || "",
    area: obra?.area || "",
    categoria: obra?.categoria || "",
    descricao: obra?.descricao || "",
    justificativa: obra?.justificativa || "",
    fontesRecurso: obra?.fontesRecurso || [],
    status: obra?.status || "Em Planejamento",
    percentualExecucao: obra?.percentualExecucao || 0,
    dataInicioPrevista: obra?.dataInicioPrevista || "",
    dataInicioEfetiva: obra?.dataInicioEfetiva || "",
    dataTerminoPrevista: obra?.dataTerminoPrevista || "",
    atualizacoes: obra?.atualizacoes || "",
    motivosAtraso: obra?.motivosAtraso || "",
    orgaoExecutor: obra?.orgaoExecutor || "",
    empresaContratada: obra?.empresaContratada || "",
    responsavelGabinete: obra?.responsavelGabinete || "",
    nivelPrioridade: obra?.nivelPrioridade || "Média",
    proximasAcoes: obra?.proximasAcoes || "",
    dataLembrete: obra?.dataLembrete || "",
    telefoneWhatsapp: obra?.telefoneWhatsapp || ""
  })

  const steps = [
    { number: 1, title: "Identificação", icon: <Settings className="w-4 h-4" /> },
    { number: 2, title: "Descrição", icon: <Settings className="w-4 h-4" /> },
    { number: 3, title: "Dados Financeiros", icon: <DollarSign className="w-4 h-4" /> },
    { number: 4, title: "Execução", icon: <Calendar className="w-4 h-4" /> },
    { number: 5, title: "Responsáveis", icon: <Users className="w-4 h-4" /> }
  ]

  const addFonteRecurso = () => {
    const novaFonte: FonteRecurso = {
      id: Date.now().toString(),
      descricao: "",
      valor: 0,
      dataLiberacao: ""
    }
    setFormData({
      ...formData,
      fontesRecurso: [...formData.fontesRecurso, novaFonte]
    })
  }

  const removeFonteRecurso = (id: string) => {
    setFormData({
      ...formData,
      fontesRecurso: formData.fontesRecurso.filter(f => f.id !== id)
    })
  }

  const updateFonteRecurso = (id: string, field: keyof FonteRecurso, value: any) => {
    setFormData({
      ...formData,
      fontesRecurso: formData.fontesRecurso.map(f => 
        f.id === id ? { ...f, [field]: value } : f
      )
    })
  }

  const valorTotal = formData.fontesRecurso.reduce((sum, fonte) => sum + fonte.valor, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleSubmit = () => {
    if (!formData.nome || !formData.municipio || !formData.categoria) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome, município e categoria.",
        variant: "destructive"
      })
      return
    }

    onSave(formData)
    toast({
      title: obra ? "Obra atualizada" : "Obra cadastrada",
      description: "As informações foram salvas com sucesso."
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome da Obra *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Ex: Centro de Saúde Municipal"
                />
              </div>
              <div>
                <Label htmlFor="municipio">Município *</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                  placeholder="Ex: São Paulo"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area">Área/Setor</Label>
                <Input
                  id="area"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  placeholder="Ex: Centro, Zona Norte"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoria da Obra *</Label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição da Obra</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Descreva detalhadamente a obra..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="justificativa">Justificativa</Label>
              <Textarea
                id="justificativa"
                value={formData.justificativa}
                onChange={(e) => setFormData({ ...formData, justificativa: e.target.value })}
                placeholder="Justifique a necessidade da obra..."
                rows={4}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Fontes de Recurso</h4>
              <Button onClick={addFonteRecurso} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Fonte
              </Button>
            </div>

            {formData.fontesRecurso.map((fonte) => (
              <div key={fonte.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="font-medium text-sm">Fonte de Recurso</h5>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFonteRecurso(fonte.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Descrição</Label>
                    <Input
                      value={fonte.descricao}
                      onChange={(e) => updateFonteRecurso(fonte.id, 'descricao', e.target.value)}
                      placeholder="Ex: Emenda Federal"
                    />
                  </div>
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      value={fonte.valor}
                      onChange={(e) => updateFonteRecurso(fonte.id, 'valor', Number(e.target.value))}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label>Data de Liberação</Label>
                    <Input
                      type="date"
                      value={fonte.dataLiberacao}
                      onChange={(e) => updateFonteRecurso(fonte.id, 'dataLiberacao', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {valorTotal > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Valor Total</div>
                <div className="text-2xl font-bold">{formatCurrency(valorTotal)}</div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status da Obra</Label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="Em Planejamento">Em Planejamento</option>
                  <option value="Em Execução">Em Execução</option>
                  <option value="Paralisada">Paralisada</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
              <div>
                <Label>Percentual de Execução: {formData.percentualExecucao}%</Label>
                <Slider
                  value={[formData.percentualExecucao]}
                  onValueChange={(value) => setFormData({ ...formData, percentualExecucao: value[0] })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataInicioPrevista">Início Previsto</Label>
                <Input
                  type="date"
                  id="dataInicioPrevista"
                  value={formData.dataInicioPrevista}
                  onChange={(e) => setFormData({ ...formData, dataInicioPrevista: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dataInicioEfetiva">Início Efetivo</Label>
                <Input
                  type="date"
                  id="dataInicioEfetiva"
                  value={formData.dataInicioEfetiva}
                  onChange={(e) => setFormData({ ...formData, dataInicioEfetiva: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dataTerminoPrevista">Término Previsto</Label>
                <Input
                  type="date"
                  id="dataTerminoPrevista"
                  value={formData.dataTerminoPrevista}
                  onChange={(e) => setFormData({ ...formData, dataTerminoPrevista: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="atualizacoes">Atualizações da Obra</Label>
              <Textarea
                id="atualizacoes"
                value={formData.atualizacoes}
                onChange={(e) => setFormData({ ...formData, atualizacoes: e.target.value })}
                placeholder="Descreva o progresso atual..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="motivosAtraso">Motivos de Atraso</Label>
              <Textarea
                id="motivosAtraso"
                value={formData.motivosAtraso}
                onChange={(e) => setFormData({ ...formData, motivosAtraso: e.target.value })}
                placeholder="Se houver atrasos, descreva os motivos..."
                rows={3}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orgaoExecutor">Órgão/Entidade Executora</Label>
                <Input
                  id="orgaoExecutor"
                  value={formData.orgaoExecutor}
                  onChange={(e) => setFormData({ ...formData, orgaoExecutor: e.target.value })}
                  placeholder="Ex: Prefeitura Municipal"
                />
              </div>
              <div>
                <Label htmlFor="empresaContratada">Empresa Contratada</Label>
                <Input
                  id="empresaContratada"
                  value={formData.empresaContratada}
                  onChange={(e) => setFormData({ ...formData, empresaContratada: e.target.value })}
                  placeholder="Ex: Construtora ABC Ltda"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsavelGabinete">Responsável no Gabinete</Label>
                <Input
                  id="responsavelGabinete"
                  value={formData.responsavelGabinete}
                  onChange={(e) => setFormData({ ...formData, responsavelGabinete: e.target.value })}
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <Label htmlFor="nivelPrioridade">Nível de Prioridade</Label>
                <select
                  value={formData.nivelPrioridade}
                  onChange={(e) => setFormData({ ...formData, nivelPrioridade: e.target.value as any })}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="proximasAcoes">Próximas Ações/Encaminhamentos</Label>
              <Textarea
                id="proximasAcoes"
                value={formData.proximasAcoes}
                onChange={(e) => setFormData({ ...formData, proximasAcoes: e.target.value })}
                placeholder="Descreva as próximas ações necessárias..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataLembrete">Data para Lembrete</Label>
                <Input
                  type="date"
                  id="dataLembrete"
                  value={formData.dataLembrete}
                  onChange={(e) => setFormData({ ...formData, dataLembrete: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="telefoneWhatsapp">Telefone WhatsApp</Label>
                <Input
                  id="telefoneWhatsapp"
                  value={formData.telefoneWhatsapp}
                  onChange={(e) => setFormData({ ...formData, telefoneWhatsapp: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {obra ? "Editar Obra" : "Nova Obra"}
          </DialogTitle>
        </DialogHeader>

        {/* Steps Navigation */}
        <div className="flex justify-between mb-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                currentStep === step.number
                  ? "bg-primary text-primary-foreground"
                  : currentStep > step.number
                  ? "bg-green-100 text-green-800"
                  : "bg-muted text-muted-foreground"
              }`}
              onClick={() => setCurrentStep(step.number)}
            >
              {step.icon}
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            
            {currentStep < steps.length ? (
              <Button onClick={() => setCurrentStep(currentStep + 1)}>
                Próximo
              </Button>
            ) : (
              <Button onClick={handleSubmit}>
                {obra ? "Atualizar" : "Salvar"} Obra
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

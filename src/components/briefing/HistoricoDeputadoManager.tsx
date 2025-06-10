
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2 } from "lucide-react"
import { AcaoDeputado } from "@/types/historicoDeputado"
import { HistoricoAcaoForm } from "./HistoricoAcaoForm"
import { generateId } from "@/utils/historicoDeputadoUtils"

interface HistoricoDeputadoManagerProps {
  acoes: AcaoDeputado[]
  municipioNome: string
  onSave: (acoes: AcaoDeputado[]) => void
}

export const HistoricoDeputadoManager = ({ acoes, municipioNome, onSave }: HistoricoDeputadoManagerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAcao, setEditingAcao] = useState<AcaoDeputado | undefined>()

  // Agrupar ações por categoria
  const acoesAgrupadas = acoes.reduce((grupos, acao) => {
    const categoria = acao.categoria || "Sem Categoria"
    if (!grupos[categoria]) {
      grupos[categoria] = []
    }
    grupos[categoria].push(acao)
    return grupos
  }, {} as Record<string, AcaoDeputado[]>)

  // Calcular total por categoria
  const calcularTotalCategoria = (acoesDaCategoria: AcaoDeputado[]): number => {
    return acoesDaCategoria.reduce((total, acao) => total + acao.valor, 0)
  }

  // Calcular total geral
  const totalGeral = acoes.reduce((total, acao) => total + acao.valor, 0)

  const handleAddAcao = () => {
    setEditingAcao(undefined)
    setIsFormOpen(true)
  }

  const handleEditAcao = (acao: AcaoDeputado) => {
    setEditingAcao(acao)
    setIsFormOpen(true)
  }

  const handleDeleteAcao = (acaoId: string) => {
    const novasAcoes = acoes.filter(acao => acao.id !== acaoId)
    onSave(novasAcoes)
  }

  const handleSaveAcao = (acao: AcaoDeputado) => {
    let novasAcoes: AcaoDeputado[]
    
    if (editingAcao) {
      // Editing existing
      novasAcoes = acoes.map(a => a.id === acao.id ? acao : a)
    } else {
      // Adding new
      novasAcoes = [...acoes, acao]
    }
    
    onSave(novasAcoes)
    setIsFormOpen(false)
    setEditingAcao(undefined)
  }

  const handleCancelForm = () => {
    setIsFormOpen(false)
    setEditingAcao(undefined)
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <Card>
      <CardHeader className="bg-cyan-600 text-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold">Histórico do Deputado em {municipioNome}</CardTitle>
            {totalGeral > 0 && (
              <p className="text-lg font-semibold">
                MAIS DE {formatCurrency(totalGeral)} REPASSADOS AO MUNICÍPIO
              </p>
            )}
          </div>
          <Button onClick={handleAddAcao} size="sm" variant="secondary" className="no-print">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ação
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {Object.keys(acoesAgrupadas).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma ação registrada ainda.</p>
            <p className="text-sm">Clique em "Adicionar Ação" para começar.</p>
          </div>
        ) : (
          <>
            {/* Todas as categorias exibidas verticalmente */}
            {Object.entries(acoesAgrupadas).map(([categoria, acoesDaCategoria]) => (
              <div key={categoria} className="space-y-3">
                <div className="flex items-center justify-between border-b pb-2">
                  <h3 className="text-lg font-semibold text-primary">{categoria}</h3>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(calcularTotalCategoria(acoesDaCategoria))}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {acoesDaCategoria.map((acao) => (
                    <div key={acao.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{acao.descricao}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-medium">
                          {formatCurrency(acao.valor)}
                        </span>
                        <div className="flex items-center gap-2 no-print">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAcao(acao)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAcao(acao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAcao ? "Editar Ação" : "Nova Ação do Deputado"}
              </DialogTitle>
            </DialogHeader>
            <HistoricoAcaoForm
              acao={editingAcao}
              municipioNome={municipioNome}
              onSave={handleSaveAcao}
              onCancel={handleCancelForm}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

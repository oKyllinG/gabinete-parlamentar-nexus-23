
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"
import { AcaoDeputado } from "@/types/historicoDeputado"
import { HistoricoAcaoForm } from "./HistoricoAcaoForm"
import { organizarPorCategorias, calcularTotalGeral } from "@/utils/historicoDeputadoUtils"

interface HistoricoDeputadoManagerProps {
  acoes: AcaoDeputado[]
  municipioNome: string
  onSave: (acoes: AcaoDeputado[]) => void
}

export const HistoricoDeputadoManager = ({ acoes, municipioNome, onSave }: HistoricoDeputadoManagerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAcao, setEditingAcao] = useState<AcaoDeputado | undefined>()

  const categorias = organizarPorCategorias(acoes)
  const totalGeral = calcularTotalGeral(acoes)

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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Histórico do Deputado em {municipioNome}</CardTitle>
          <Button onClick={handleAddAcao} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Ação
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {categorias.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma ação registrada ainda.</p>
            <p className="text-sm">Clique em "Adicionar Ação" para começar.</p>
          </div>
        ) : (
          <>
            {categorias.map((categoria) => (
              <div key={categoria.nome} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-primary">{categoria.nome}</h3>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(categoria.total)}
                  </span>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoria.acoes.map((acao) => (
                      <TableRow key={acao.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{acao.descricao}</p>
                            {acao.observacoes && (
                              <p className="text-sm text-muted-foreground">{acao.observacoes}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{acao.ano}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(acao.valor)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex items-center justify-between text-xl font-bold">
                <span>Total Geral Investido:</span>
                <span className="text-green-600">{formatCurrency(totalGeral)}</span>
              </div>
            </div>
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

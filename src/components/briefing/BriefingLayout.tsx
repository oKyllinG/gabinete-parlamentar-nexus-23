
import { useState } from "react"
import { Edit3, Check, X, Plus, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface DadosPoliticos {
  totalEleitores: number
  votosDeputado: number
  percentualDeputado: number
  colocacaoDeputado: string
}

interface Deputado {
  id: string
  nome: string
  partido: string
  votos: number
  percentual: number
  telefone: string
  colocacao?: number
}

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
}

interface BriefingLayoutProps {
  municipio: Municipio
  dadosPoliticos: DadosPoliticos
  deputadosFederais: Deputado[]
  deputadosEstaduais: Deputado[]
  liderancas: Lideranca[]
  onSaveDadosPoliticos: (dados: DadosPoliticos) => void
  onSaveDeputadosFederais: (deputados: Deputado[]) => void
  onSaveDeputadosEstaduais: (deputados: Deputado[]) => void
  onSaveLiderancas: (liderancas: Lideranca[]) => void
}

export const BriefingLayout = ({ 
  municipio, 
  dadosPoliticos, 
  deputadosFederais,
  deputadosEstaduais,
  liderancas,
  onSaveDadosPoliticos,
  onSaveDeputadosFederais,
  onSaveDeputadosEstaduais,
  onSaveLiderancas
}: BriefingLayoutProps) => {
  const [isEditingResultados, setIsEditingResultados] = useState(false)
  const [editDataResultados, setEditDataResultados] = useState(dadosPoliticos)

  const handleSaveResultados = () => {
    onSaveDadosPoliticos(editDataResultados)
    setIsEditingResultados(false)
  }

  const handleCancelResultados = () => {
    setEditDataResultados(dadosPoliticos)
    setIsEditingResultados(false)
  }

  return (
    <div className="space-y-6 bg-background p-6">
      {/* Header */}
      <div className="bg-slate-100 rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Briefing Municipal</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{municipio.nome}</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 bg-slate-50 px-4 py-2 rounded border">
        Briefing Municipal
      </div>

      {/* Resultados Eleitorais */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              <CardTitle className="text-lg text-slate-800">Resultados Eleitorais</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isEditingResultados ? (
                <>
                  <Button size="sm" onClick={handleSaveResultados} className="bg-green-600 hover:bg-green-700">
                    <Check className="h-4 w-4" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelResultados}>
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditingResultados(true)}
                  className="border-slate-300 hover:bg-slate-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-xs text-blue-700 mb-1">Total de Eleitores</div>
              <div className="text-2xl font-bold text-blue-900">
                {isEditingResultados ? (
                  <Input
                    value={editDataResultados.totalEleitores}
                    onChange={(e) => setEditDataResultados({...editDataResultados, totalEleitores: Number(e.target.value)})}
                    className="text-center font-bold text-2xl"
                  />
                ) : (
                  dadosPoliticos.totalEleitores.toLocaleString()
                )}
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-xs text-green-700 mb-1">Votos do Deputado</div>
              <div className="text-2xl font-bold text-green-900">
                {isEditingResultados ? (
                  <Input
                    value={editDataResultados.votosDeputado}
                    onChange={(e) => setEditDataResultados({...editDataResultados, votosDeputado: Number(e.target.value)})}
                    className="text-center font-bold text-2xl"
                  />
                ) : (
                  dadosPoliticos.votosDeputado.toLocaleString()
                )}
              </div>
            </div>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-xs text-orange-700 mb-1">Porcentagem</div>
              <div className="text-2xl font-bold text-orange-900">
                {isEditingResultados ? (
                  <Input
                    value={editDataResultados.percentualDeputado}
                    onChange={(e) => setEditDataResultados({...editDataResultados, percentualDeputado: Number(e.target.value)})}
                    className="text-center font-bold text-2xl"
                  />
                ) : (
                  `${dadosPoliticos.percentualDeputado.toFixed(2)}%`
                )}
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
              <div className="text-xs text-purple-700 mb-1">Colocação</div>
              <div className="text-2xl font-bold text-purple-900">
                {isEditingResultados ? (
                  <Input
                    value={editDataResultados.colocacaoDeputado}
                    onChange={(e) => setEditDataResultados({...editDataResultados, colocacaoDeputado: e.target.value})}
                    className="text-center font-bold text-2xl"
                  />
                ) : (
                  dadosPoliticos.colocacaoDeputado
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deputados */}
      <div className="grid grid-cols-2 gap-6">
        {/* Deputados Federais */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-800">Deputados Federais</CardTitle>
              <Button size="sm" variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {deputadosFederais.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhum deputado cadastrado
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-slate-600 pb-2 border-b border-slate-200">
                  <div>Pos.</div>
                  <div className="col-span-2">Nome</div>
                  <div>Partido</div>
                  <div>Votos</div>
                  <div>Ações</div>
                </div>
                {deputadosFederais.map((deputado, index) => (
                  <div key={deputado.id} className="grid grid-cols-6 gap-2 text-sm py-2 border-b border-slate-100">
                    <div className="font-medium">{index + 1}</div>
                    <div className="col-span-2">{deputado.nome}</div>
                    <div><Badge variant="outline" className="text-xs">{deputado.partido}</Badge></div>
                    <div>{deputado.votos.toLocaleString()}</div>
                    <div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deputados Estaduais */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-slate-800">Deputados Estaduais</CardTitle>
              <Button size="sm" variant="outline" className="border-slate-300 hover:bg-slate-50">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {deputadosEstaduais.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                Nenhum deputado cadastrado
              </div>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-6 gap-2 text-xs font-medium text-slate-600 pb-2 border-b border-slate-200">
                  <div>Pos.</div>
                  <div className="col-span-2">Nome</div>
                  <div>Partido</div>
                  <div>Votos</div>
                  <div>Ações</div>
                </div>
                {deputadosEstaduais.map((deputado, index) => (
                  <div key={deputado.id} className="grid grid-cols-6 gap-2 text-sm py-2 border-b border-slate-100">
                    <div className="font-medium">{index + 1}</div>
                    <div className="col-span-2">{deputado.nome}</div>
                    <div><Badge variant="outline" className="text-xs">{deputado.partido}</Badge></div>
                    <div>{deputado.votos.toLocaleString()}</div>
                    <div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lideranças Municipais */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              <CardTitle className="text-lg text-slate-800">Lideranças Municipais</CardTitle>
            </div>
            <Button size="sm" variant="outline" className="border-slate-300 hover:bg-slate-50">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {liderancas.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhuma liderança cadastrada
            </div>
          ) : (
            <div className="space-y-4">
              {liderancas.map((lideranca) => (
                <div key={lideranca.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                    <AvatarFallback className="bg-slate-200 text-slate-700">
                      {lideranca.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-slate-800">{lideranca.nome}</h4>
                      <Badge variant="outline" className="text-xs border-slate-300">
                        {lideranca.partido}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600">{lideranca.cargo}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                      <span>Votos: {lideranca.votos?.toLocaleString() || 'N/A'}</span>
                      <span>{lideranca.telefone}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

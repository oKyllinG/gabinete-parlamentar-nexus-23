
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, FileText, Wrench, Building, Target } from "lucide-react"
import { getObrasByMunicipio, getDestinacoesByMunicipio, type Obra, type DestinacaoEmenda } from "@/utils/briefingDataUtils"

interface AcoesDeputadoProps {
  municipioNome: string
}

export const AcoesDeputado = ({ municipioNome }: AcoesDeputadoProps) => {
  const obras = getObrasByMunicipio(municipioNome)
  const destinacoes = getDestinacoesByMunicipio(municipioNome)

  // Agrupar obras por categoria
  const obrasPorCategoria = obras.reduce((acc, obra) => {
    const categoria = obra.categoria || 'Outras'
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(obra)
    return acc
  }, {} as Record<string, Obra[]>)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'concluída':
      case 'concluida':
      case 'aprovada':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'em andamento':
      case 'em_execucao':
      case 'em análise':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'planejada':
      case 'planejamento':
      case 'pendente':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'cancelada':
      case 'reprovada':
        return 'bg-red-100 text-red-800 border-red-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case 'em_execucao':
        return 'Em Execução'
      case 'planejamento':
        return 'Planejamento'
      case 'concluida':
        return 'Concluída'
      case 'cancelada':
        return 'Cancelada'
      default:
        return status
    }
  }

  if (obras.length === 0 && destinacoes.length === 0) {
    return (
      <Card className="border-gray-300">
        <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold">Ações do Deputado</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhuma obra ou destinação de emenda registrada para este município</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-300">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-white rounded"></div>
          <CardTitle className="text-lg font-bold">Ações do Deputado</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Obras Section - Organizadas em grid com melhor aproveitamento */}
        {obras.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-800">Obras e Equipamentos</h3>
              <Badge variant="outline" className="ml-2">{obras.length}</Badge>
            </div>

            {Object.entries(obrasPorCategoria).map(([categoria, obrasCategoria]) => (
              <div key={categoria} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-4 w-4 text-blue-600" />
                  <h4 className="text-md font-semibold text-gray-700">{categoria}</h4>
                  <Badge variant="secondary" className="text-xs">{obrasCategoria.length}</Badge>
                </div>
                
                {/* Grid responsivo que se adapta ao conteúdo */}
                <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {obrasCategoria.map((obra) => (
                    <div key={obra.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <h5 className="font-semibold text-gray-900 text-sm leading-tight flex-1">
                          {obra.titulo}
                        </h5>
                        <Badge className={`ml-2 text-xs ${getStatusColor(obra.status)} flex-shrink-0`}>
                          {obra.status}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {obra.descricao}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="font-semibold text-green-700">{formatCurrency(obra.valor)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span>Início: {formatDate(obra.dataInicio)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-red-500" />
                          <span>Prazo: {formatDate(obra.prazoExecucao)}</span>
                        </div>
                      </div>
                      
                      {obra.observacoes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                          <strong>Obs:</strong> {obra.observacoes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Destinações de Emendas Section */}
        {destinacoes.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-cyan-600" />
              <h3 className="text-lg font-semibold text-gray-800">Destinações de Emendas Parlamentares</h3>
              <Badge variant="outline" className="ml-2">{destinacoes.length}</Badge>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {destinacoes.map((destinacao) => (
                <div key={destinacao.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {destinacao.numero}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm leading-tight">
                        {destinacao.objeto}
                      </h4>
                    </div>
                    <Badge className={`ml-2 text-xs ${getStatusColor(destinacao.status)} flex-shrink-0`}>
                      {getStatusLabel(destinacao.status)}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">{destinacao.destinatario}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Wrench className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">{destinacao.areaAtuacao}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-semibold text-green-700">{formatCurrency(destinacao.valor)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span>Início: {formatDate(destinacao.prazoInicio)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 text-red-500" />
                      <span>Prazo: {formatDate(destinacao.prazoFim)}</span>
                    </div>

                    {destinacao.gnd && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span>GND: {destinacao.gnd}</span>
                      </div>
                    )}
                  </div>
                  
                  {destinacao.observacoes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <strong>Obs:</strong> {destinacao.observacoes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Resumo das Ações</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{obras.length}</div>
              <div className="text-gray-600">Obras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{destinacoes.length}</div>
              <div className="text-gray-600">Destinações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(obras.reduce((sum, obra) => sum + obra.valor, 0))}
              </div>
              <div className="text-gray-600">Total Obras</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(destinacoes.reduce((sum, destinacao) => sum + destinacao.valor, 0))}
              </div>
              <div className="text-gray-600">Total Destinações</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

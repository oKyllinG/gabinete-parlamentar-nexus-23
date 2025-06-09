
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Edit, Plus, Trash2, Phone, User } from "lucide-react"
import { EditableLiderancasMunicipais } from "./EditableLiderancasMunicipais"

interface Lideranca {
  id: number
  nome: string
  cargo: string
  partido: string
  telefone: string
  votos?: number
  foto?: string
  categoria?: string
}

interface LiderancasManagerProps {
  liderancas: Lideranca[]
  onSave: (liderancas: Lideranca[]) => void
}

const getCategoriaFromCargo = (cargo: string): string => {
  const CATEGORIAS = {
    "Executivo Municipal": [
      "Prefeito", "Prefeita",
      "Vice-Prefeito", "Vice-Prefeita", 
      "Chefe de Gabinete"
    ],
    "Secretários": [
      "Secretário de Administração", "Secretária de Administração",
      "Secretário de Agricultura", "Secretária de Agricultura",
      "Secretário de Assistência Social", "Secretária de Assistência Social",
      "Secretário de Cultura", "Secretária de Cultura",
      "Secretário de Desenvolvimento Econômico", "Secretária de Desenvolvimento Econômico",
      "Secretário de Educação", "Secretária de Educação",
      "Secretário de Esporte e Lazer", "Secretária de Esporte e Lazer",
      "Secretário de Fazenda", "Secretária de Fazenda",
      "Secretário de Infraestrutura", "Secretária de Infraestrutura",
      "Secretário de Meio Ambiente", "Secretária de Meio Ambiente",
      "Secretário de Obras", "Secretária de Obras",
      "Secretário de Planejamento", "Secretária de Planejamento",
      "Secretário de Saúde", "Secretária de Saúde",
      "Secretário de Segurança", "Secretária de Segurança",
      "Secretário de Transporte", "Secretária de Transporte",
      "Secretário de Turismo", "Secretária de Turismo",
      "Secretário de Habitação", "Secretária de Habitação"
    ],
    "Câmara Municipal": [
      "Presidente da Câmara Municipal",
      "1º Vice-Presidente da Câmara", "1ª Vice-Presidente da Câmara",
      "2º Vice-Presidente da Câmara", "2ª Vice-Presidente da Câmara", 
      "1º Secretário da Câmara", "1ª Secretária da Câmara",
      "2º Secretário da Câmara", "2ª Secretária da Câmara",
      "Vereador", "Vereadora"
    ]
  }

  for (const [categoria, cargos] of Object.entries(CATEGORIAS)) {
    if (cargos.includes(cargo)) {
      return categoria
    }
  }
  return "Outros"
}

// Função para determinar a hierarquia dos cargos da Câmara Municipal
const getHierarquiaCamara = (cargo: string): number => {
  const hierarquia = {
    "Presidente da Câmara Municipal": 1,
    "1º Vice-Presidente da Câmara": 2,
    "1ª Vice-Presidente da Câmara": 2,
    "2º Vice-Presidente da Câmara": 3,
    "2ª Vice-Presidente da Câmara": 3,
    "1º Secretário da Câmara": 4,
    "1ª Secretária da Câmara": 4,
    "2º Secretário da Câmara": 5,
    "2ª Secretária da Câmara": 5,
    "Vereador": 6,
    "Vereadora": 6
  }
  return hierarquia[cargo] || 999
}

// Função para ordenar lideranças da Câmara Municipal
const ordenarLiderancasCamara = (liderancas: Lideranca[]): Lideranca[] => {
  return liderancas.sort((a, b) => {
    const hierarquiaA = getHierarquiaCamara(a.cargo)
    const hierarquiaB = getHierarquiaCamara(b.cargo)
    
    // Primeiro por hierarquia
    if (hierarquiaA !== hierarquiaB) {
      return hierarquiaA - hierarquiaB
    }
    
    // Depois por votos (decrescente)
    const votosA = a.votos || 0
    const votosB = b.votos || 0
    return votosB - votosA
  })
}

export const LiderancasManager = ({ liderancas, onSave }: LiderancasManagerProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const formatVotes = (votos?: number) => {
    if (!votos || votos === 0) return null
    return votos.toLocaleString('pt-BR')
  }

  // Adicionar categoria às lideranças se não existir
  const liderancasComCategoria = liderancas.map(lideranca => ({
    ...lideranca,
    categoria: lideranca.categoria || getCategoriaFromCargo(lideranca.cargo)
  }))

  // Organizar por categoria
  const liderancasPorCategoria = liderancasComCategoria.reduce((acc, lideranca) => {
    const categoria = lideranca.categoria
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(lideranca)
    return acc
  }, {} as Record<string, Lideranca[]>)

  // Ordenar lideranças da Câmara Municipal por hierarquia e votos
  if (liderancasPorCategoria["Câmara Municipal"]) {
    liderancasPorCategoria["Câmara Municipal"] = ordenarLiderancasCamara(liderancasPorCategoria["Câmara Municipal"])
  }

  if (isEditing) {
    return (
      <EditableLiderancasMunicipais
        liderancas={liderancasComCategoria}
        onSave={(novasLiderancas) => {
          onSave(novasLiderancas)
          setIsEditing(false)
        }}
        onCancel={() => setIsEditing(false)}
      />
    )
  }

  return (
    <Card className="border-gray-300 print-friendly">
      <CardHeader className="bg-cyan-600 text-white border-b border-gray-300 print:bg-gray-100 print:text-black print:border-gray-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded print:bg-gray-600"></div>
            <CardTitle className="text-lg font-bold">Lideranças Municipais</CardTitle>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="secondary"
            size="sm"
            className="no-print bg-white text-cyan-600 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 print:p-4">
        {liderancasComCategoria.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>Nenhuma liderança cadastrada</p>
            <Button
              onClick={() => setIsEditing(true)}
              className="mt-4 no-print"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeira Liderança
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(liderancasPorCategoria).map(([categoria, liderancasCategoria]) => (
              <div key={categoria} className="space-y-4">
                <h3 className="text-lg font-semibold text-cyan-700 border-b border-gray-200 pb-2 print:text-gray-800">
                  {categoria}
                </h3>
                <div className="grid gap-4">
                  {liderancasCategoria.map((lideranca) => {
                    const formattedVotes = formatVotes(lideranca.votos)
                    
                    return (
                      <div key={lideranca.id} className="border rounded-lg p-4 bg-gray-50 print:bg-white print:border-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                          {/* Avatar */}
                          <div className="md:col-span-1 flex justify-center md:justify-start">
                            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                              {lideranca.foto ? (
                                <img 
                                  src={lideranca.foto} 
                                  alt={lideranca.nome}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="h-10 w-10 text-gray-600" />
                              )}
                            </div>
                          </div>
                          
                          {/* Nome e Cargo */}
                          <div className="md:col-span-4 text-center md:text-left">
                            <h4 className="font-semibold text-gray-900">{lideranca.nome}</h4>
                            <p className="text-sm text-gray-600">{lideranca.cargo}</p>
                          </div>
                          
                          {/* Partido */}
                          <div className="md:col-span-2 text-center">
                            <Badge variant="outline" className="font-semibold">
                              {lideranca.partido}
                            </Badge>
                          </div>
                          
                          {/* Telefone */}
                          <div className="md:col-span-3 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm text-gray-700">{lideranca.telefone}</span>
                            </div>
                          </div>
                          
                          {/* Votos */}
                          <div className="md:col-span-2 text-center">
                            {formattedVotes && (
                              <div className="text-sm">
                                <span className="font-semibold text-green-700">{formattedVotes}</span>
                                <span className="text-gray-500 block text-xs">votos</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

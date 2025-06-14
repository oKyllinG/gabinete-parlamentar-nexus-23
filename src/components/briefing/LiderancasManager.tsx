import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Edit, Plus, Phone, User } from "lucide-react"
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

// Mock photos for different leadership positions
const getMockPhoto = (cargo: string, nome: string): string => {
  const mockPhotos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face"
  ]
  
  // Use a simple hash of the name to consistently assign the same photo to the same person
  const hash = nome.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  
  return mockPhotos[Math.abs(hash) % mockPhotos.length]
}

export const LiderancasManager = ({ liderancas, onSave }: LiderancasManagerProps) => {
  const [isEditing, setIsEditing] = useState(false)

  const formatVotes = (votos?: number) => {
    if (!votos || votos === 0) return null
    return votos.toLocaleString('pt-BR')
  }

  const liderancasComCategoria = liderancas.map(lideranca => ({
    ...lideranca,
    categoria: lideranca.categoria || getCategoriaFromCargo(lideranca.cargo),
    foto: lideranca.foto || getMockPhoto(lideranca.cargo, lideranca.nome)
  }))

  // Ordenar todas as lideranças em uma única sequência
  const liderancasOrdenadas = liderancasComCategoria.sort((a, b) => {
    // Primeiro: Executivo Municipal
    if (a.categoria === "Executivo Municipal" && b.categoria !== "Executivo Municipal") return -1
    if (a.categoria !== "Executivo Municipal" && b.categoria === "Executivo Municipal") return 1
    
    // Segundo: Secretários
    if (a.categoria === "Secretários" && b.categoria === "Câmara Municipal") return -1
    if (a.categoria === "Câmara Municipal" && b.categoria === "Secretários") return 1
    
    // Se ambos são da Câmara, usar hierarquia específica
    if (a.categoria === "Câmara Municipal" && b.categoria === "Câmara Municipal") {
      const hierarquiaA = getHierarquiaCamara(a.cargo)
      const hierarquiaB = getHierarquiaCamara(b.cargo)
      
      if (hierarquiaA !== hierarquiaB) {
        return hierarquiaA - hierarquiaB
      }
      
      const votosA = a.votos || 0
      const votosB = b.votos || 0
      return votosB - votosA
    }
    
    // Para outras categorias, manter ordem original
    return 0
  })

  // Agrupar por categoria para mostrar os títulos
  const liderancasPorCategoria = liderancasOrdenadas.reduce((acc, lideranca) => {
    const categoria = lideranca.categoria || getCategoriaFromCargo(lideranca.cargo)
    if (!acc[categoria]) {
      acc[categoria] = []
    }
    acc[categoria].push(lideranca)
    return acc
  }, {} as Record<string, typeof liderancasOrdenadas>)

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
    <Card className="border-border">
      <CardHeader className="bg-blue-600 text-white border-b border-border print-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-white rounded"></div>
            <CardTitle className="text-lg font-bold text-white">Lideranças Municipais</CardTitle>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="secondary"
            size="sm"
            className="no-print"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 print-card-content">
        {liderancasComCategoria.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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
          <div className="space-y-4 print:space-y-0">
            {Object.entries(liderancasPorCategoria).map(([categoria, liderancasCategoria]) => (
              <div key={categoria} className="lideranca-categoria">
                <h3 className="text-lg font-semibold text-primary border-b pb-2 mb-3 print:text-sm print:mb-1 print:pb-1">
                  {categoria}
                </h3>
                <div className="space-y-3 print:space-y-0">
                  {liderancasCategoria.map((lideranca) => {
                    const formattedVotes = formatVotes(lideranca.votos)
                    
                    return (
                      <div key={lideranca.id} className="border border-border rounded-lg p-4 print:p-1 bg-gray-50 lideranca-card print:border-0 print:bg-transparent print:mb-0 print:mt-0">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 print:gap-1 items-center print:grid-cols-12">
                          <div className="md:col-span-1 print:col-span-2 flex justify-center md:justify-start">
                            <div className="w-24 h-24 print:w-20 print:h-20 bg-muted-foreground/20 rounded-full flex items-center justify-center overflow-hidden">
                              {lideranca.foto ? (
                                <img 
                                  src={lideranca.foto} 
                                  alt={lideranca.nome}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="h-12 w-12 print:h-10 print:w-10 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                          
                          <div className="md:col-span-4 print:col-span-4 text-center md:text-left">
                            <h4 className="font-semibold text-foreground print:text-xs print:font-medium">
                              {lideranca.nome}
                            </h4>
                            <p className="text-sm text-muted-foreground print:text-[10px]">
                              {lideranca.cargo}
                            </p>
                          </div>
                          
                          <div className="md:col-span-2 print:col-span-2 text-center">
                            <Badge variant="outline" className="font-semibold border-secondary text-secondary print:text-[8px] print:p-0.5 print:px-1 print:bg-gray-300 print:text-black print:border-gray-400">
                              {lideranca.partido}
                            </Badge>
                          </div>
                          
                          <div className="md:col-span-3 print:col-span-2 text-center print:text-right">
                            {formattedVotes && (
                              <div className="text-sm print:text-[10px] print:leading-none">
                                <span className="font-semibold text-success print:block">
                                  {formattedVotes}
                                </span>
                                <span className="text-muted-foreground block text-xs print:text-[8px]">votos</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="md:col-span-2 print:col-span-2 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 print:gap-1">
                              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0 print:h-2 print:w-2" />
                              <span className="text-sm text-foreground print:text-[10px]">
                                {lideranca.telefone}
                              </span>
                            </div>
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

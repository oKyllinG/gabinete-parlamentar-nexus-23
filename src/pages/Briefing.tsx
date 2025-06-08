
import { useState } from "react"
import { Search, MapPin, Edit3, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EditMunicipioDialog } from "@/components/briefing/EditMunicipioDialog"
import { RegioesManagerDialog } from "@/components/briefing/RegioesManagerDialog"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

const municipiosMS: Municipio[] = [
  { id: 1, nome: "Água Clara", regiao: "Fronteira", assessor: "testew" },
  { id: 2, nome: "Alcinópolis", regiao: "Norte", assessor: null },
  { id: 3, nome: "Amambai", regiao: "Fronteira", assessor: null },
  { id: 4, nome: "Anastácio", regiao: "Pantanal", assessor: null },
  { id: 5, nome: "Anaurilândia", regiao: "Bolsão", assessor: null },
  { id: 6, nome: "Angélica", regiao: "Sul", assessor: null },
  { id: 7, nome: "Antônio João", regiao: "Fronteira", assessor: null },
  { id: 8, nome: "Aparecida do Taboado", regiao: "Bolsão", assessor: null },
  { id: 9, nome: "Aquidauana", regiao: "Pantanal", assessor: null },
  { id: 10, nome: "Aral Moreira", regiao: "Fronteira", assessor: null },
  { id: 11, nome: "Bandeirantes", regiao: "Bolsão", assessor: null },
  { id: 12, nome: "Bataguassu", regiao: "Bolsão", assessor: null },
  { id: 13, nome: "Batayporã", regiao: "Sul", assessor: null },
  { id: 14, nome: "Bela Vista", regiao: "Fronteira", assessor: null },
  { id: 15, nome: "Bodoquena", regiao: "Pantanal", assessor: null },
  { id: 16, nome: "Bonito", regiao: "Pantanal", assessor: null },
  { id: 17, nome: "Brasilândia", regiao: "Bolsão", assessor: null },
  { id: 18, nome: "Caarapó", regiao: "Sul", assessor: null },
  { id: 19, nome: "Camapuã", regiao: "Norte", assessor: null },
  { id: 20, nome: "Campo Grande", regiao: "Centro", assessor: null },
  { id: 21, nome: "Caracol", regiao: "Fronteira", assessor: null },
  { id: 22, nome: "Cassilândia", regiao: "Bolsão", assessor: null },
  { id: 23, nome: "Chapadão do Sul", regiao: "Bolsão", assessor: null },
  { id: 24, nome: "Corguinho", regiao: "Centro", assessor: null },
  { id: 25, nome: "Coronel Sapucaia", regiao: "Fronteira", assessor: null },
  { id: 26, nome: "Corumbá", regiao: "Pantanal", assessor: null },
  { id: 27, nome: "Costa Rica", regiao: "Norte", assessor: null },
  { id: 28, nome: "Coxim", regiao: "Norte", assessor: null },
  { id: 29, nome: "Deodápolis", regiao: "Sul", assessor: null },
  { id: 30, nome: "Dois Irmãos do Buriti", regiao: "Centro", assessor: null },
  { id: 31, nome: "Douradina", regiao: "Sul", assessor: null },
  { id: 32, nome: "Dourados", regiao: "Sul", assessor: null },
  { id: 33, nome: "Eldorado", regiao: "Sul", assessor: null },
  { id: 34, nome: "Fátima do Sul", regiao: "Sul", assessor: null },
  { id: 35, nome: "Figueirão", regiao: "Norte", assessor: null },
  { id: 36, nome: "Glória de Dourados", regiao: "Sul", assessor: null },
  { id: 37, nome: "Guia Lopes da Laguna", regiao: "Pantanal", assessor: null },
  { id: 38, nome: "Iguatemi", regiao: "Sul", assessor: null },
  { id: 39, nome: "Inocência", regiao: "Bolsão", assessor: null },
  { id: 40, nome: "Itaporã", regiao: "Sul", assessor: null },
  { id: 41, nome: "Itaquiraí", regiao: "Sul", assessor: null },
  { id: 42, nome: "Ivinhema", regiao: "Sul", assessor: null },
  { id: 43, nome: "Japorã", regiao: "Sul", assessor: null },
  { id: 44, nome: "Jaraguari", regiao: "Centro", assessor: null },
  { id: 45, nome: "Jardim", regiao: "Pantanal", assessor: null },
  { id: 46, nome: "Jateí", regiao: "Sul", assessor: null },
  { id: 47, nome: "Juti", regiao: "Sul", assessor: null },
  { id: 48, nome: "Ladário", regiao: "Pantanal", assessor: null },
  { id: 49, nome: "Laguna Carapã", regiao: "Sul", assessor: null },
  { id: 50, nome: "Maracaju", regiao: "Sul", assessor: null },
  { id: 51, nome: "Miranda", regiao: "Pantanal", assessor: null },
  { id: 52, nome: "Mundo Novo", regiao: "Sul", assessor: null },
  { id: 53, nome: "Naviraí", regiao: "Sul", assessor: null },
  { id: 54, nome: "Nioaque", regiao: "Pantanal", assessor: null },
  { id: 55, nome: "Nova Alvorada do Sul", regiao: "Sul", assessor: null },
  { id: 56, nome: "Nova Andradina", regiao: "Bolsão", assessor: null },
  { id: 57, nome: "Novo Horizonte do Sul", regiao: "Sul", assessor: null },
  { id: 58, nome: "Paranaíba", regiao: "Bolsão", assessor: null },
  { id: 59, nome: "Paranhos", regiao: "Fronteira", assessor: null },
  { id: 60, nome: "Paraíso das Águas", regiao: "Norte", assessor: null },
  { id: 61, nome: "Pedro Gomes", regiao: "Norte", assessor: null },
  { id: 62, nome: "Ponta Porã", regiao: "Fronteira", assessor: null },
  { id: 63, nome: "Porto Murtinho", regiao: "Pantanal", assessor: null },
  { id: 64, nome: "Ribas do Rio Pardo", regiao: "Centro", assessor: null },
  { id: 65, nome: "Rio Brilhante", regiao: "Sul", assessor: null },
  { id: 66, nome: "Rio Negro", regiao: "Norte", assessor: null },
  { id: 67, nome: "Rio Verde de Mato Grosso", regiao: "Norte", assessor: null },
  { id: 68, nome: "Rochedo", regiao: "Centro", assessor: null },
  { id: 69, nome: "Santa Rita do Pardo", regiao: "Bolsão", assessor: null },
  { id: 70, nome: "São Gabriel do Oeste", regiao: "Norte", assessor: null },
  { id: 71, nome: "Selvíria", regiao: "Bolsão", assessor: null },
  { id: 72, nome: "Sete Quedas", regiao: "Norte", assessor: null },
  { id: 73, nome: "Sidrolândia", regiao: "Centro", assessor: null },
  { id: 74, nome: "Sonora", regiao: "Norte", assessor: null },
  { id: 75, nome: "Tacuru", regiao: "Fronteira", assessor: null },
  { id: 76, nome: "Taquarussu", regiao: "Norte", assessor: null },
  { id: 77, nome: "Terenos", regiao: "Centro", assessor: null },
  { id: 78, nome: "Três Lagoas", regiao: "Bolsão", assessor: null },
  { id: 79, nome: "Vicentina", regiao: "Sul", assessor: null }
]

const defaultRegioes = ["Fronteira", "Norte", "Pantanal", "Bolsão", "Sul", "Centro"]

const getRegiaoColor = (regiao: string) => {
  const colors = {
    "Fronteira": "bg-blue-100 text-blue-800",
    "Norte": "bg-green-100 text-green-800", 
    "Pantanal": "bg-yellow-100 text-yellow-800",
    "Bolsão": "bg-purple-100 text-purple-800",
    "Sul": "bg-red-100 text-red-800",
    "Centro": "bg-gray-100 text-gray-800"
  }
  return colors[regiao as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

const Briefing = () => {
  const [municipios, setMunicipios] = useState<Municipio[]>(municipiosMS)
  const [regioes, setRegioes] = useState<string[]>(defaultRegioes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegiao, setSelectedRegiao] = useState("Todas")
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null)
  const [showRegioesManager, setShowRegioesManager] = useState(false)

  const filteredMunicipios = municipios.filter(municipio => {
    const matchesSearch = municipio.nome.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegiao = selectedRegiao === "Todas" || municipio.regiao === selectedRegiao
    return matchesSearch && matchesRegiao
  })

  const handleEditMunicipio = (municipio: Municipio) => {
    setEditingMunicipio(municipio)
  }

  const handleSaveMunicipio = (updatedMunicipio: Municipio) => {
    setMunicipios(prev => 
      prev.map(m => m.id === updatedMunicipio.id ? updatedMunicipio : m)
    )
    setEditingMunicipio(null)
  }

  const handleMunicipioClick = (municipio: Municipio) => {
    console.log(`Clicou no município: ${municipio.nome}`)
    // Aqui será implementada a navegação para o briefing específico do município
  }

  const handleUpdateRegioes = (newRegioes: string[]) => {
    setRegioes(newRegioes)
    
    // Atualizar municípios que podem ter regiões removidas
    setMunicipios(prev => 
      prev.map(m => 
        !newRegioes.includes(m.regiao) 
          ? { ...m, regiao: newRegioes[0] || "Sem Região" }
          : m
      )
    )
    
    // Reset filtro se a região selecionada foi removida
    if (selectedRegiao !== "Todas" && !newRegioes.includes(selectedRegiao)) {
      setSelectedRegiao("Todas")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Briefings Municipais</h1>
            <p className="text-muted-foreground">
              Selecione um município para visualizar seu briefing completo
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegioesManager(true)}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Gerenciar Regiões
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegiao} onValueChange={setSelectedRegiao}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todas">Todas</SelectItem>
            {regioes.map(regiao => (
              <SelectItem key={regiao} value={regiao}>
                {regiao}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMunicipios.map((municipio) => (
          <Card 
            key={municipio.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow border border-border bg-card"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 
                    className="font-semibold text-card-foreground hover:text-primary transition-colors"
                    onClick={() => handleMunicipioClick(municipio)}
                  >
                    {municipio.nome}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditMunicipio(municipio)
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">
                  Mato Grosso do Sul
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRegiaoColor(municipio.regiao)}`}>
                    {municipio.regiao}
                  </span>
                </div>
                
                <div className="text-sm">
                  <span className="text-muted-foreground">Responsável: </span>
                  <span className="text-card-foreground">
                    {municipio.assessor || "Não atribuído"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingMunicipio && (
        <EditMunicipioDialog
          municipio={editingMunicipio}
          onSave={handleSaveMunicipio}
          onCancel={() => setEditingMunicipio(null)}
          availableRegioes={regioes}
        />
      )}

      {showRegioesManager && (
        <RegioesManagerDialog
          regioes={regioes}
          onSave={handleUpdateRegioes}
          onCancel={() => setShowRegioesManager(false)}
        />
      )}
    </div>
  )
}

export default Briefing

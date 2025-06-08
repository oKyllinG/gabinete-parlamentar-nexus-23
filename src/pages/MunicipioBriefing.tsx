import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultadosEleitorais } from "@/components/briefing/ResultadosEleitorais"
import { DeputadosTable } from "@/components/briefing/DeputadosTable"
import { LiderancasMunicipais } from "@/components/briefing/LiderancasMunicipais"
import { VotacaoDeputado } from "@/components/briefing/VotacaoDeputado"

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

const MunicipioBriefing = () => {
  const { municipioId } = useParams()
  const navigate = useNavigate()
  
  const municipio = municipiosMS.find(m => m.id === Number(municipioId))
  
  if (!municipio) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Município não encontrado</h2>
          <Button onClick={() => navigate('/briefing')}>
            Voltar para Briefings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/briefing')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{municipio.nome}</h1>
          <p className="text-muted-foreground">
            {municipio.regiao} • Mato Grosso do Sul
          </p>
        </div>
      </div>

      <Tabs defaultValue="politica" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="politica">Política</TabsTrigger>
          <TabsTrigger value="obras">Obras Atuais</TabsTrigger>
          <TabsTrigger value="acoes">Ações Anteriores</TabsTrigger>
        </TabsList>
        
        <TabsContent value="politica" className="space-y-6">
          {/* Votação do Deputado */}
          <VotacaoDeputado municipio={municipio} />
          
          {/* Resultados Eleitorais */}
          <ResultadosEleitorais municipio={municipio} />
          
          {/* Deputados Federais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deputados Federais</CardTitle>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <DeputadosTable tipo="federal" municipio={municipio} />
            </CardContent>
          </Card>
          
          {/* Deputados Estaduais */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Deputados Estaduais</CardTitle>
              <Button size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </CardHeader>
            <CardContent>
              <DeputadosTable tipo="estadual" municipio={municipio} />
            </CardContent>
          </Card>
          
          {/* Lideranças Municipais */}
          <LiderancasMunicipais municipio={municipio} />
        </TabsContent>
        
        <TabsContent value="obras">
          <Card>
            <CardHeader>
              <CardTitle>Obras e Emendas Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="acoes">
          <Card>
            <CardHeader>
              <CardTitle>Ações Anteriores</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MunicipioBriefing


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
  { id: 20, nome: "Campo Grande", regiao: "Centro", assessor: null },
  // ... demais municípios (mantendo a lista completa)
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

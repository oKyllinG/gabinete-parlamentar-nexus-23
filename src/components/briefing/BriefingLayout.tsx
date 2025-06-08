import { useState } from "react"
import { Edit3, Check, X, Plus, MapPin, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { AcoesDeputado } from "./AcoesDeputado"

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

interface VotacaoHistorica {
  ano: number
  votos: number
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

  // Estados para deputados federais
  const [isEditingFederais, setIsEditingFederais] = useState(false)
  const [showAddFederalForm, setShowAddFederalForm] = useState(false)
  const [editingFederalId, setEditingFederalId] = useState<string | null>(null)
  const [editFederalData, setEditFederalData] = useState<Partial<Deputado>>({})
  const [newFederal, setNewFederal] = useState<Partial<Deputado>>({
    nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1
  })

  // Estados para deputados estaduais
  const [isEditingEstaduais, setIsEditingEstaduais] = useState(false)
  const [showAddEstadualForm, setShowAddEstadualForm] = useState(false)
  const [editingEstadualId, setEditingEstadualId] = useState<string | null>(null)
  const [editEstadualData, setEditEstadualData] = useState<Partial<Deputado>>({})
  const [newEstadual, setNewEstadual] = useState<Partial<Deputado>>({
    nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1
  })

  // Estados para lideranças
  const [isEditingLiderancas, setIsEditingLiderancas] = useState(false)
  const [showAddLiderancaForm, setShowAddLiderancaForm] = useState(false)
  const [editingLiderancaId, setEditingLiderancaId] = useState<number | null>(null)
  const [editLiderancaData, setEditLiderancaData] = useState<Partial<Lideranca>>({})
  const [newLideranca, setNewLideranca] = useState<Partial<Lideranca>>({
    nome: "", cargo: "", partido: "", telefone: "", votos: 0, foto: ""
  })

  // Estados para votação histórica
  const [isEditingVotacao, setIsEditingVotacao] = useState(false)
  const [votacaoHistorica, setVotacaoHistorica] = useState<VotacaoHistorica[]>(() => {
    const saved = localStorage.getItem(`municipio-${municipio.id}-votacao-historica`)
    if (saved) {
      return JSON.parse(saved)
    }
    return [
      { ano: 2002, votos: 199 },
      { ano: 2006, votos: 371 },
      { ano: 2010, votos: 36 },
      { ano: 2014, votos: 65 },
      { ano: 2018, votos: 164 },
      { ano: 2022, votos: dadosPoliticos.votosDeputado }
    ]
  })

  const handleSaveResultados = () => {
    onSaveDadosPoliticos(editDataResultados)
    setIsEditingResultados(false)
  }

  const handleCancelResultados = () => {
    setEditDataResultados(dadosPoliticos)
    setIsEditingResultados(false)
  }

  const handleVotacaoChange = (ano: number, novoValor: number) => {
    setVotacaoHistorica(prev => 
      prev.map(item => item.ano === ano ? { ...item, votos: novoValor } : item)
    )
    if (ano === 2022) {
      setEditDataResultados(prev => ({ ...prev, votosDeputado: novoValor }))
    }
  }

  const handleSaveVotacao = () => {
    localStorage.setItem(`municipio-${municipio.id}-votacao-historica`, JSON.stringify(votacaoHistorica))
    const dados2022 = votacaoHistorica.find(v => v.ano === 2022)
    if (dados2022) {
      const novosResultados = { ...editDataResultados, votosDeputado: dados2022.votos }
      onSaveDadosPoliticos(novosResultados)
      setEditDataResultados(novosResultados)
    }
    setIsEditingVotacao(false)
  }

  // Funções para Deputados Federais
  const handleAddFederal = () => {
    if (newFederal.nome && newFederal.partido) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosFederais, { 
        ...newFederal, 
        id: newId,
        votos: newFederal.votos || 0,
        percentual: newFederal.percentual || 0,
        telefone: newFederal.telefone || "",
        colocacao: newFederal.colocacao || deputadosFederais.length + 1
      } as Deputado]
      onSaveDeputadosFederais(updatedDeputados)
      setNewFederal({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1 })
      setShowAddFederalForm(false)
    }
  }

  const handleEditFederal = (deputado: Deputado) => {
    setEditingFederalId(deputado.id)
    setEditFederalData(deputado)
  }

  const handleSaveFederal = () => {
    if (editingFederalId && editFederalData) {
      const updatedDeputados = deputadosFederais.map(d => 
        d.id === editingFederalId ? { ...d, ...editFederalData } : d
      )
      onSaveDeputadosFederais(updatedDeputados)
      setEditingFederalId(null)
      setEditFederalData({})
    }
  }

  const handleDeleteFederal = (id: string) => {
    const updatedDeputados = deputadosFederais.filter(d => d.id !== id)
    onSaveDeputadosFederais(updatedDeputados)
  }

  // Funções para Deputados Estaduais
  const handleAddEstadual = () => {
    if (newEstadual.nome && newEstadual.partido) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosEstaduais, { 
        ...newEstadual, 
        id: newId,
        votos: newEstadual.votos || 0,
        percentual: newEstadual.percentual || 0,
        telefone: newEstadual.telefone || "",
        colocacao: newEstadual.colocacao || deputadosEstaduais.length + 1
      } as Deputado]
      onSaveDeputadosEstaduais(updatedDeputados)
      setNewEstadual({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "", colocacao: 1 })
      setShowAddEstadualForm(false)
    }
  }

  const handleEditEstadual = (deputado: Deputado) => {
    setEditingEstadualId(deputado.id)
    setEditEstadualData(deputado)
  }

  const handleSaveEstadual = () => {
    if (editingEstadualId && editEstadualData) {
      const updatedDeputados = deputadosEstaduais.map(d => 
        d.id === editingEstadualId ? { ...d, ...editEstadualData } : d
      )
      onSaveDeputadosEstaduais(updatedDeputados)
      setEditingEstadualId(null)
      setEditEstadualData({})
    }
  }

  const handleDeleteEstadual = (id: string) => {
    const updatedDeputados = deputadosEstaduais.filter(d => d.id !== id)
    onSaveDeputadosEstaduais(updatedDeputados)
  }

  // Funções para Lideranças
  const handleAddLideranca = () => {
    if (newLideranca.nome && newLideranca.cargo && newLideranca.partido && newLideranca.telefone) {
      const newId = Math.max(...liderancas.map(l => l.id), 0) + 1
      const updatedLiderancas = [...liderancas, { 
        ...newLideranca, 
        id: newId,
        votos: newLideranca.votos || 0
      } as Lideranca]
      onSaveLiderancas(updatedLiderancas)
      setNewLideranca({ nome: "", cargo: "", partido: "", telefone: "", votos: 0, foto: "" })
      setShowAddLiderancaForm(false)
    }
  }

  const handleEditLideranca = (lideranca: Lideranca) => {
    setEditingLiderancaId(lideranca.id)
    setEditLiderancaData(lideranca)
  }

  const handleSaveLideranca = () => {
    if (editingLiderancaId && editLiderancaData) {
      const updatedLiderancas = liderancas.map(l => 
        l.id === editingLiderancaId ? { ...l, ...editLiderancaData } : l
      )
      onSaveLiderancas(updatedLiderancas)
      setEditingLiderancaId(null)
      setEditLiderancaData({})
    }
  }

  const handleDeleteLideranca = (id: number) => {
    const updatedLiderancas = liderancas.filter(l => l.id !== id)
    onSaveLiderancas(updatedLiderancas)
  }

  // Ordenar deputados por colocação
  const deputadosFederaisOrdenados = [...deputadosFederais].sort((a, b) => {
    if (a.colocacao && b.colocacao) return a.colocacao - b.colocacao
    if (a.colocacao && !b.colocacao) return -1
    if (!a.colocacao && b.colocacao) return 1
    return 0
  })

  const deputadosEstaduaisOrdenados = [...deputadosEstaduais].sort((a, b) => {
    if (a.colocacao && b.colocacao) return a.colocacao - b.colocacao
    if (a.colocacao && !b.colocacao) return -1
    if (!a.colocacao && b.colocacao) return 1
    return 0
  })

  return (
    <div className="space-y-6 bg-background p-6">
      {/* Header */}
      <div className="bg-cyan-600 text-white rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">{municipio.nome}</h1>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-lg">Região {municipio.regiao}</span>
        </div>
      </div>

      {/* Resultados Eleitorais */}
      <Card className="border-gray-300">
        <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded"></div>
              <CardTitle className="text-lg font-bold">Resultados Eleitorais</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isEditingResultados ? (
                <>
                  <Button size="sm" onClick={handleSaveResultados} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4" />
                    Salvar
                  </Button>
                  <Button size="sm" onClick={handleCancelResultados} className="bg-gray-600 hover:bg-gray-700 text-white">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => setIsEditingResultados(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
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

          {/* Votação Histórica */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800">Votação Histórica - Geraldo Resende</h4>
              <div className="flex items-center gap-2">
                {isEditingVotacao ? (
                  <>
                    <Button size="sm" onClick={handleSaveVotacao} className="bg-green-600 hover:bg-green-700 text-white">
                      <Check className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button size="sm" onClick={() => setIsEditingVotacao(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => setIsEditingVotacao(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-cyan-600">
                    <th className="text-white font-bold text-center p-2 border border-gray-300">
                      ELEITORES<br />2022
                    </th>
                    {votacaoHistorica.map((item) => (
                      <th key={item.ano} className="text-white font-bold text-center p-2 border border-gray-300">
                        {item.ano}
                      </th>
                    ))}
                    <th className="text-white font-bold text-center p-2 border border-gray-300">
                      COLOCAÇÃO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center font-medium p-2 border border-gray-300 bg-cyan-100">
                      {isEditingVotacao ? (
                        <Input
                          value={editDataResultados.totalEleitores}
                          onChange={(e) => setEditDataResultados({...editDataResultados, totalEleitores: Number(e.target.value)})}
                          className="w-24 text-center text-black"
                        />
                      ) : (
                        dadosPoliticos.totalEleitores.toLocaleString()
                      )}
                    </td>
                    {votacaoHistorica.map((item) => (
                      <td key={item.ano} className="text-center font-medium p-2 border border-gray-300">
                        {isEditingVotacao ? (
                          <Input
                            value={item.votos}
                            onChange={(e) => handleVotacaoChange(item.ano, Number(e.target.value))}
                            className="w-20 text-center"
                          />
                        ) : (
                          item.votos
                        )}
                      </td>
                    ))}
                    <td className="text-center font-medium p-2 border border-gray-300 bg-cyan-100">
                      {isEditingVotacao ? (
                        <Input
                          value={editDataResultados.colocacaoDeputado}
                          onChange={(e) => setEditDataResultados({...editDataResultados, colocacaoDeputado: e.target.value})}
                          className="w-16 text-center text-black"
                        />
                      ) : (
                        dadosPoliticos.colocacaoDeputado
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deputados */}
      <div className="space-y-6">
        {/* Deputados Federais */}
        <Card className="border-gray-300">
          <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-white rounded"></div>
                <CardTitle className="text-lg font-bold">Deputados Federais</CardTitle>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddFederalForm(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {showAddFederalForm && (
              <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                <h4 className="font-semibold mb-3">Novo Deputado Federal</h4>
                <div className="grid grid-cols-5 gap-3 mb-3">
                  <div>
                    <Label htmlFor="fed-pos">Posição</Label>
                    <Input
                      id="fed-pos"
                      type="number"
                      placeholder="1"
                      value={newFederal.colocacao}
                      onChange={(e) => setNewFederal({...newFederal, colocacao: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fed-nome">Nome</Label>
                    <Input
                      id="fed-nome"
                      placeholder="Nome"
                      value={newFederal.nome}
                      onChange={(e) => setNewFederal({...newFederal, nome: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fed-partido">Partido</Label>
                    <Input
                      id="fed-partido"
                      placeholder="Partido"
                      value={newFederal.partido}
                      onChange={(e) => setNewFederal({...newFederal, partido: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fed-votos">Votos</Label>
                    <Input
                      id="fed-votos"
                      type="number"
                      placeholder="Votos"
                      value={newFederal.votos}
                      onChange={(e) => setNewFederal({...newFederal, votos: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fed-percentual">%</Label>
                    <Input
                      id="fed-percentual"
                      type="number"
                      step="0.01"
                      placeholder="Percentual"
                      value={newFederal.percentual}
                      onChange={(e) => setNewFederal({...newFederal, percentual: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddFederal} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" onClick={() => setShowAddFederalForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border border-gray-300 font-semibold">Pos.</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Nome</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Partido</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Votos</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">%</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {deputadosFederaisOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-300">
                        Nenhum deputado cadastrado
                      </td>
                    </tr>
                  ) : (
                    deputadosFederaisOrdenados.map((deputado) => (
                      <tr key={deputado.id} className="border-b border-gray-200">
                        {editingFederalId === deputado.id ? (
                          <>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                value={editFederalData.colocacao || ""}
                                onChange={(e) => setEditFederalData({...editFederalData, colocacao: Number(e.target.value)})}
                                className="w-16"
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                value={editFederalData.nome || ""}
                                onChange={(e) => setEditFederalData({...editFederalData, nome: e.target.value})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                value={editFederalData.partido || ""}
                                onChange={(e) => setEditFederalData({...editFederalData, partido: e.target.value})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                value={editFederalData.votos || ""}
                                onChange={(e) => setEditFederalData({...editFederalData, votos: Number(e.target.value)})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                step="0.01"
                                value={editFederalData.percentual || ""}
                                onChange={(e) => setEditFederalData({...editFederalData, percentual: Number(e.target.value)})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSaveFederal} className="bg-green-600 hover:bg-green-700 text-white">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={() => setEditingFederalId(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 border border-gray-300 font-medium">{deputado.colocacao || "-"}</td>
                            <td className="p-3 border border-gray-300">{deputado.nome}</td>
                            <td className="p-3 border border-gray-300">
                              <Badge variant="outline" className="text-xs">{deputado.partido}</Badge>
                            </td>
                            <td className="p-3 border border-gray-300">{deputado.votos.toLocaleString()}</td>
                            <td className="p-3 border border-gray-300">{deputado.percentual.toFixed(2)}%</td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => handleEditFederal(deputado)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={() => handleDeleteFederal(deputado.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Deputados Estaduais */}
        <Card className="border-gray-300">
          <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-white rounded"></div>
                <CardTitle className="text-lg font-bold">Deputados Estaduais</CardTitle>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowAddEstadualForm(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {showAddEstadualForm && (
              <div className="p-4 border rounded-lg bg-gray-50 mb-4">
                <h4 className="font-semibold mb-3">Novo Deputado Estadual</h4>
                <div className="grid grid-cols-5 gap-3 mb-3">
                  <div>
                    <Label htmlFor="est-pos">Posição</Label>
                    <Input
                      id="est-pos"
                      type="number"
                      placeholder="1"
                      value={newEstadual.colocacao}
                      onChange={(e) => setNewEstadual({...newEstadual, colocacao: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="est-nome">Nome</Label>
                    <Input
                      id="est-nome"
                      placeholder="Nome"
                      value={newEstadual.nome}
                      onChange={(e) => setNewEstadual({...newEstadual, nome: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="est-partido">Partido</Label>
                    <Input
                      id="est-partido"
                      placeholder="Partido"
                      value={newEstadual.partido}
                      onChange={(e) => setNewEstadual({...newEstadual, partido: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="est-votos">Votos</Label>
                    <Input
                      id="est-votos"
                      type="number"
                      placeholder="Votos"
                      value={newEstadual.votos}
                      onChange={(e) => setNewEstadual({...newEstadual, votos: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="est-percentual">%</Label>
                    <Input
                      id="est-percentual"
                      type="number"
                      step="0.01"
                      placeholder="Percentual"
                      value={newEstadual.percentual}
                      onChange={(e) => setNewEstadual({...newEstadual, percentual: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddEstadual} className="bg-green-600 hover:bg-green-700 text-white">
                    <Check className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" onClick={() => setShowAddEstadualForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border border-gray-300 font-semibold">Pos.</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Nome</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Partido</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Votos</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">%</th>
                    <th className="text-left p-3 border border-gray-300 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {deputadosEstaduaisOrdenados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500 border border-gray-300">
                        Nenhum deputado cadastrado
                      </td>
                    </tr>
                  ) : (
                    deputadosEstaduaisOrdenados.map((deputado) => (
                      <tr key={deputado.id} className="border-b border-gray-200">
                        {editingEstadualId === deputado.id ? (
                          <>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                value={editEstadualData.colocacao || ""}
                                onChange={(e) => setEditEstadualData({...editEstadualData, colocacao: Number(e.target.value)})}
                                className="w-16"
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                value={editEstadualData.nome || ""}
                                onChange={(e) => setEditEstadualData({...editEstadualData, nome: e.target.value})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                value={editEstadualData.partido || ""}
                                onChange={(e) => setEditEstadualData({...editEstadualData, partido: e.target.value})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                value={editEstadualData.votos || ""}
                                onChange={(e) => setEditEstadualData({...editEstadualData, votos: Number(e.target.value)})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <Input
                                type="number"
                                step="0.01"
                                value={editEstadualData.percentual || ""}
                                onChange={(e) => setEditEstadualData({...editEstadualData, percentual: Number(e.target.value)})}
                              />
                            </td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex gap-1">
                                <Button size="sm" onClick={handleSaveEstadual} className="bg-green-600 hover:bg-green-700 text-white">
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={() => setEditingEstadualId(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="p-3 border border-gray-300 font-medium">{deputado.colocacao || "-"}</td>
                            <td className="p-3 border border-gray-300">{deputado.nome}</td>
                            <td className="p-3 border border-gray-300">
                              <Badge variant="outline" className="text-xs">{deputado.partido}</Badge>
                            </td>
                            <td className="p-3 border border-gray-300">{deputado.votos.toLocaleString()}</td>
                            <td className="p-3 border border-gray-300">{deputado.percentual.toFixed(2)}%</td>
                            <td className="p-3 border border-gray-300">
                              <div className="flex gap-1">
                                <Button size="sm" onClick={() => handleEditEstadual(deputado)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="sm" onClick={() => handleDeleteEstadual(deputado.id)} className="bg-red-600 hover:bg-red-700 text-white">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações do Deputado - New Section */}
      <AcoesDeputado municipioNome={municipio.nome} />

      {/* Lideranças Municipais */}
      <Card className="border-gray-300">
        <CardHeader className="bg-cyan-600 text-white border-b border-gray-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-white rounded"></div>
              <CardTitle className="text-lg font-bold">Lideranças Municipais</CardTitle>
            </div>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowAddLiderancaForm(true)}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {showAddLiderancaForm && (
            <div className="p-4 border rounded-lg bg-gray-50 mb-4">
              <h4 className="font-semibold mb-3">Nova Liderança</h4>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <Label htmlFor="new-nome">Nome</Label>
                  <Input
                    id="new-nome"
                    value={newLideranca.nome}
                    onChange={(e) => setNewLideranca({...newLideranca, nome: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-cargo">Cargo</Label>
                  <Input
                    id="new-cargo"
                    value={newLideranca.cargo}
                    onChange={(e) => setNewLideranca({...newLideranca, cargo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-partido">Partido</Label>
                  <Input
                    id="new-partido"
                    value={newLideranca.partido}
                    onChange={(e) => setNewLideranca({...newLideranca, partido: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-telefone">Telefone</Label>
                  <Input
                    id="new-telefone"
                    value={newLideranca.telefone}
                    onChange={(e) => setNewLideranca({...newLideranca, telefone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-votos">Votos</Label>
                  <Input
                    id="new-votos"
                    type="number"
                    value={newLideranca.votos}
                    onChange={(e) => setNewLideranca({...newLideranca, votos: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="new-foto">URL da Foto</Label>
                  <Input
                    id="new-foto"
                    value={newLideranca.foto}
                    onChange={(e) => setNewLideranca({...newLideranca, foto: e.target.value})}
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddLideranca} className="bg-green-600 hover:bg-green-700 text-white">
                  <Check className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" onClick={() => setShowAddLiderancaForm(false)} className="bg-gray-600 hover:bg-gray-700 text-white">
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {liderancas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma liderança cadastrada
            </div>
          ) : (
            <div className="space-y-4">
              {liderancas.map((lideranca) => (
                <div key={lideranca.id} className="flex items-center gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                  {/* Foto maior */}
                  <Avatar className="h-24 w-24 border-2 border-gray-200">
                    <AvatarImage src={lideranca.foto} alt={lideranca.nome} />
                    <AvatarFallback className="bg-gray-100 text-gray-700 text-xl font-semibold">
                      {lideranca.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Informações organizadas horizontalmente */}
                  <div className="flex-1">
                    {editingLiderancaId === lideranca.id ? (
                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          value={editLiderancaData.nome || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, nome: e.target.value})}
                          placeholder="Nome"
                        />
                        <Input
                          value={editLiderancaData.cargo || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, cargo: e.target.value})}
                          placeholder="Cargo"
                        />
                        <Input
                          value={editLiderancaData.partido || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, partido: e.target.value})}
                          placeholder="Partido"
                        />
                        <Input
                          value={editLiderancaData.telefone || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, telefone: e.target.value})}
                          placeholder="Telefone"
                        />
                        <Input
                          type="number"
                          value={editLiderancaData.votos || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, votos: Number(e.target.value)})}
                          placeholder="Votos"
                        />
                        <Input
                          value={editLiderancaData.foto || ""}
                          onChange={(e) => setEditLiderancaData({...editLiderancaData, foto: e.target.value})}
                          placeholder="URL da foto"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        {/* Informações principais em layout horizontal */}
                        <div className="flex items-center gap-8">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-gray-900 text-xl">{lideranca.nome}</h4>
                              <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">
                                {lideranca.partido}
                              </Badge>
                            </div>
                            <p className="text-gray-600 font-medium">{lideranca.cargo}</p>
                            <p className="text-gray-500 text-sm">{lideranca.telefone}</p>
                          </div>
                          
                          {/* Votos destacados */}
                          <div className="text-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                            <div className="text-blue-600 font-bold text-2xl">
                              {lideranca.votos?.toLocaleString() || '0'}
                            </div>
                            <div className="text-blue-500 text-xs font-medium">VOTOS</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Botões de ação */}
                  <div className="flex items-center gap-2">
                    {editingLiderancaId === lideranca.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveLideranca} className="bg-green-600 hover:bg-green-700 text-white">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => setEditingLiderancaId(null)} className="bg-gray-600 hover:bg-gray-700 text-white">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" onClick={() => handleEditLideranca(lideranca)} className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={() => handleDeleteLideranca(lideranca.id)} className="bg-red-600 hover:bg-red-700 text-white">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
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

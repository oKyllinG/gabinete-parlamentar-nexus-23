
import { useState } from "react"
import { Edit3, Check, X, Plus, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"

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
    nome: "", partido: "", votos: 0, percentual: 0, telefone: ""
  })

  // Estados para deputados estaduais
  const [isEditingEstaduais, setIsEditingEstaduais] = useState(false)
  const [showAddEstadualForm, setShowAddEstadualForm] = useState(false)
  const [editingEstadualId, setEditingEstadualId] = useState<string | null>(null)
  const [editEstadualData, setEditEstadualData] = useState<Partial<Deputado>>({})
  const [newEstadual, setNewEstadual] = useState<Partial<Deputado>>({
    nome: "", partido: "", votos: 0, percentual: 0, telefone: ""
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
    if (newFederal.nome && newFederal.partido && newFederal.telefone) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosFederais, { 
        ...newFederal, 
        id: newId,
        votos: newFederal.votos || 0,
        percentual: newFederal.percentual || 0
      } as Deputado]
      onSaveDeputadosFederais(updatedDeputados)
      setNewFederal({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "" })
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
    if (newEstadual.nome && newEstadual.partido && newEstadual.telefone) {
      const newId = Date.now().toString()
      const updatedDeputados = [...deputadosEstaduais, { 
        ...newEstadual, 
        id: newId,
        votos: newEstadual.votos || 0,
        percentual: newEstadual.percentual || 0
      } as Deputado]
      onSaveDeputadosEstaduais(updatedDeputados)
      setNewEstadual({ nome: "", partido: "", votos: 0, percentual: 0, telefone: "" })
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

  return (
    <div className="space-y-6 bg-background p-6">
      {/* Header */}
      <div className="bg-slate-100 rounded-lg p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Briefing Municipal</h1>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="h-4 w-4" />
          <span className="font-semibold text-lg">{municipio.nome}</span>
        </div>
      </div>

      {/* Resultados Eleitorais */}
      <Card className="border-slate-200">
        <CardHeader className="bg-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-slate-800 rounded"></div>
              <CardTitle className="text-lg text-slate-900 font-bold">Resultados Eleitorais</CardTitle>
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

          {/* Votação Histórica */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-slate-800">Votação Histórica - Geraldo Resende</h4>
              <div className="flex items-center gap-2">
                {isEditingVotacao ? (
                  <>
                    <Button size="sm" onClick={handleSaveVotacao} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4" />
                      Salvar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingVotacao(false)}>
                      <X className="h-4 w-4" />
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsEditingVotacao(true)}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border border-slate-300">
                <thead>
                  <tr className="bg-cyan-600">
                    <th className="text-white font-bold text-center p-2 border border-slate-300">
                      ELEITORES<br />2022
                    </th>
                    {votacaoHistorica.map((item) => (
                      <th key={item.ano} className="text-white font-bold text-center p-2 border border-slate-300">
                        {item.ano}
                      </th>
                    ))}
                    <th className="text-white font-bold text-center p-2 border border-slate-300">
                      COLOCAÇÃO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center font-medium p-2 border border-slate-300 bg-cyan-100">
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
                      <td key={item.ano} className="text-center font-medium p-2 border border-slate-300">
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
                    <td className="text-center font-medium p-2 border border-slate-300 bg-cyan-100">
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
      <div className="grid grid-cols-2 gap-6">
        {/* Deputados Federais */}
        <Card className="border-slate-200">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-slate-800 rounded"></div>
                <CardTitle className="text-lg text-slate-900 font-bold">Deputados Federais</CardTitle>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-slate-300 hover:bg-slate-50"
                onClick={() => setShowAddFederalForm(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {showAddFederalForm && (
              <div className="p-4 border rounded-lg bg-muted/50 mb-4">
                <h4 className="font-semibold mb-3">Novo Deputado Federal</h4>
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <Input
                    placeholder="Nome"
                    value={newFederal.nome}
                    onChange={(e) => setNewFederal({...newFederal, nome: e.target.value})}
                  />
                  <Input
                    placeholder="Partido"
                    value={newFederal.partido}
                    onChange={(e) => setNewFederal({...newFederal, partido: e.target.value})}
                  />
                  <Input
                    placeholder="Telefone"
                    value={newFederal.telefone}
                    onChange={(e) => setNewFederal({...newFederal, telefone: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Votos"
                    value={newFederal.votos}
                    onChange={(e) => setNewFederal({...newFederal, votos: Number(e.target.value)})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddFederal}>
                    <Check className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddFederalForm(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

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
                    {editingFederalId === deputado.id ? (
                      <>
                        <div className="font-medium">{index + 1}</div>
                        <div className="col-span-2">
                          <Input
                            value={editFederalData.nome || ""}
                            onChange={(e) => setEditFederalData({...editFederalData, nome: e.target.value})}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            value={editFederalData.partido || ""}
                            onChange={(e) => setEditFederalData({...editFederalData, partido: e.target.value})}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={editFederalData.votos || ""}
                            onChange={(e) => setEditFederalData({...editFederalData, votos: Number(e.target.value)})}
                            className="text-xs"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSaveFederal}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingFederalId(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">{index + 1}</div>
                        <div className="col-span-2">{deputado.nome}</div>
                        <div><Badge variant="outline" className="text-xs">{deputado.partido}</Badge></div>
                        <div>{deputado.votos.toLocaleString()}</div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleEditFederal(deputado)}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600" onClick={() => handleDeleteFederal(deputado.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
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
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-slate-800 rounded"></div>
                <CardTitle className="text-lg text-slate-900 font-bold">Deputados Estaduais</CardTitle>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-slate-300 hover:bg-slate-50"
                onClick={() => setShowAddEstadualForm(true)}
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {showAddEstadualForm && (
              <div className="p-4 border rounded-lg bg-muted/50 mb-4">
                <h4 className="font-semibold mb-3">Novo Deputado Estadual</h4>
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <Input
                    placeholder="Nome"
                    value={newEstadual.nome}
                    onChange={(e) => setNewEstadual({...newEstadual, nome: e.target.value})}
                  />
                  <Input
                    placeholder="Partido"
                    value={newEstadual.partido}
                    onChange={(e) => setNewEstadual({...newEstadual, partido: e.target.value})}
                  />
                  <Input
                    placeholder="Telefone"
                    value={newEstadual.telefone}
                    onChange={(e) => setNewEstadual({...newEstadual, telefone: e.target.value})}
                  />
                  <Input
                    type="number"
                    placeholder="Votos"
                    value={newEstadual.votos}
                    onChange={(e) => setNewEstadual({...newEstadual, votos: Number(e.target.value)})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddEstadual}>
                    <Check className="h-4 w-4 mr-1" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddEstadualForm(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

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
                    {editingEstadualId === deputado.id ? (
                      <>
                        <div className="font-medium">{index + 1}</div>
                        <div className="col-span-2">
                          <Input
                            value={editEstadualData.nome || ""}
                            onChange={(e) => setEditEstadualData({...editEstadualData, nome: e.target.value})}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            value={editEstadualData.partido || ""}
                            onChange={(e) => setEditEstadualData({...editEstadualData, partido: e.target.value})}
                            className="text-xs"
                          />
                        </div>
                        <div>
                          <Input
                            type="number"
                            value={editEstadualData.votos || ""}
                            onChange={(e) => setEditEstadualData({...editEstadualData, votos: Number(e.target.value)})}
                            className="text-xs"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={handleSaveEstadual}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setEditingEstadualId(null)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">{index + 1}</div>
                        <div className="col-span-2">{deputado.nome}</div>
                        <div><Badge variant="outline" className="text-xs">{deputado.partido}</Badge></div>
                        <div>{deputado.votos.toLocaleString()}</div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => handleEditEstadual(deputado)}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600" onClick={() => handleDeleteEstadual(deputado.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
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
              <div className="w-1 h-6 bg-slate-800 rounded"></div>
              <CardTitle className="text-lg text-slate-900 font-bold">Lideranças Municipais</CardTitle>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-slate-300 hover:bg-slate-50"
              onClick={() => setShowAddLiderancaForm(true)}
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {showAddLiderancaForm && (
            <div className="p-4 border rounded-lg bg-muted/50 mb-4">
              <h4 className="font-semibold mb-3">Nova Liderança</h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
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
                <Button size="sm" onClick={handleAddLideranca}>
                  <Check className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddLiderancaForm(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              </div>
            </div>
          )}

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
                    {editingLiderancaId === lideranca.id ? (
                      <div className="grid grid-cols-2 gap-2">
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
                      <>
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
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {editingLiderancaId === lideranca.id ? (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleSaveLideranca}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingLiderancaId(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditLideranca(lideranca)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => handleDeleteLideranca(lideranca.id)}>
                          <X className="h-4 w-4" />
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


import { useState } from "react"
import { SortableObras } from "./SortableObras"
import { SortableEmendas } from "./SortableEmendas"
import { LiderancasManager } from "./LiderancasManager"
import { getObrasByMunicipio, getDestinacoesByMunicipio, Obra, DestinacaoEmenda } from "@/utils/briefingDataUtils"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
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

interface BriefingComponentsManagerProps {
  municipio: Municipio
}

export const BriefingComponentsManager = ({ municipio }: BriefingComponentsManagerProps) => {
  const [obras, setObras] = useState<Obra[]>(() => getObrasByMunicipio(municipio.nome))
  const [emendas, setEmendas] = useState<DestinacaoEmenda[]>(() => getDestinacoesByMunicipio(municipio.nome))
  
  // Load lideranças from localStorage
  const loadLiderancas = () => {
    const saved = localStorage.getItem(`municipio-${municipio.id}-liderancas`)
    if (saved) {
      return JSON.parse(saved)
    }
    return []
  }

  const [liderancas, setLiderancas] = useState<Lideranca[]>(loadLiderancas)

  const handleSaveObras = (newObras: Obra[]) => {
    setObras(newObras)
    localStorage.setItem(`obras-${municipio.nome}`, JSON.stringify(newObras))
  }

  const handleSaveEmendas = (newEmendas: DestinacaoEmenda[]) => {
    setEmendas(newEmendas)
    localStorage.setItem(`destinacoes-${municipio.nome}`, JSON.stringify(newEmendas))
  }

  const handleSaveLiderancas = (newLiderancas: Lideranca[]) => {
    setLiderancas(newLiderancas)
    localStorage.setItem(`municipio-${municipio.id}-liderancas`, JSON.stringify(newLiderancas))
  }

  const handleAddObra = () => {
    const newObra: Obra = {
      id: `obra-${Date.now()}`,
      titulo: "Nova Obra",
      descricao: "Descrição da obra",
      valor: 0,
      status: "Planejada",
      categoria: "Infraestrutura",
      dataInicio: new Date().toISOString(),
      prazoExecucao: new Date().toISOString(),
      municipio: municipio.nome
    }
    handleSaveObras([...obras, newObra])
  }

  const handleEditObra = (obra: Obra) => {
    // This would typically open a form dialog
    console.log("Edit obra:", obra)
  }

  const handleDeleteObra = (id: string) => {
    handleSaveObras(obras.filter(o => o.id !== id))
  }

  const handleAddEmenda = () => {
    const newEmenda: DestinacaoEmenda = {
      id: `emenda-${Date.now()}`,
      numero: `${Date.now()}`,
      objeto: "Nova emenda parlamentar",
      destinatario: "Prefeitura Municipal",
      areaAtuacao: "Saúde",
      valor: 0,
      status: "Pendente",
      prazoInicio: new Date().toISOString(),
      prazoFim: new Date().toISOString(),
      gnd: "4",
      municipio: municipio.nome
    }
    handleSaveEmendas([...emendas, newEmenda])
  }

  const handleEditEmenda = (emenda: DestinacaoEmenda) => {
    // This would typically open a form dialog
    console.log("Edit emenda:", emenda)
  }

  const handleDeleteEmenda = (id: string) => {
    handleSaveEmendas(emendas.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-6">
      <SortableObras
        obras={obras}
        onSave={handleSaveObras}
        onAdd={handleAddObra}
        onEdit={handleEditObra}
        onDelete={handleDeleteObra}
      />

      <SortableEmendas
        emendas={emendas}
        onSave={handleSaveEmendas}
        onAdd={handleAddEmenda}
        onEdit={handleEditEmenda}
        onDelete={handleDeleteEmenda}
      />

      <LiderancasManager
        liderancas={liderancas}
        onSave={handleSaveLiderancas}
      />
    </div>
  )
}

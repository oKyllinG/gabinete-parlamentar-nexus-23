
import { ArrowLeft, FileText, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface Municipio {
  id: number
  nome: string
  regiao: string
  assessor: string | null
}

interface BriefingHeaderProps {
  municipio: Municipio
}

export const BriefingHeader = ({ municipio }: BriefingHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/briefing')}
              className="flex items-center gap-2 hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="h-8 w-px bg-border" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">{municipio.nome}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                {municipio.regiao} • Mato Grosso do Sul
                {municipio.assessor && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-sm">Assessor: {municipio.assessor}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Modo Edição
            </Button>
            <Button className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

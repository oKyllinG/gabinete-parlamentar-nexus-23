
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, File, X, Calendar } from "lucide-react"

interface OficioFormProps {
  onClose: () => void
}

export function OficioForm({ onClose }: OficioFormProps) {
  const [tipoOficio, setTipoOficio] = useState("enviado")
  const [documentoAnexo, setDocumentoAnexo] = useState<File | null>(null)
  const [protocoloAnexo, setProtocoloAnexo] = useState<File | null>(null)

  const handleFileUpload = (file: File, tipo: 'documento' | 'protocolo') => {
    if (tipo === 'documento') {
      setDocumentoAnexo(file)
    } else {
      setProtocoloAnexo(file)
    }
  }

  const removeFile = (tipo: 'documento' | 'protocolo') => {
    if (tipo === 'documento') {
      setDocumentoAnexo(null)
    } else {
      setProtocoloAnexo(null)
    }
  }

  const FileUploadArea = ({ 
    file, 
    onUpload, 
    onRemove, 
    title, 
    description,
    required = false 
  }: {
    file: File | null
    onUpload: (file: File) => void
    onRemove: () => void
    title: string
    description: string
    required?: boolean
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {title}
          {required && <span className="text-destructive">*</span>}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {!file ? (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
            <input
              type="file"
              id={`file-${title}`}
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) onUpload(selectedFile)
              }}
            />
            <label htmlFor={`file-${title}`} className="cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Clique para selecionar arquivo</p>
              <p className="text-xs text-muted-foreground">Formatos aceitos: PDF, DOC, DOCX</p>
            </label>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2">
              <File className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={onRemove}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Tabs value={tipoOficio} onValueChange={setTipoOficio}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="enviado">Ofício Enviado</TabsTrigger>
          <TabsTrigger value="recebido">Ofício Recebido</TabsTrigger>
          <TabsTrigger value="convite">Ofício Convite</TabsTrigger>
        </TabsList>

        <TabsContent value="enviado" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero">Número do Ofício *</Label>
              <Input id="numero" placeholder="Ex: OF/2025/001" />
            </div>
            <div>
              <Label htmlFor="data">Data *</Label>
              <div className="relative">
                <Input id="data" type="date" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="destinatario">Destinatário *</Label>
            <Input id="destinatario" placeholder="Nome do órgão/pessoa destinatária" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo-destinatario">Cargo do Destinatário</Label>
              <Input id="cargo-destinatario" placeholder="Ex: Secretário de Saúde" />
            </div>
            <div>
              <Label htmlFor="orgao-destinatario">Órgão do Destinatário</Label>
              <Input id="orgao-destinatario" placeholder="Ex: Secretaria de Saúde" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="municipio">Município</Label>
              <Input id="municipio" placeholder="Ex: São Paulo" />
            </div>
            <div>
              <Label htmlFor="responsavel">Responsável</Label>
              <Input id="responsavel" placeholder="Nome de quem elaborou o ofício" />
            </div>
          </div>

          <div>
            <Label htmlFor="assunto">Assunto *</Label>
            <Textarea id="assunto" placeholder="Descreva o assunto do ofício" rows={3} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FileUploadArea
              file={documentoAnexo}
              onUpload={(file) => handleFileUpload(file, 'documento')}
              onRemove={() => removeFile('documento')}
              title="Arquivo do Ofício"
              description="Documento principal (PDF ou Word)"
              required
            />
            <FileUploadArea
              file={protocoloAnexo}
              onUpload={(file) => handleFileUpload(file, 'protocolo')}
              onRemove={() => removeFile('protocolo')}
              title="Anexo do Protocolo"
              description="Comprovante de protocolo/entrega"
            />
          </div>
        </TabsContent>

        <TabsContent value="recebido" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero-recebido">Número do Ofício *</Label>
              <Input id="numero-recebido" placeholder="Ex: OF/2025/001" />
            </div>
            <div>
              <Label htmlFor="data-recebido">Data *</Label>
              <div className="relative">
                <Input id="data-recebido" type="date" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="origem">Origem *</Label>
            <Input id="origem" placeholder="Nome do órgão/pessoa de origem" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo-origem">Cargo da Origem</Label>
              <Input id="cargo-origem" placeholder="Ex: Secretário de Saúde" />
            </div>
            <div>
              <Label htmlFor="orgao-origem">Órgão da Origem</Label>
              <Input id="orgao-origem" placeholder="Ex: Secretaria de Saúde" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="municipio-recebido">Município</Label>
              <Input id="municipio-recebido" placeholder="Ex: São Paulo" />
            </div>
            <div>
              <Label htmlFor="responsavel-recebido">Responsável</Label>
              <Input id="responsavel-recebido" placeholder="Nome de quem elaborou o ofício" />
            </div>
          </div>

          <div>
            <Label htmlFor="assunto-recebido">Assunto *</Label>
            <Textarea id="assunto-recebido" placeholder="Descreva o assunto do ofício" rows={3} />
          </div>

          <FileUploadArea
            file={documentoAnexo}
            onUpload={(file) => handleFileUpload(file, 'documento')}
            onRemove={() => removeFile('documento')}
            title="Arquivo do Ofício"
            description="Documento recebido (PDF ou Word)"
            required
          />
        </TabsContent>

        <TabsContent value="convite" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="numero-convite">Número do Ofício *</Label>
              <Input id="numero-convite" placeholder="Ex: OF/2025/001" />
            </div>
            <div>
              <Label htmlFor="data-convite">Data *</Label>
              <div className="relative">
                <Input id="data-convite" type="date" />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="destinatario-convite">Destinatário *</Label>
            <Input id="destinatario-convite" placeholder="Nome do órgão/pessoa destinatária" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargo-destinatario-convite">Cargo do Destinatário</Label>
              <Input id="cargo-destinatario-convite" placeholder="Ex: Secretário de Saúde" />
            </div>
            <div>
              <Label htmlFor="orgao-destinatario-convite">Órgão do Destinatário</Label>
              <Input id="orgao-destinatario-convite" placeholder="Ex: Secretaria de Saúde" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="municipio-convite">Município</Label>
              <Input id="municipio-convite" placeholder="Ex: São Paulo" />
            </div>
            <div>
              <Label htmlFor="responsavel-convite">Responsável</Label>
              <Input id="responsavel-convite" placeholder="Nome de quem elaborou o ofício" />
            </div>
          </div>

          <div>
            <Label htmlFor="assunto-convite">Assunto *</Label>
            <Textarea id="assunto-convite" placeholder="Descreva o assunto do ofício" rows={3} />
          </div>

          <FileUploadArea
            file={documentoAnexo}
            onUpload={(file) => handleFileUpload(file, 'documento')}
            onRemove={() => removeFile('documento')}
            title="Arquivo do Ofício"
            description="Documento do convite (PDF ou Word)"
            required
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button>
          Registrar Ofício
        </Button>
      </div>
    </div>
  )
}

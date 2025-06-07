import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Upload } from "lucide-react";
import { Contact } from "@/pages/Contatos";

interface ContatoFormProps {
  contact?: Contact | null;
  onSave: (contact: Omit<Contact, 'id' | 'dataCriacao'>) => void;
  onCancel: () => void;
}

export const ContatoForm: React.FC<ContatoFormProps> = ({ contact, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    email: '',
    tipo: '' as Contact['tipo'] | '',
    cargo: '',
    empresa: '',
    endereco: {
      rua: '',
      numero: '',
      bairro: '',
      cidade: '',
      cep: '',
      estado: ''
    },
    nascimento: {
      dia: 0,
      mes: 0,
      ano: 0 as number | undefined
    },
    observacoes: '',
    foto: ''
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        nome: contact.nome,
        sobrenome: contact.sobrenome,
        telefone: contact.telefone,
        email: contact.email,
        tipo: contact.tipo,
        cargo: contact.cargo || '',
        empresa: contact.empresa || '',
        endereco: contact.endereco || {
          rua: '',
          numero: '',
          bairro: '',
          cidade: '',
          cep: '',
          estado: ''
        },
        nascimento: {
          dia: contact.nascimento?.dia || 0,
          mes: contact.nascimento?.mes || 0,
          ano: contact.nascimento?.ano || 0
        },
        observacoes: contact.observacoes || '',
        foto: contact.foto || ''
      });
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.sobrenome || !formData.telefone || !formData.tipo) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    const contactData = {
      ...formData,
      tipo: formData.tipo as Contact['tipo'],
      endereco: Object.values(formData.endereco).some(v => v) ? formData.endereco : undefined,
      nascimento: formData.nascimento.dia && formData.nascimento.mes ? {
        dia: formData.nascimento.dia,
        mes: formData.nascimento.mes,
        ano: formData.nascimento.ano || undefined
      } : undefined,
      cargo: formData.cargo || undefined,
      empresa: formData.empresa || undefined,
      observacoes: formData.observacoes || undefined,
      foto: formData.foto || undefined
    };

    onSave(contactData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));
  };

  const handleNascimentoChange = (field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      nascimento: {
        ...prev.nascimento,
        [field]: value === 0 ? undefined : value
      }
    }));
  };

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <Tabs defaultValue="basico" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basico">Básico</TabsTrigger>
                <TabsTrigger value="endereco">Endereço</TabsTrigger>
                <TabsTrigger value="adicional">Adicional</TabsTrigger>
                <TabsTrigger value="nascimento">Nascimento</TabsTrigger>
              </TabsList>

              <TabsContent value="basico" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sobrenome">Sobrenome *</Label>
                    <Input
                      id="sobrenome"
                      value={formData.sobrenome}
                      onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone *</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="servidor">Servidor</SelectItem>
                      <SelectItem value="lideranca">Liderança</SelectItem>
                      <SelectItem value="empresario">Empresário</SelectItem>
                      <SelectItem value="cidadao">Cidadão</SelectItem>
                      <SelectItem value="politico">Político</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input
                      id="cargo"
                      value={formData.cargo}
                      onChange={(e) => handleInputChange('cargo', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa/Órgão</Label>
                    <Input
                      id="empresa"
                      value={formData.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="endereco" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="rua">Rua/Avenida</Label>
                    <Input
                      id="rua"
                      value={formData.endereco.rua}
                      onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numero">Número</Label>
                    <Input
                      id="numero"
                      value={formData.endereco.numero}
                      onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.endereco.bairro}
                      onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.endereco.cep}
                      onChange={(e) => handleEnderecoChange('cep', e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.endereco.cidade}
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Select value={formData.endereco.estado} onValueChange={(value) => handleEnderecoChange('estado', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map(estado => (
                          <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adicional" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="foto">Foto do Contato</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="foto"
                      value={formData.foto}
                      onChange={(e) => handleInputChange('foto', e.target.value)}
                      placeholder="URL da foto"
                    />
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    rows={5}
                    placeholder="Informações adicionais sobre o contato..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="nascimento" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dia">Dia</Label>
                    <Select 
                      value={formData.nascimento.dia?.toString() || ''} 
                      onValueChange={(value) => handleNascimentoChange('dia', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mes">Mês</Label>
                    <Select 
                      value={formData.nascimento.mes?.toString() || ''} 
                      onValueChange={(value) => handleNascimentoChange('mes', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Mês" />
                      </SelectTrigger>
                      <SelectContent>
                        {meses.map((mes, index) => (
                          <SelectItem key={index + 1} value={(index + 1).toString()}>
                            {mes}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      value={formData.nascimento.ano || ''}
                      onChange={(e) => handleNascimentoChange('ano', parseInt(e.target.value) || 0)}
                      placeholder="1990"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <div className="flex justify-end gap-2 p-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {contact ? 'Atualizar' : 'Salvar'} Contato
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

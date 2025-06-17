
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar, MessageCircle, Send, Settings } from "lucide-react";
import { Contact } from "@/pages/Contatos";
import { MessageTemplate } from "./WhatsAppTab";

interface BirthdayMessageManagerProps {
  contacts: Contact[];
  templates: MessageTemplate[];
  onClose: () => void;
}

export const BirthdayMessageManager: React.FC<BirthdayMessageManagerProps> = ({
  contacts,
  templates,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(
    templates.length > 0 ? templates[0] : null
  );
  const [customMessage, setCustomMessage] = useState('');
  const [autoSendEnabled, setAutoSendEnabled] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const handleSendBirthdayMessages = () => {
    const message = customMessage || selectedTemplate?.content || '';
    if (!message.trim() || selectedContacts.length === 0) return;

    const contactsToSend = contacts.filter(c => selectedContacts.includes(c.id));
    
    contactsToSend.forEach(contact => {
      const personalizedMessage = message.replace('{nome}', contact.nome);
      const cleanPhone = contact.telefone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(personalizedMessage)}`;
      
      // Em produção, aqui seria feita a integração com a API do WhatsApp Business
      console.log(`Enviando mensagem de aniversário para ${contact.nome}: ${personalizedMessage}`);
    });

    // Abrir WhatsApp Web para o primeiro contato (simulação)
    if (contactsToSend.length > 0) {
      const firstContact = contactsToSend[0];
      const personalizedMessage = message.replace('{nome}', firstContact.nome);
      const cleanPhone = firstContact.telefone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(personalizedMessage)}`;
      window.open(whatsappUrl, '_blank');
    }

    onClose();
  };

  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const selectAllContacts = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Mensagens de Aniversário
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configurações de Mensagem */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Templates Disponíveis */}
                {templates.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Templates de Aniversário</Label>
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <Button
                          key={template.id}
                          variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto p-3"
                          onClick={() => {
                            setSelectedTemplate(template);
                            setCustomMessage(template.content);
                          }}
                        >
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground mt-1 truncate">
                              {template.content.substring(0, 60)}...
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensagem Personalizada */}
                <div>
                  <Label htmlFor="custom-message" className="text-sm font-medium mb-2 block">
                    Mensagem Personalizada
                  </Label>
                  <Textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Digite uma mensagem personalizada... Use {nome} para incluir o nome da pessoa."
                    className="min-h-[100px]"
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {customMessage.length}/500 caracteres
                    <br />
                    Dica: Use {"{nome}"} para personalizar com o nome do aniversariante
                  </div>
                </div>

                {/* Envio Automático */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <Label htmlFor="auto-send" className="font-medium">
                      Envio Automático
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Enviar automaticamente no dia do aniversário
                    </p>
                  </div>
                  <Switch
                    id="auto-send"
                    checked={autoSendEnabled}
                    onCheckedChange={setAutoSendEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Aniversariantes */}
          <div className="space-y-4">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Aniversariantes de Hoje ({contacts.length})
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={selectAllContacts}
                  >
                    {selectedContacts.length === contacts.length ? 'Desmarcar' : 'Selecionar'} Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[300px] overflow-y-auto">
                  {contacts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Nenhum aniversariante hoje</p>
                    </div>
                  ) : (
                    <div className="space-y-2 p-4">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                            selectedContacts.includes(contact.id) ? 'bg-blue-50 border border-blue-200' : 'border'
                          }`}
                          onClick={() => toggleContactSelection(contact.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => {}} // Controlled by parent click
                            className="pointer-events-none"
                          />
                          
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.foto} alt={contact.nome} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {contact.nome.charAt(0)}{contact.sobrenome.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {contact.nome} {contact.sobrenome}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {contact.nascimento?.ano ? 
                                  `${new Date().getFullYear() - contact.nascimento.ano} anos` : 
                                  'Idade não informada'
                                }
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {contact.telefone}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {selectedContacts.length} de {contacts.length} selecionado(s)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              onClick={handleSendBirthdayMessages}
              disabled={!customMessage.trim() || selectedContacts.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Mensagens ({selectedContacts.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

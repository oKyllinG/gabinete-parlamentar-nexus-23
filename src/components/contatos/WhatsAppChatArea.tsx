
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Phone, 
  Star,
  Clock,
  User,
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react";
import { Contact } from "@/pages/Contatos";
import { ContactStatus } from "./WhatsAppTab";

interface WhatsAppChatAreaProps {
  contact: Contact;
  contactStatus?: ContactStatus;
  onStatusUpdate: (updates: Partial<ContactStatus>) => void;
  onBack: () => void;
}

const statusColors = {
  novo: 'bg-gray-100 text-gray-800',
  contatado: 'bg-blue-100 text-blue-800',
  interessado: 'bg-yellow-100 text-yellow-800',
  negociando: 'bg-orange-100 text-orange-800',
  fechado: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800'
};

const statusLabels = {
  novo: 'Novo',
  contatado: 'Contatado',
  interessado: 'Interessado',
  negociando: 'Negociando',
  fechado: 'Fechado',
  perdido: 'Perdido'
};

const priorityColors = {
  baixa: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800'
};

export const WhatsAppChatArea: React.FC<WhatsAppChatAreaProps> = ({
  contact,
  contactStatus,
  onStatusUpdate,
  onBack
}) => {
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState(contactStatus?.notes || '');
  const [nextFollowUp, setNextFollowUp] = useState(contactStatus?.nextFollowUp || '');

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const cleanPhone = contact.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
    
    // Atualizar status
    onStatusUpdate({
      status: 'contatado',
      lastContact: new Date().toISOString()
    });

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    setMessage('');
  };

  const handleStatusChange = (status: ContactStatus['status']) => {
    onStatusUpdate({ status });
  };

  const handlePriorityChange = (priority: ContactStatus['priority']) => {
    onStatusUpdate({ priority });
  };

  const handleNotesUpdate = () => {
    onStatusUpdate({ notes });
  };

  const handleFollowUpUpdate = () => {
    onStatusUpdate({ nextFollowUp });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-400px)]">
      {/* Área do Chat */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="bg-green-600 text-white">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-white hover:bg-green-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  {contact.foto ? (
                    <img src={contact.foto} alt={contact.nome} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-sm font-medium">
                      {contact.nome.charAt(0)}{contact.sobrenome.charAt(0)}
                    </span>
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{contact.nome} {contact.sobrenome}</h3>
                  <p className="text-sm text-green-100">{contact.telefone}</p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const cleanPhone = contact.telefone.replace(/\D/g, '');
                    window.open(`tel:${cleanPhone}`);
                  }}
                  className="text-white hover:bg-green-700"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-4">
            {/* Área de Conversa */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 min-h-[300px]">
              {contactStatus?.lastContact ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge variant="secondary" className="text-xs">
                      Último contato: {formatDate(contactStatus.lastContact)}
                    </Badge>
                  </div>
                  
                  {message && (
                    <div className="bg-green-100 rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">{message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Inicie uma conversa com {contact.nome}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Composição */}
            <div className="flex gap-2">
              <Textarea
                placeholder={`Digite uma mensagem para ${contact.nome}...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 min-h-[60px] resize-none"
                maxLength={1000}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-green-600 hover:bg-green-700 self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground mt-1">
              {message.length}/1000 caracteres
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar com Informações do Contato */}
      <div className="space-y-4">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-sm font-medium">Nome Completo</Label>
              <p className="text-sm">{contact.nome} {contact.sobrenome}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Telefone</Label>
              <p className="text-sm">{contact.telefone}</p>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Email</Label>
              <p className="text-sm">{contact.email}</p>
            </div>
            
            {contact.cargo && (
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.cargo}</span>
              </div>
            )}
            
            {contact.municipio && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{contact.municipio}</span>
              </div>
            )}
            
            {contact.nascimento && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {contact.nascimento.dia}/{contact.nascimento.mes}
                  {contact.nascimento.ano && `/${contact.nascimento.ano}`}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status do CRM */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Status CRM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Status</Label>
              <Select
                value={contactStatus?.status || 'novo'}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[key as keyof typeof statusColors]}>
                          {label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">Prioridade</Label>
              <Select
                value={contactStatus?.priority || 'media'}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">
                    <Badge className={priorityColors.baixa}>Baixa</Badge>
                  </SelectItem>
                  <SelectItem value="media">
                    <Badge className={priorityColors.media}>Média</Badge>
                  </SelectItem>
                  <SelectItem value="alta">
                    <Badge className={priorityColors.alta}>Alta</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="next-followup" className="text-sm font-medium mb-2 block">
                Próximo Follow-up
              </Label>
              <Input
                id="next-followup"
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
                onBlur={handleFollowUpUpdate}
              />
            </div>

            {contactStatus?.lastContact && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Último contato: {formatDate(contactStatus.lastContact)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Anotações */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Anotações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Adicione anotações sobre este contato..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesUpdate}
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

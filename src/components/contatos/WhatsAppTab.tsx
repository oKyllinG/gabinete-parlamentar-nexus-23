
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Search,
  Filter,
  Calendar,
  Settings,
  Plus,
  Clock,
  Star,
  Phone
} from "lucide-react";
import { Contact } from "@/pages/Contatos";
import { WhatsAppContactList } from "./WhatsAppContactList";
import { WhatsAppFilters } from "./WhatsAppFilters";
import { MessageTemplates } from "./MessageTemplates";
import { BirthdayMessageManager } from "./BirthdayMessageManager";
import { WhatsAppChatArea } from "./WhatsAppChatArea";

interface WhatsAppTabProps {
  contacts: Contact[];
  onUpdateContact: React.Dispatch<React.SetStateAction<Contact[]>>;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'birthday' | 'event' | 'custom';
}

export interface WhatsAppFilters {
  tipo: string;
  municipio: string;
  cargo: string;
  orgao: string;
  whatsappOptIn: boolean;
}

export interface ContactStatus {
  id: string;
  contactId: string;
  status: 'novo' | 'contatado' | 'interessado' | 'negociando' | 'fechado' | 'perdido';
  lastContact: string;
  nextFollowUp?: string;
  notes: string;
  priority: 'baixa' | 'media' | 'alta';
}

export const WhatsAppTab: React.FC<WhatsAppTabProps> = ({ contacts, onUpdateContact }) => {
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<WhatsAppFilters>({
    tipo: '',
    municipio: '',
    cargo: '',
    orgao: '',
    whatsappOptIn: true
  });
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Saudação Geral',
      content: 'Olá! Esperamos que esteja bem. Mensagem do Gabinete do Deputado Federal.',
      category: 'general'
    },
    {
      id: '2',
      name: 'Aniversário',
      content: 'Parabéns pelo seu aniversário! Desejamos muito sucesso e felicidades. Abraços do Gabinete do Deputado Federal.',
      category: 'birthday'
    }
  ]);
  const [contactStatuses, setContactStatuses] = useState<ContactStatus[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showBirthdayManager, setShowBirthdayManager] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'chat'>('list');

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      // Filtro de busca
      const matchesSearch = `${contact.nome} ${contact.sobrenome}`.toLowerCase()
        .includes(searchTerm.toLowerCase()) || 
        contact.telefone.includes(searchTerm);

      // Filtros específicos
      const matchesTipo = filters.tipo === '' || contact.tipo === filters.tipo;
      const matchesMunicipio = filters.municipio === '' || contact.municipio === filters.municipio;
      const matchesCargo = filters.cargo === '' || contact.cargo === filters.cargo;
      const matchesOrgao = filters.orgao === '' || contact.orgao === filters.orgao;
      const matchesWhatsApp = !filters.whatsappOptIn || contact.whatsappOptIn === true;

      return matchesSearch && matchesTipo && matchesMunicipio && matchesCargo && matchesOrgao && matchesWhatsApp;
    });
  }, [contacts, searchTerm, filters]);

  const getContactStatus = (contactId: string): ContactStatus | undefined => {
    return contactStatuses.find(status => status.contactId === contactId);
  };

  const updateContactStatus = (contactId: string, updates: Partial<ContactStatus>) => {
    setContactStatuses(prev => {
      const existingIndex = prev.findIndex(status => status.contactId === contactId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...updates };
        return updated;
      } else {
        const newStatus: ContactStatus = {
          id: Date.now().toString(),
          contactId,
          status: 'novo',
          lastContact: new Date().toISOString(),
          notes: '',
          priority: 'media',
          ...updates
        };
        return [...prev, newStatus];
      }
    });
  };

  const handleSendMessage = () => {
    if (!message.trim() || selectedContacts.length === 0) return;

    // Simular envio de mensagem para múltiplos contatos
    const selectedContactsData = contacts.filter(c => selectedContacts.includes(c.id));
    
    selectedContactsData.forEach(contact => {
      const cleanPhone = contact.telefone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      console.log(`Enviando mensagem para ${contact.nome}: ${message}`);
      
      // Atualizar status do contato
      updateContactStatus(contact.id, {
        status: 'contatado',
        lastContact: new Date().toISOString()
      });
    });

    // Abrir WhatsApp Web para o primeiro contato (simulação)
    if (selectedContactsData.length > 0) {
      const firstContact = selectedContactsData[0];
      const cleanPhone = firstContact.telefone.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }

    setMessage('');
    setSelectedContacts([]);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('chat');
    setSelectedContacts([contact.id]);
  };

  const handleUseTemplate = (template: MessageTemplate) => {
    setMessage(template.content);
    setShowTemplates(false);
  };

  const birthdayContacts = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;

    return contacts.filter(contact => 
      contact.nascimento && 
      contact.nascimento.dia === todayDay && 
      contact.nascimento.mes === todayMonth &&
      contact.whatsappOptIn !== false
    );
  }, [contacts]);

  // Estatísticas do CRM
  const crmStats = useMemo(() => {
    const totalContacts = filteredContacts.length;
    const contatados = contactStatuses.filter(s => s.status === 'contatado').length;
    const interessados = contactStatuses.filter(s => s.status === 'interessado').length;
    const negociando = contactStatuses.filter(s => s.status === 'negociando').length;
    
    return { totalContacts, contatados, interessados, negociando };
  }, [filteredContacts, contactStatuses]);

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas do CRM */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Contatos</p>
                <p className="text-2xl font-bold">{crmStats.totalContacts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Contatados</p>
                <p className="text-2xl font-bold">{crmStats.contatados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Interessados</p>
                <p className="text-2xl font-bold">{crmStats.interessados}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Negociando</p>
                <p className="text-2xl font-bold">{crmStats.negociando}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de Visualização */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            size="sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Lista de Contatos
          </Button>
          <Button
            variant={viewMode === 'chat' ? 'default' : 'outline'}
            onClick={() => setViewMode('chat')}
            size="sm"
            disabled={!selectedContact}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Chat Individual
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTemplates(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Templates
          </Button>
          {birthdayContacts.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBirthdayManager(true)}
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Aniversariantes ({birthdayContacts.length})
            </Button>
          )}
        </div>
      </div>

      {/* Área Principal */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-400px)]">
          {/* Sidebar Esquerdo - Lista de Contatos */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    WhatsApp CRM
                  </CardTitle>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="p-0 flex-1">
                <WhatsAppFilters 
                  filters={filters}
                  onFiltersChange={setFilters}
                  contacts={contacts}
                />
                
                <WhatsAppContactList
                  contacts={filteredContacts}
                  selectedContacts={selectedContacts}
                  onSelectionChange={setSelectedContacts}
                  birthdayContacts={birthdayContacts}
                  onContactSelect={handleContactSelect}
                  contactStatuses={contactStatuses}
                  onStatusUpdate={updateContactStatus}
                />
              </CardContent>
            </Card>
          </div>

          {/* Área Principal - Chat em Massa */}
          <div className="lg:col-span-8">
            <Card className="h-full flex flex-col bg-gradient-to-b from-green-50 to-white">
              <CardHeader className="bg-green-600 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      {selectedContacts.length === 0 
                        ? 'Selecione contatos para enviar mensagem'
                        : `${selectedContacts.length} contato(s) selecionado(s)`
                      }
                    </h3>
                    {selectedContacts.length > 0 && (
                      <p className="text-sm text-green-100">
                        Pronto para enviar mensagem em massa
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    {filteredContacts.length} disponíveis
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-4">
                {/* Área de Visualização da Mensagem */}
                <div className="flex-1 bg-white rounded-lg border p-4 mb-4 min-h-[200px]">
                  {message ? (
                    <div className="bg-green-100 rounded-lg p-3 max-w-xs ml-auto">
                      <p className="text-sm">{message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Digite sua mensagem abaixo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Área de Composição */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTemplates(true)}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Templates
                    </Button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 min-h-[80px] resize-none"
                      maxLength={1000}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || selectedContacts.length === 0}
                      className="bg-green-600 hover:bg-green-700 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{message.length}/1000 caracteres</span>
                    <span>{selectedContacts.length} destinatário(s)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <WhatsAppChatArea
          contact={selectedContact!}
          contactStatus={getContactStatus(selectedContact!.id)}
          onStatusUpdate={(updates) => updateContactStatus(selectedContact!.id, updates)}
          onBack={() => {
            setViewMode('list');
            setSelectedContact(null);
          }}
        />
      )}

      {/* Dialogs */}
      {showTemplates && (
        <MessageTemplates
          templates={templates}
          onTemplateSelect={handleUseTemplate}
          onClose={() => setShowTemplates(false)}
          onTemplatesChange={setTemplates}
        />
      )}

      {showBirthdayManager && (
        <BirthdayMessageManager
          contacts={birthdayContacts}
          templates={templates.filter(t => t.category === 'birthday')}
          onClose={() => setShowBirthdayManager(false)}
        />
      )}
    </div>
  );
};


import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Contact } from "@/pages/Contatos";
import { ContactStatus } from "./WhatsAppTab";
import { Calendar, Phone, Clock, Star } from "lucide-react";

interface WhatsAppContactListProps {
  contacts: Contact[];
  selectedContacts: string[];
  onSelectionChange: (contacts: string[]) => void;
  birthdayContacts: Contact[];
  onContactSelect?: (contact: Contact) => void;
  contactStatuses: ContactStatus[];
  onStatusUpdate: (contactId: string, updates: Partial<ContactStatus>) => void;
}

const tipoColors = {
  servidor: 'bg-blue-100 text-blue-800',
  lideranca: 'bg-green-100 text-green-800',
  empresario: 'bg-purple-100 text-purple-800',
  cidadao: 'bg-yellow-100 text-yellow-800',
  politico: 'bg-red-100 text-red-800'
};

const tipoLabels = {
  servidor: 'Servidor',
  lideranca: 'Liderança',
  empresario: 'Empresário',
  cidadao: 'Cidadão',
  politico: 'Político'
};

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

export const WhatsAppContactList: React.FC<WhatsAppContactListProps> = ({
  contacts,
  selectedContacts,
  onSelectionChange,
  birthdayContacts,
  onContactSelect,
  contactStatuses,
  onStatusUpdate
}) => {
  const handleContactToggle = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      onSelectionChange(selectedContacts.filter(id => id !== contactId));
    } else {
      onSelectionChange([...selectedContacts, contactId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(contacts.map(c => c.id));
    }
  };

  const isBirthday = (contact: Contact) => {
    return birthdayContacts.some(bc => bc.id === contact.id);
  };

  const getContactStatus = (contactId: string): ContactStatus | undefined => {
    return contactStatuses.find(status => status.contactId === contactId);
  };

  const formatLastContact = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header de Seleção */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedContacts.length === contacts.length && contacts.length > 0}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Selecionar todos ({contacts.length})
          </label>
        </div>
      </div>

      {/* Aniversariantes do Dia */}
      {birthdayContacts.length > 0 && (
        <div className="px-4 py-2 bg-blue-50 border-b">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-2">
            <Calendar className="h-4 w-4" />
            Aniversariantes de Hoje ({birthdayContacts.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {birthdayContacts.slice(0, 3).map(contact => (
              <Badge key={contact.id} variant="secondary" className="text-xs">
                {contact.nome}
              </Badge>
            ))}
            {birthdayContacts.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{birthdayContacts.length - 3} mais
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Lista de Contatos */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {contacts.map((contact) => {
            const contactStatus = getContactStatus(contact.id);
            
            return (
              <div
                key={contact.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedContacts.includes(contact.id) ? 'bg-green-50 border border-green-200' : ''
                } ${isBirthday(contact) ? 'ring-1 ring-blue-200' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onContactSelect) {
                    onContactSelect(contact);
                  } else {
                    handleContactToggle(contact.id);
                  }
                }}
              >
                <Checkbox
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => {}} // Controlled by parent click
                  className="pointer-events-none"
                  onClick={(e) => e.stopPropagation()}
                />
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contact.foto} alt={contact.nome} />
                  <AvatarFallback className="bg-gray-200 text-gray-600">
                    {contact.nome.charAt(0)}{contact.sobrenome.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">
                      {contact.nome} {contact.sobrenome}
                    </p>
                    {isBirthday(contact) && (
                      <Calendar className="h-3 w-3 text-blue-500 flex-shrink-0" />
                    )}
                    {contactStatus?.priority === 'alta' && (
                      <Star className="h-3 w-3 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${tipoColors[contact.tipo]} text-xs px-1 py-0`}>
                      {tipoLabels[contact.tipo]}
                    </Badge>
                    
                    {contactStatus && (
                      <Badge className={`${statusColors[contactStatus.status]} text-xs px-1 py-0`}>
                        {statusLabels[contactStatus.status]}
                      </Badge>
                    )}
                    
                    {contact.municipio && (
                      <span className="text-xs text-gray-500 truncate">
                        📍 {contact.municipio}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {contact.telefone}
                    </span>
                  </div>
                  
                  {contactStatus?.lastContact && (
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Último contato: {formatLastContact(contactStatus.lastContact)}
                      </span>
                    </div>
                  )}
                  
                  {contact.cargo && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {contact.cargo}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          
          {contacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhum contato encontrado</p>
              <p className="text-xs mt-1">Ajuste os filtros para ver mais contatos</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

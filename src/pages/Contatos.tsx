import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  Users, 
  Plus, 
  Search,
  Calendar,
  Filter,
  Download,
  Edit,
  Trash2
} from "lucide-react";
import { ContatoForm } from "@/components/contatos/ContatoForm";
import { ContactFilters } from "@/components/contatos/ContactFilters";
import { BirthdayList } from "@/components/contatos/BirthdayList";
import { exportContacts } from "@/utils/exportUtils";

export interface Contact {
  id: string;
  nome: string;
  sobrenome: string;
  telefone: string;
  email: string;
  tipo: 'servidor' | 'lideranca' | 'empresario' | 'cidadao' | 'politico';
  cargo?: string;
  empresa?: string;
  endereco?: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    cep: string;
    estado: string;
  };
  nascimento?: {
    dia: number;
    mes: number;
    ano?: number;
  };
  observacoes?: string;
  foto?: string;
  dataCriacao: string;
}

const tipoColors = {
  servidor: 'bg-blue-100 text-blue-800 border-blue-200',
  lideranca: 'bg-green-100 text-green-800 border-green-200',
  empresario: 'bg-purple-100 text-purple-800 border-purple-200',
  cidadao: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  politico: 'bg-red-100 text-red-800 border-red-200'
};

const tipoLabels = {
  servidor: 'Servidor',
  lideranca: 'Liderança',
  empresario: 'Empresário',
  cidadao: 'Cidadão',
  politico: 'Político'
};

const Contatos = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = `${contact.nome} ${contact.sobrenome}`.toLowerCase()
        .includes(searchTerm.toLowerCase()) || 
        contact.telefone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === '' || contact.tipo === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [contacts, searchTerm, selectedType]);

  const handleSaveContact = (contactData: Omit<Contact, 'id' | 'dataCriacao'>) => {
    if (editingContact) {
      setContacts(prev => prev.map(c => 
        c.id === editingContact.id 
          ? { ...contactData, id: editingContact.id, dataCriacao: editingContact.dataCriacao }
          : c
      ));
      setEditingContact(null);
    } else {
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString()
      };
      setContacts(prev => [...prev, newContact]);
    }
    setShowForm(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleWhatsApp = (telefone: string) => {
    const cleanPhone = telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleGroupMessage = () => {
    if (selectedContacts.length === 0) return;
    
    const phones = selectedContacts
      .map(id => contacts.find(c => c.id === id)?.telefone)
      .filter(Boolean)
      .map(phone => phone!.replace(/\D/g, ''))
      .join(',');
    
    const message = encodeURIComponent('Olá! Mensagem do Gabinete do Deputado Federal.');
    const whatsappUrl = `https://wa.me/?phone=55${phones.split(',')[0]}&text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleContactSelection = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id)
        : [...prev, id]
    );
  };

  const handleExportContacts = () => {
    exportContacts(filteredContacts);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
          <p className="text-muted-foreground">Gerencie os contatos do gabinete</p>
        </div>
        <div className="flex gap-2">
          {selectedContacts.length > 0 && (
            <Button onClick={handleGroupMessage} variant="outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Enviar WhatsApp ({selectedContacts.length})
            </Button>
          )}
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </div>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">
            <Users className="w-4 h-4 mr-2" />
            Contatos ({filteredContacts.length})
          </TabsTrigger>
          <TabsTrigger value="birthdays">
            <Calendar className="w-4 h-4 mr-2" />
            Aniversariantes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <div className="flex gap-6">
            <ContactFilters 
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              contacts={contacts}
            />
            
            <div className="flex-1 space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contatos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleExportContacts}>
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredContacts.map((contact) => (
                  <Card key={contact.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <input
                            type="checkbox"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => toggleContactSelection(contact.id)}
                            className="mt-1"
                          />
                          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                            {contact.foto ? (
                              <img src={contact.foto} alt={contact.nome} className="w-12 h-12 rounded-full object-cover" />
                            ) : (
                              <span className="text-lg font-medium">
                                {contact.nome.charAt(0)}{contact.sobrenome.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{contact.nome} {contact.sobrenome}</h3>
                              <Badge className={tipoColors[contact.tipo]}>
                                {tipoLabels[contact.tipo]}
                              </Badge>
                            </div>
                            {contact.cargo && (
                              <p className="text-sm text-muted-foreground mb-1">{contact.cargo}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                <span>{contact.telefone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                <span>{contact.email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWhatsApp(contact.telefone)}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingContact(contact);
                              setShowForm(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredContacts.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum contato encontrado</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || selectedType ? 'Tente ajustar os filtros de busca.' : 'Comece adicionando seu primeiro contato.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="birthdays">
          <BirthdayList contacts={contacts} />
        </TabsContent>
      </Tabs>

      {showForm && (
        <ContatoForm
          contact={editingContact}
          onSave={handleSaveContact}
          onCancel={() => {
            setShowForm(false);
            setEditingContact(null);
          }}
        />
      )}
    </div>
  );
};

export default Contatos;

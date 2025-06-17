
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Users } from "lucide-react";
import { Contact } from "@/pages/Contatos";

interface ContactFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  contacts: Contact[];
}

const tipoColors = {
  servidor: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  lideranca: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  empresario: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  cidadao: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  politico: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
};

const tipoLabels = {
  servidor: 'Servidor',
  lideranca: 'Liderança',
  empresario: 'Empresário',
  cidadao: 'Cidadão',
  politico: 'Político'
};

export const ContactFilters: React.FC<ContactFiltersProps> = ({
  selectedType,
  onTypeChange,
  contacts
}) => {
  const getTypeCount = (type: keyof typeof tipoLabels) => {
    return contacts.filter(contact => contact.tipo === type).length;
  };

  const totalContacts = contacts.length;
  const whatsappOptInCount = contacts.filter(c => c.whatsappOptIn !== false).length;

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Tipo de Contato</h3>
          <div className="space-y-2">
            <Button
              variant={selectedType === '' ? 'default' : 'outline'}
              className="w-full justify-between"
              onClick={() => onTypeChange('')}
            >
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Todos
              </span>
              <Badge variant="secondary">{totalContacts}</Badge>
            </Button>
            
            {(Object.keys(tipoLabels) as Array<keyof typeof tipoLabels>).map((tipo) => {
              const count = getTypeCount(tipo);
              if (count === 0) return null;
              
              return (
                <Button
                  key={tipo}
                  variant={selectedType === tipo ? 'default' : 'outline'}
                  className="w-full justify-between"
                  onClick={() => onTypeChange(tipo)}
                >
                  <span>{tipoLabels[tipo]}</span>
                  <Badge 
                    className={selectedType === tipo ? 'bg-white text-primary' : tipoColors[tipo]}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-2">Estatísticas</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Total de contatos:</span>
              <span className="font-medium">{totalContacts}</span>
            </div>
            <div className="flex justify-between">
              <span>Com telefone:</span>
              <span className="font-medium">
                {contacts.filter(c => c.telefone).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Com email:</span>
              <span className="font-medium">
                {contacts.filter(c => c.email).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>WhatsApp habilitado:</span>
              <span className="font-medium text-green-600">
                {whatsappOptInCount}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

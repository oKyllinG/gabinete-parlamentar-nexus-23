
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Filter } from "lucide-react";
import { Contact } from "@/pages/Contatos";
import { WhatsAppFilters as FilterType } from "./WhatsAppTab";

interface WhatsAppFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  contacts: Contact[];
}

const tipoLabels = {
  servidor: 'Servidor',
  lideranca: 'Liderança',
  empresario: 'Empresário',
  cidadao: 'Cidadão',
  politico: 'Político'
};

export const WhatsAppFilters: React.FC<WhatsAppFiltersProps> = ({
  filters,
  onFiltersChange,
  contacts
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Extrair valores únicos dos contatos
  const uniqueValues = React.useMemo(() => {
    const municipios = [...new Set(contacts.map(c => c.municipio).filter(Boolean))].sort();
    const cargos = [...new Set(contacts.map(c => c.cargo).filter(Boolean))].sort();
    const orgaos = [...new Set(contacts.map(c => c.orgao).filter(Boolean))].sort();
    
    return { municipios, cargos, orgaos };
  }, [contacts]);

  const updateFilters = (key: keyof FilterType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      tipo: '',
      municipio: '',
      cargo: '',
      orgao: '',
      whatsappOptIn: true
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== true
  ).length;

  return (
    <div className="border-b bg-gray-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-4 h-auto">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="font-medium">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-4 pb-4 space-y-4">
          {/* Tipo de Contato */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Tipo de Contato</Label>
            <Select value={filters.tipo} onValueChange={(value) => updateFilters('tipo', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os tipos</SelectItem>
                {Object.entries(tipoLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Município */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Município</Label>
            <Select value={filters.municipio} onValueChange={(value) => updateFilters('municipio', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os municípios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os municípios</SelectItem>
                {uniqueValues.municipios.map((municipio) => (
                  <SelectItem key={municipio} value={municipio}>{municipio}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cargo */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Cargo</Label>
            <Select value={filters.cargo} onValueChange={(value) => updateFilters('cargo', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os cargos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os cargos</SelectItem>
                {uniqueValues.cargos.map((cargo) => (
                  <SelectItem key={cargo} value={cargo}>{cargo}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Órgão */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Órgão</Label>
            <Select value={filters.orgao} onValueChange={(value) => updateFilters('orgao', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os órgãos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os órgãos</SelectItem>
                {uniqueValues.orgaos.map((orgao) => (
                  <SelectItem key={orgao} value={orgao}>{orgao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* WhatsApp Opt-in */}
          <div className="flex items-center justify-between">
            <Label htmlFor="whatsapp-optin" className="text-sm font-medium">
              Apenas contatos que aceitam WhatsApp
            </Label>
            <Switch
              id="whatsapp-optin"
              checked={filters.whatsappOptIn}
              onCheckedChange={(value) => updateFilters('whatsappOptIn', value)}
            />
          </div>

          {/* Limpar Filtros */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="w-full"
            >
              Limpar Filtros
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

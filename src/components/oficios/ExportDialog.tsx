
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { exportOficios } from "@/utils/exportUtils";

interface ExportDialogProps {
  oficios: any[];
}

const tipoLabels = {
  enviado: 'Enviado',
  recebido: 'Recebido',
  convite: 'Convite',
  protocolado: 'Protocolado'
};

export const ExportDialog: React.FC<ExportDialogProps> = ({ oficios }) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>('all');
  const [selectedOrgao, setSelectedOrgao] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  // Get unique municipalities and organs from oficios
  const municipios = Array.from(new Set(oficios.map(o => o.municipio).filter(Boolean)));
  const orgaos = Array.from(new Set(oficios.map(o => o.orgao).filter(Boolean)));

  const handleExport = () => {
    const typeFilter = selectedType === 'all' ? undefined : selectedType;
    const municipioFilter = selectedMunicipio === 'all' ? undefined : selectedMunicipio;
    const orgaoFilter = selectedOrgao === 'all' ? undefined : selectedOrgao;
    
    exportOficios(oficios, typeFilter, startDate, endDate, municipioFilter, orgaoFilter);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exportar Ofícios</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo de Ofício</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(tipoLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="municipio">Município</Label>
            <Select value={selectedMunicipio} onValueChange={setSelectedMunicipio}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os municípios" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os municípios</SelectItem>
                {municipios.map((municipio) => (
                  <SelectItem key={municipio} value={municipio}>
                    {municipio}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orgao">Órgão</Label>
            <Select value={selectedOrgao} onValueChange={setSelectedOrgao}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os órgãos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os órgãos</SelectItem>
                {orgaos.map((orgao) => (
                  <SelectItem key={orgao} value={orgao}>
                    {orgao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Data de Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleExport}>
              Exportar CSV
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

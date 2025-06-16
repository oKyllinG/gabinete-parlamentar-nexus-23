
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface ViagemFieldsProps {
  form: any;
}

export function ViagemFields({ form }: ViagemFieldsProps) {
  const [acompanhantes, setAcompanhantes] = useState<string[]>(form.getValues("acompanhantes") || []);

  const addAcompanhante = () => {
    const newAcompanhantes = [...acompanhantes, ""];
    setAcompanhantes(newAcompanhantes);
    form.setValue("acompanhantes", newAcompanhantes);
  };

  const removeAcompanhante = (index: number) => {
    const newAcompanhantes = acompanhantes.filter((_, i) => i !== index);
    setAcompanhantes(newAcompanhantes);
    form.setValue("acompanhantes", newAcompanhantes);
  };

  const updateAcompanhante = (index: number, value: string) => {
    const newAcompanhantes = [...acompanhantes];
    newAcompanhantes[index] = value;
    setAcompanhantes(newAcompanhantes);
    form.setValue("acompanhantes", newAcompanhantes);
  };

  const calculateDistance = async () => {
    const municipioSaida = form.getValues("municipioSaida");
    const municipioDestino = form.getValues("municipioDestino");
    
    if (municipioSaida && municipioDestino) {
      // Simulação de cálculo de distância - em um app real, usaria uma API como Google Maps
      const randomDistance = Math.floor(Math.random() * 500) + 50;
      form.setValue("distanciaKm", randomDistance);
    }
  };

  return (
    <div className="space-y-4 border-t pt-4">
      <h3 className="text-lg font-semibold">Informações de Viagem</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="municipioSaida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município de Saída</FormLabel>
              <FormControl>
                <Input placeholder="Ex: São Paulo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="municipioDestino"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Município de Destino</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rio de Janeiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distanciaKm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distância (km)</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Ex: 430" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : "")}
                  />
                </FormControl>
                <Button type="button" variant="outline" onClick={calculateDistance}>
                  Calcular
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="horarioSaida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horário de Saída</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormLabel>Quem Acompanhará</FormLabel>
        <div className="space-y-2 mt-2">
          {acompanhantes.map((acompanhante, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nome do acompanhante"
                value={acompanhante}
                onChange={(e) => updateAcompanhante(index, e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeAcompanhante(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addAcompanhante}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Acompanhante
          </Button>
        </div>
      </div>
    </div>
  );
}

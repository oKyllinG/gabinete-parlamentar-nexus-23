
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Participante {
  id: string;
  nome: string;
}

interface ParticipantesInputProps {
  value: Participante[];
  onChange: (list: Participante[]) => void;
  allContacts: Participante[];
}

export function ParticipantesInput({ value, onChange, allContacts }: ParticipantesInputProps) {
  const [input, setInput] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Participante[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    const filtered = allContacts
      .filter(
        (c) =>
          c.nome.toLowerCase().includes(input.trim().toLowerCase()) &&
          !value.some((sel) => sel.id === c.id)
      )
      .slice(0, 5);
    setSuggestions(filtered);
  }, [input, allContacts, value]);

  const addParticipante = (p: Participante) => {
    onChange([...value, p]);
    setInput("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const addCustomParticipante = () => {
    if (
      input.trim().length > 0 &&
      !value.some((v) => v.nome.toLowerCase() === input.trim().toLowerCase())
    ) {
      onChange([...value, { id: input.trim(), nome: input.trim() }]);
      setInput("");
      setSuggestions([]);
      inputRef.current?.focus();
    }
  };

  const removeParticipante = (id: string) => {
    onChange(value.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((part) => (
          <Badge
            key={part.id}
            className="flex items-center gap-1 px-2 py-1 rounded text-base bg-blue-50 border border-blue-200 text-blue-900"
          >
            {part.nome}
            <button
              type="button"
              className="ml-1 hover:text-red-500"
              onClick={() => removeParticipante(part.id)}
              tabIndex={-1}
            >
              <X className="w-4 h-4" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="relative">
        <Input
          ref={inputRef}
          placeholder="Buscar contato ou adicionar participante..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (suggestions.length > 0) addParticipante(suggestions[0]);
              else addCustomParticipante();
            }
          }}
          className="pl-3"
        />
        {input && suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-0 bg-white shadow rounded border mt-1 max-h-44 overflow-auto">
            {suggestions.map((c) => (
              <div
                key={c.id}
                className="p-2 cursor-pointer hover:bg-blue-50"
                onMouseDown={() => addParticipante(c)}
              >
                {c.nome}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

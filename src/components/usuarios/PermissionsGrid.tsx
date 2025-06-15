
import { ModuleKey, PermissionLevel, UserPermissions } from "@/types/permissions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const label: Record<PermissionLevel, string> = {
  ADMIN: "Administrador",
  VISUALIZACAO: "Visualização",
  SEM_ACESSO: "Sem Acesso",
};

const perms: PermissionLevel[] = ["SEM_ACESSO", "VISUALIZACAO", "ADMIN"];

const icons: Record<PermissionLevel, string> = {
  ADMIN: "⚡",
  VISUALIZACAO: "👁️",
  SEM_ACESSO: "🚫",
};

// Módulos permitidos para grid (remover "usuarios")
const MODULES_LABELS: Record<Exclude<ModuleKey, "usuarios">, string> = {
  "painel-controle": "Painel de Controle",
  "agenda": "Agenda",
  "oficios": "Ofícios",
  "contatos": "Contatos",
  "briefing": "Briefing",
  "obras-equipamentos": "Obras e Equipamentos",
  "emendas": "Emendas",
  "configuracoes": "Configurações",
};

type PermissionsGridProps = {
  value: UserPermissions;
  onChange: (module: ModuleKey, newLevel: PermissionLevel) => void;
};

const badgeVariants: Record<PermissionLevel, string> = {
  ADMIN: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100",
  VISUALIZACAO: "border-yellow-300 bg-yellow-50 text-yellow-800 hover:bg-yellow-100",
  SEM_ACESSO: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100",
}

export function PermissionsGrid({ value, onChange }: PermissionsGridProps) {
  return (
    <div className="space-y-2">
      {Object.entries(MODULES_LABELS).map(([mKey, mLabel], index, arr) => {
        const module = mKey as Exclude<ModuleKey, "usuarios">;
        return (
          <div
            key={module}
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3",
              index < arr.length - 1 && "border-b"
            )}
          >
            <div className="font-medium whitespace-nowrap text-sm">{mLabel}</div>
            <div className="flex gap-2 flex-wrap">
              {perms.map(level =>
                <Badge
                  key={level}
                  variant="outline"
                  onClick={() => onChange(module, level)}
                  className={cn(
                    "cursor-pointer transition-all text-xs font-semibold px-3 py-1",
                    badgeVariants[level],
                    value[module] === level 
                      ? "ring-2 ring-offset-2 ring-primary" 
                      : "opacity-60 hover:opacity-100"
                  )}
                  aria-label={label[level]}
                >
                  <span className="mr-1.5">{icons[level]}</span>{label[level]}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

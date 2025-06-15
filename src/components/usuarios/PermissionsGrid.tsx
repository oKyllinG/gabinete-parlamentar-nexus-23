
import { ModuleKey, PermissionLevel, UserPermissions } from "@/types/permissions";

const label: Record<PermissionLevel, string> = {
  ADMIN: "Administrador",
  VISUALIZACAO: "Visualização",
  SEM_ACESSO: "Sem Acesso",
};

const color: Record<PermissionLevel, string> = {
  ADMIN: "bg-green-100 text-green-700 border-green-300",
  VISUALIZACAO: "bg-yellow-50 text-yellow-900 border-yellow-300",
  SEM_ACESSO: "bg-red-50 text-red-700 border-red-300",
};

const perms: PermissionLevel[] = ["SEM_ACESSO", "VISUALIZACAO", "ADMIN"];

const icons: Record<PermissionLevel, string> = {
  ADMIN: "⚡",
  VISUALIZACAO: "👁️",
  SEM_ACESSO: "🚫",
};

// Módulos permitidos para grid (remover "usuarios")
const MODULES_LABELS: Record<Exclude<ModuleKey, "usuarios">, string> = {
  "painel-controle": "Painel",
  "agenda": "Agenda",
  "oficios": "Ofícios",
  "contatos": "Contatos",
  "briefing": "Briefing",
  "obras-equipamentos": "Obras/Equip.",
  "emendas": "Emendas",
  "configuracoes": "Configurações",
};

type PermissionsGridProps = {
  value: UserPermissions;
  onChange: (module: ModuleKey, newLevel: PermissionLevel) => void;
};

export function PermissionsGrid({ value, onChange }: PermissionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {Object.entries(MODULES_LABELS).map(([mKey, mLabel]) => {
        const module = mKey as Exclude<ModuleKey, "usuarios">;
        return (
          <div key={module} className="flex flex-col gap-2 border rounded p-3 bg-background min-w-0">
            <div className="font-medium text-xs mb-1">{mLabel}</div>
            <div className="flex flex-col sm:flex-row gap-1">
              {perms.map(level =>
                <button
                  key={level}
                  type="button"
                  className={`flex items-center px-2 py-1 sm:py-0.5 rounded border text-xs font-semibold transition ${color[level]}
                    ${value[module] === level ? "ring-2 ring-offset-1 border-2" : ""}
                  `}
                  onClick={() => onChange(module, level)}
                  aria-label={label[level]}
                >
                  <span className="mr-1">{icons[level]}</span>{label[level]}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}


import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PermissionLevel, ModuleKey } from "@/types/permissions";
import { AppUser } from "@/types/permissions";

// Colunas principais removendo "usuarios"
const MAIN_MODULES: Exclude<ModuleKey, "usuarios">[] = [
  "painel-controle",
  "contatos",
  "oficios",
  "configuracoes",
];

const permColor = {
  ADMIN: "text-green-500",
  VISUALIZACAO: "text-yellow-600",
  SEM_ACESSO: "text-red-500",
};
const permIcon = {
  ADMIN: "⚡",
  VISUALIZACAO: "👁️",
  SEM_ACESSO: "🚫",
};

export function UserTable({ users, onEdit, onDelete, currentUserId }: {
  users: AppUser[];
  onEdit: (user: AppUser) => void;
  onDelete: (user: AppUser) => void;
  currentUserId: string;
}) {
  return (
    <div className="overflow-x-auto border rounded bg-background">
      <table className="min-w-full divide-y">
        <thead>
          <tr>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-center w-2/5">Permissões<br/><span className="text-xs">(dos principais módulos)</span></th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t hover:bg-muted/30">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3 flex flex-wrap gap-3 items-center justify-center">
                {MAIN_MODULES.map((k) => (
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold border ${permColor[u.permissions[k]]} border-gray-200 gap-1`}
                    key={k}
                  >
                    {permIcon[u.permissions[k] as PermissionLevel]} <span className="capitalize">{k.replace("-", " ")}</span>
                  </span>
                ))}
              </td>
              <td className="p-3 text-center">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(u)}
                  className="mr-2"
                  title="Editar"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(u)}
                  disabled={u.id === currentUserId || u.id === "1"}
                  title="Excluir"
                >
                  <X className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          Nenhum usuário cadastrado ainda.
        </div>
      )}
    </div>
  );
}

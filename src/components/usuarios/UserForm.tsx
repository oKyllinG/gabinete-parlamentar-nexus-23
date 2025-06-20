import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PermissionsGrid } from "./PermissionsGrid";
import { AppUser, ModuleKey, PermissionLevel, UserPermissions } from "@/types/permissions";
import { ScrollArea } from "@/components/ui/scroll-area";

const defaultModules: Exclude<ModuleKey, "usuarios">[] = [
  "painel-controle",
  "agenda",
  "oficios",
  "contatos",
  "briefing",
  "obras-equipamentos",
  "emendas",
  "configuracoes",
];

type UserFormProps = {
  userEdit?: AppUser | null;
  onSave: (user: Omit<AppUser, "id">) => void;
  saving?: boolean;
  onCancel: () => void;
};

function getInitialPerm(u?: AppUser | null): UserPermissions {
  if (!u) {
    return Object.fromEntries(defaultModules.map(m => [m, "SEM_ACESSO"])) as UserPermissions;
  }
  // Remove 'usuarios' if exists
  const newPerms = { ...u.permissions };
  delete newPerms.usuarios;
  return newPerms;
}

export function UserForm({ userEdit, onSave, saving, onCancel }: UserFormProps) {
  const [name, setName] = useState(userEdit?.name || "");
  const [email, setEmail] = useState(userEdit?.email || "");
  const [permissions, setPermissions] = useState<UserPermissions>(getInitialPerm(userEdit));

  function onPermChange(module: ModuleKey, level: PermissionLevel) {
    setPermissions(ps => ({ ...ps, [module]: level }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSave({ name, email, permissions });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <div>
        <label className="block mb-1 font-medium">Nome</label>
        <Input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Permissões</label>
        <ScrollArea className="h-[45vh] w-full rounded-md border p-4">
          <PermissionsGrid value={permissions} onChange={onPermChange} />
        </ScrollArea>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={!name || !email || saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

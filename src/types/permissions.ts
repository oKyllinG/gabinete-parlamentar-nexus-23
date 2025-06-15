
export type PermissionLevel = "SEM_ACESSO" | "VISUALIZACAO" | "ADMIN";

// Identificadores dos módulos
export type ModuleKey =
  | "painel-controle"
  | "agenda"
  | "oficios"
  | "contatos"
  | "briefing"
  | "obras-equipamentos"
  | "emendas"
  | "configuracoes"
  | "usuarios";

export interface UserPermissions {
  [module: string]: PermissionLevel;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  permissions: UserPermissions;
}

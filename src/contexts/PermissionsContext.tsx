
import React, { createContext, useContext, useState, ReactNode } from "react";
import { AppUser, PermissionLevel, ModuleKey } from "@/types/permissions";

// Usuário admin fictício para início (full access)
const defaultUser: AppUser = {
  id: "1",
  name: "Administrador",
  email: "admin@email.com",
  permissions: {
    "painel-controle": "ADMIN",
    "agenda": "ADMIN",
    "oficios": "ADMIN",
    "contatos": "ADMIN",
    "briefing": "ADMIN",
    "obras-equipamentos": "ADMIN",
    "emendas": "ADMIN",
    "configuracoes": "ADMIN",
    "usuarios": "ADMIN", // somente admin pode alterar permissões de usuários
  }
};

interface PermissionsContextType {
  user: AppUser;
  setUser: (user: AppUser) => void;
  getPermission: (module: ModuleKey) => PermissionLevel;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser>(defaultUser);

  const getPermission = (module: ModuleKey) =>
    user.permissions[module] || "SEM_ACESSO";

  return (
    <PermissionsContext.Provider value={{ user, setUser, getPermission }}>
      {children}
    </PermissionsContext.Provider>
  );
}

// Hook para fácil acesso
export function usePermissions() {
  const ctx = useContext(PermissionsContext);
  if (!ctx) throw new Error("usePermissions must be used within PermissionsProvider");
  return ctx;
}

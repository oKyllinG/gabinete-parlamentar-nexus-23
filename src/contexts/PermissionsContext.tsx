import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AppUser, PermissionLevel, ModuleKey, UserPermissions } from "@/types/permissions";

const MODULES: ModuleKey[] = [
  "painel-controle",
  "agenda",
  "oficios",
  "contatos",
  "briefing",
  "obras-equipamentos",
  "emendas",
  "configuracoes",
  "usuarios",
];

// Usuários fictícios para demo inicial
const demoUsers: AppUser[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@email.com",
    permissions: Object.fromEntries(MODULES.map(k => [k, "ADMIN"])) as UserPermissions,
  },
  {
    id: "2",
    name: "Ana Silva",
    email: "ana@email.com",
    permissions: {
      "painel-controle": "VISUALIZACAO",
      "agenda": "VISUALIZACAO",
      "oficios": "SEM_ACESSO",
      "contatos": "ADMIN",
      "briefing": "VISUALIZACAO",
      "obras-equipamentos": "SEM_ACESSO",
      "emendas": "VISUALIZACAO",
      "configuracoes": "SEM_ACESSO",
      "usuarios": "SEM_ACESSO",
    }
  },
  {
    id: "3",
    name: "Carlos Admin",
    email: "carlos@email.com",
    permissions: {
      "painel-controle": "ADMIN",
      "agenda": "ADMIN",
      "oficios": "VISUALIZACAO",
      "contatos": "ADMIN",
      "briefing": "ADMIN",
      "obras-equipamentos": "ADMIN",
      "emendas": "ADMIN",
      "configuracoes": "ADMIN",
      "usuarios": "ADMIN",
    }
  },
];

function loadUsers(): AppUser[] {
  try {
    const val = window.localStorage.getItem("usuarios");
    if (val) return JSON.parse(val);
  } catch {}
  return demoUsers;
}
function saveUsers(users: AppUser[]) {
  window.localStorage.setItem("usuarios", JSON.stringify(users));
}

interface PermissionsContextType {
  user: AppUser;
  setUser: (user: AppUser) => void;
  getPermission: (module: ModuleKey) => PermissionLevel;
  users: AppUser[];
  addUser: (u: Omit<AppUser, "id">) => void;
  updateUser: (u: AppUser) => void;
  removeUser: (id: string) => void;
  setUsers: (users: AppUser[]) => void;
  MODULES: ModuleKey[];
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<AppUser[]>(() => loadUsers());

  // o usuário logado sempre é o primeiro da lista
  const [user, setUser] = useState<AppUser>(() => users[0]);

  useEffect(() => {
    saveUsers(users);
  }, [users]);
  useEffect(() => {
    if (!users.find(u => u.id === user.id)) {
      setUser(users[0]);
    }
  }, [users]);

  const getPermission = (module: ModuleKey) =>
    user.permissions[module] || "SEM_ACESSO";

  function addUser(u: Omit<AppUser, "id">) {
    setUsers(us => [...us, { ...u, id: Math.random().toString(36).slice(2) }]);
  }
  function updateUser(updated: AppUser) {
    setUsers(us => us.map(u => (u.id === updated.id ? updated : u)));
    if (user.id === updated.id) setUser(updated);
  }
  function removeUser(id: string) {
    setUsers(us => us.filter(u => u.id !== id));
  }

  return (
    <PermissionsContext.Provider value={{
      user, setUser, getPermission,
      users, addUser, updateUser, removeUser, setUsers,
      MODULES
    }}>
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

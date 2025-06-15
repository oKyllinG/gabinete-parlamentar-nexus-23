
import { usePermissions } from "@/contexts/PermissionsContext";

export default function Usuarios() {
  const { user } = usePermissions();

  // Somente admin visualiza este módulo
  if (user.permissions.usuarios !== "ADMIN") {
    return <div className="p-8 text-red-500">Acesso restrito.</div>;
  }

  // Estrutura inicial para CRU futuros
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <div className="text-muted-foreground mb-4">
        Aqui você poderá cadastrar, editar e definir permissões para os usuários do sistema.
      </div>
      <div className="border rounded p-6 bg-muted/40">
        <div className="text-muted-foreground mb-2">
          (Funcionalidade completa de usuários em construção)
        </div>
        {/* A tabela de usuários e formulário irão aqui futuramente */}
      </div>
    </div>
  );
}


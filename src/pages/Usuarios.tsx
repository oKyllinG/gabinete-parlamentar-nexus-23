
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { usePermissions } from "@/contexts/PermissionsContext";
import { UserTable } from "@/components/usuarios/UserTable";
import { UserForm } from "@/components/usuarios/UserForm";
import { AppUser } from "@/types/permissions";

export default function Usuarios() {
  const { user, users, addUser, updateUser, removeUser } = usePermissions();

  // Permitir apenas admin acessar
  if (user.permissions.usuarios !== "ADMIN") {
    return <div className="p-8 text-red-500">Acesso restrito.</div>;
  }

  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AppUser | null>(null);

  function handleAdd() {
    setEditUser(null);
    setModalOpen(true);
  }
  function handleEdit(u: AppUser) {
    setEditUser(u);
    setModalOpen(true);
  }
  function handleDelete(u: AppUser) {
    if (window.confirm(`Excluir usuário "${u.name}"? Esta ação não pode ser desfeita.`)) {
      removeUser(u.id);
    }
  }
  function handleSave(u: Omit<AppUser, "id">) {
    if (editUser) {
      updateUser({ ...editUser, ...u });
    } else {
      addUser(u);
    }
    setModalOpen(false);
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h1>
      <div className="text-muted-foreground mb-4">
        Aqui você poderá cadastrar, editar e definir permissões para os usuários do sistema.
      </div>
      <div className="mb-4 flex justify-end">
        <Button onClick={handleAdd}>Adicionar Usuário</Button>
      </div>
      <UserTable
        users={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserId={user.id}
      />

      {/* Modal de adicionar/editar usuário */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editUser ? "Editar Usuário" : "Cadastrar Usuário"}
            </DialogTitle>
            <DialogDescription>
              {editUser
                ? "Altere as informações e permissões do usuário."
                : "Preencha as informações para cadastrar um novo usuário e defina as permissões."}
            </DialogDescription>
          </DialogHeader>
          <UserForm
            userEdit={editUser}
            onSave={handleSave}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

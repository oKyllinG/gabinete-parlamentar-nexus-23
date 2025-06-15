import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/contexts/PermissionsContext";
import { UserTable } from "@/components/usuarios/UserTable";
import { UserForm } from "@/components/usuarios/UserForm";
import { AppUser, UserPermissions } from "@/types/permissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function UserManagement() {
  const { user, users, addUser, updateUser, removeUser } = usePermissions();
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
  function handleSave(formData: Omit<AppUser, "id">) {
    if (editUser) {
      // Preserva as permissões existentes (como 'usuarios') e mescla com as novas
      const finalPermissions = {
        ...editUser.permissions,
        ...formData.permissions,
      };
      updateUser({ ...editUser, ...formData, permissions: finalPermissions });
    } else {
      // Adiciona um novo usuário com permissão 'usuarios' definida como 'SEM_ACESSO' por padrão
      const finalPermissions = {
        ...formData.permissions,
        usuarios: "SEM_ACESSO",
      } as UserPermissions;
      addUser({ ...formData, permissions: finalPermissions });
    }
    setModalOpen(false);
  }

  // Permissão para gerenciar usuários
  if (user.permissions.usuarios !== "ADMIN") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Acesso Restrito</CardTitle>
          <CardDescription>Você não tem permissão para gerenciar usuários.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
                <CardDescription>
                Adicione, edite e defina permissões para os usuários do sistema.
                </CardDescription>
            </div>
            <Button onClick={handleAdd} className="w-full sm:w-auto">Adicionar Usuário</Button>
        </div>
      </CardHeader>
      <CardContent>
        <UserTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUserId={user.id}
        />

        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[650px]">
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
      </CardContent>
    </Card>
  );
}


export default function Configuracoes() {
  const { getPermission } = usePermissions();
  const canSeeUsers = getPermission("usuarios") === "ADMIN";
  const canSeeSettings = getPermission("configuracoes") !== "SEM_ACESSO";

  if (!canSeeSettings) {
    return <div className="p-8 text-red-500">Acesso restrito.</div>;
  }
  
  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Configurações</h1>
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 sm:w-auto">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          {canSeeUsers && <TabsTrigger value="usuarios">Usuários</TabsTrigger>}
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
        </TabsList>
        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações gerais do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Em breve...</p>
            </CardContent>
          </Card>
        </TabsContent>
        {canSeeUsers && (
          <TabsContent value="usuarios">
            <UserManagement />
          </TabsContent>
        )}
        <TabsContent value="notificacoes">
           <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Gerencie suas preferências de notificação.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Em breve...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

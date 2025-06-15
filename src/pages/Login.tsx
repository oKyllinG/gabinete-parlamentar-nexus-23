
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { usePermissions } from "@/contexts/PermissionsContext";
import { LogIn } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { users, setUser } = usePermissions();

  // Usuário demo é sempre o "Administrador"
  const adminUser = users.find(u => u.email === "admin@email.com");

  function handleDemoLogin() {
    if (adminUser) {
      setUser(adminUser);
      navigate("/painel-controle", { replace: true });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/70">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="py-8 flex flex-col items-center gap-4">
          <LogIn size={40} className="text-primary mb-2" />
          <h2 className="text-2xl font-bold text-foreground">Bem-vindo!</h2>
          <p className="text-muted-foreground text-center">
            Faça login para acessar o sistema.
          </p>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full" onClick={handleDemoLogin}>
            Entrar como demonstração
          </Button>
          {/* Espaço para login futuro */}
        </CardContent>
      </Card>
    </div>
  );
}

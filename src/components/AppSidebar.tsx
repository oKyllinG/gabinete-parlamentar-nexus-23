
import {
  Calendar,
  FileText,
  Users,
  Briefcase,
  Building,
  DollarSign,
  Settings,
  User,
  LayoutDashboard,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePermissions } from "@/contexts/PermissionsContext"
import { NavLink, useLocation } from "react-router-dom"
import type { ModuleKey } from "@/types/permissions";

// Itens principais sem "usuarios" e "configuracoes"
const allMenuItems: {
  key: ModuleKey;
  title: string;
  url: string;
  icon: React.ElementType;
}[] = [
  {
    key: "painel-controle",
    title: "Painel de Controle",
    url: "/painel-controle",
    icon: LayoutDashboard,
  },
  {
    key: "agenda",
    title: "Agenda",
    url: "/agenda",
    icon: Calendar,
  },
  {
    key: "oficios",
    title: "Ofícios",
    url: "/oficios",
    icon: FileText,
  },
  {
    key: "contatos",
    title: "Contatos",
    url: "/contatos",
    icon: Users,
  },
  {
    key: "briefing",
    title: "Briefing",
    url: "/briefing",
    icon: Briefcase,
  },
  {
    key: "obras-equipamentos",
    title: "Obras e Equipamentos",
    url: "/obras-equipamentos",
    icon: Building,
  },
  {
    key: "emendas",
    title: "Emendas",
    url: "/emendas",
    icon: DollarSign,
  },
];

export function AppSidebar() {
  const { getPermission } = usePermissions();
  const location = useLocation();

  const menuItems = allMenuItems.filter(
    (item) => getPermission(item.key) !== "SEM_ACESSO"
  );

  const showConfiguracoes = getPermission("configuracoes") !== "SEM_ACESSO";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sidebar-foreground font-semibold text-sm">
              Gabinete
            </span>
            <span className="text-sidebar-foreground/70 text-xs">
              Deputado Federal
            </span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 text-xs font-medium">
            SISTEMA DE GESTÃO
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={
                      location.pathname.startsWith(item.url)
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Configurações */}
              {showConfiguracoes && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild
                    className={
                      location.pathname.startsWith("/configuracoes")
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                        : "hover:bg-sidebar-accent/50"
                    }
                  >
                    <NavLink
                      to="/configuracoes"
                      className="flex items-center gap-3 px-3 py-2"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Configurações</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="text-xs text-sidebar-foreground/50 text-center">
          Sistema de Gestão v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

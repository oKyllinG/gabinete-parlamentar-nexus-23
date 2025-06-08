
import {
  Calendar,
  FileText,
  Users,
  Briefcase,
  Building,
  DollarSign,
  Settings,
  User,
  LayoutDashboard
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

const menuItems = [
  {
    title: "Painel de Controle",
    url: "/painel-controle",
    icon: LayoutDashboard,
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: Calendar,
  },
  {
    title: "Ofícios",
    url: "/oficios",
    icon: FileText,
  },
  {
    title: "Contatos",
    url: "/contatos",
    icon: Users,
  },
  {
    title: "Briefing",
    url: "/briefing",
    icon: Briefcase,
  },
  {
    title: "Obras e Equipamentos",
    url: "/obras-equipamentos",
    icon: Building,
  },
  {
    title: "Emendas",
    url: "/emendas",
    icon: DollarSign,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
]

export function AppSidebar() {
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
                    className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent/50"
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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

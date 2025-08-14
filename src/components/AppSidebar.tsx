import { NavLink, useLocation } from "react-router-dom";
import { Home, BarChart3, Trophy, Settings as SettingsIcon, ReceiptText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSettings } from "@/context/SettingsContext";

const ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  home: Home,
  sales: ReceiptText,
  ranking: Trophy,
  dashboard: BarChart3,
  settings: SettingsIcon,
};

const TITLES: Record<string, string> = {
  home: "Home",
  sales: "Vendas",
  ranking: "Ranking",
  dashboard: "Dashboard",
  settings: "Configurações",
};

export function AppSidebar() {
  const { settings } = useSettings();
  const location = useLocation();
  const currentPath = location.pathname;

  const items = settings.menuOrder.map((key) => ({ key, url: key === "home" ? "/" : `/${key}`, icon: ICONS[key], title: TITLES[key] }));

  return (
    <Sidebar collapsible="icon" className="bg-[#003366] border-r border-[#002244]">
      <SidebarContent className="bg-[#003366]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-semibold bg-[#003366]">Navegação</SidebarGroupLabel>
          <SidebarGroupContent className="bg-[#003366]">
            <SidebarMenu className="bg-[#003366]">
              {items.map((item) => (
                <SidebarMenuItem key={item.key} className="bg-[#003366]">
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentPath === item.url}
                    className="bg-[#003366] hover:bg-[#002244] data-[active=true]:bg-[#001122] text-white"
                  >
                    <NavLink to={item.url} end aria-label={item.title} className="flex items-center text-white bg-[#003366] hover:bg-[#002244]">
                      <item.icon className="mr-2 h-4 w-4 text-white" />
                      <span className="truncate group-data-[collapsible=icon]:hidden text-white">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

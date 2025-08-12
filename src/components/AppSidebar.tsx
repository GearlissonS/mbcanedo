import { NavLink, useLocation } from "react-router-dom";
import { Home, BarChart3, Trophy, Settings as SettingsIcon, ReceiptText } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { useSettings } from "@/context/SettingsContext";
const ICONS: Record<string, any> = {
  home: Home,
  sales: ReceiptText,
  ranking: Trophy,
  dashboard: BarChart3,
  settings: SettingsIcon
};
const TITLES: Record<string, string> = {
  home: "Home",
  sales: "Vendas",
  ranking: "Ranking",
  dashboard: "Dashboard",
  settings: "Configurações"
};
export function AppSidebar() {
  const {
    settings
  } = useSettings();
  const location = useLocation();
  const currentPath = location.pathname;
  const items = settings.menuOrder.map(key => ({
    key,
    url: key === "home" ? "/" : `/${key}`,
    icon: ICONS[key],
    title: TITLES[key]
  }));
  return <Sidebar collapsible="icon">
      <SidebarContent className="bg-blue-400 ">
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url}>
                    <NavLink to={item.url} end aria-label={item.title} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
}
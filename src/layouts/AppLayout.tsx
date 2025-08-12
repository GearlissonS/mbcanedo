import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

export default function AppLayout() {
  const { settings } = useSettings();

  return (
    <SidebarProvider>
      <Helmet>
        <title>{settings.title} — Gestão de Vendas Imobiliárias</title>
        <meta name="description" content="Sistema moderno para gestão de vendas imobiliárias com ranking, vendas e dashboard." />
        <link rel="canonical" href="/" />
      </Helmet>

      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-3">
          <SidebarTrigger className="ml-1" />
          <div className="flex items-center gap-2">
            {settings.logoDataUrl ? (
              <img src={settings.logoDataUrl} alt="Logo My Broker" className="h-6 w-auto" />
            ) : (
              <div className="h-6 w-6 rounded bg-primary/20" aria-hidden="true" />
            )}
            <span className="font-semibold">{settings.title}</span>
          </div>
          <div className="ml-auto">
            <Button asChild variant="secondary" size="sm" aria-label="Voltar para Home">
              <Link to="/">Voltar</Link>
            </Button>
          </div>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

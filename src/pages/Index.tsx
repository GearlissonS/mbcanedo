import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";

const Index = () => {
  const { settings } = useSettings();
  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center bg-gradient-to-b from-background to-muted/40 animate-fade-in">
      <Helmet>
        <title>{settings.title} — Home</title>
        <meta name="description" content="Home do My Broker Senador Canedo: visão geral e atalhos para Vendas e Dashboard." />
      </Helmet>
      <section className="text-center max-w-3xl px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {settings.title} — Gestão de Vendas Imobiliárias
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Organize suas vendas, acompanhe o ranking gamificado dos corretores e visualize indicadores poderosos em um dashboard moderno.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild>
            <Link to="/sales">Cadastrar Vendas</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/dashboard">Ver Dashboard</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";
import { Building2, Home as HomeIcon, Handshake, TrendingUp, KeyRound } from "lucide-react";
import BackButton from "@/components/BackButton";

const Index = () => {
  // ...existing code...
  const { settings } = useSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.title,
    url: typeof window !== "undefined" ? window.location.origin : "/",
  } as const;
  return (
    <div className="min-h-[calc(100vh-56px)] grid place-items-center bg-gradient-to-b from-background to-muted/40 animate-fade-in">
      <BackButton />
      <Helmet>
        <title>{settings.title} — Gestão de Vendas Imobiliárias</title>
        <meta
          name="description"
          content={`${settings.title}: soluções modernas para gestão de vendas imobiliárias, equipe e ranking. Tema geométrico em azul marinho e branco.`}
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="relative w-full max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-2xl border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/10" aria-hidden="true" />

          <div className="relative grid items-center gap-8 p-8 md:grid-cols-[1.4fr,1fr] md:p-12">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-background/70">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Soluções Imobiliárias
              </div>

              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
                {settings.title} — Gestão de Vendas Imobiliárias
              </h1>
              <p className="mt-4 text-muted-foreground text-lg">
                Organize vendas, motive sua equipe com ranking gamificado e acompanhe KPIs em um dashboard moderno.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Button asChild size="lg">
                  <Link to="/sales">Cadastrar Vendas</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/dashboard">Ver Dashboard</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/ranking">Ver Ranking</Link>
                </Button>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-4 text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <Building2 className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Imóveis</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <HomeIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Casas</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Handshake className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Equipe</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Crescimento</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <KeyRound className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Chaves</span>
                </div>
              </div>
            </div>

            <div className="relative mx-auto">
              {settings.logoDataUrl ? (
                <div className="mx-auto h-40 w-40 sm:h-48 sm:w-48 rounded-full border bg-background/80 shadow-sm flex items-center justify-center">
                  <img
                    src={settings.logoDataUrl}
                    alt={`Logo ${settings.title}`}
                    className="max-h-28 max-w-28 sm:max-h-32 sm:max-w-32 object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="mx-auto h-40 w-40 sm:h-48 sm:w-48 rounded-2xl border bg-primary/10 shadow-inner flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-3 text-primary">
                    <Building2 className="h-10 w-10" aria-hidden="true" />
                    <HomeIcon className="h-10 w-10" aria-hidden="true" />
                    <Handshake className="h-10 w-10" aria-hidden="true" />
                    <TrendingUp className="h-10 w-10" aria-hidden="true" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

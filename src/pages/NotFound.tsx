import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import GeometricBackground from "@/components/design/GeometricBackground";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-background to-muted/40 animate-fade-in">
      <Helmet>
        <title>Página não encontrada — {location.pathname}</title>
        <meta name="description" content="Erro 404 - Página não encontrada" />
        <link rel="canonical" href="/404" />
      </Helmet>
      <GeometricBackground />
      <section className="text-center max-w-xl px-4">
        <h1 className="text-5xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-muted-foreground text-lg mb-6">Oops! Página não encontrada.</p>
        <Button asChild>
          <Link to="/">Voltar para a Home</Link>
        </Button>
      </section>
    </div>
  );
};

export default NotFound;

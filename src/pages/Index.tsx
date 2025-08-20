import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";
import { Building2, Home as HomeIcon, Handshake, TrendingUp, KeyRound } from "lucide-react";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";

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
    <div className="relative min-h-[calc(100vh-56px)] grid place-items-center overflow-hidden">
      {/* Background gradient + shapes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(1350px_750px_at_10%_10%,#1e40af_15%,transparent_60%),radial-gradient(1200px_700px_at_90%_20%,#6d28d9_10%,transparent_60%),radial-gradient(1000px_600px_at_50%_90%,#06b6d4_10%,transparent_60%)]"
      />
      <div aria-hidden className="absolute inset-0 -z-10 backdrop-blur-[2px]" />
      {/* Subtle blobs */}
      <div aria-hidden className="absolute -top-16 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

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
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/10 dark:bg-black/20 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10" aria-hidden="true" />

          <div className="relative grid items-center gap-10 p-8 md:grid-cols-[1.25fr,1fr] md:p-12">
            <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-background/70">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Soluções Imobiliárias
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                {settings.title} — Gestão de
                <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-300">Corretores</span>
              </h1>
              <p className="mt-4 text-muted-foreground/90 text-lg md:text-xl leading-relaxed">
                Organize <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 font-semibold">Vendas</span>, motive sua equipe com ranking gamificado e acompanhe KPIs em um dashboard moderno.
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
              <div className="mt-9 grid grid-cols-2 sm:grid-cols-5 gap-4 text-muted-foreground">
                {[{icon: Building2, label:'Imóveis'}, {icon: HomeIcon, label:'Casas'}, {icon: Handshake, label:'Equipe'}, {icon: TrendingUp, label:'Crescimento'}, {icon: KeyRound, label:'Chaves'}].map((it, i) => (
                  <motion.div
                    key={it.label}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/10 shadow-sm py-3"
                  >
                    <it.icon className="h-6 w-6 text-blue-300" aria-hidden="true" />
                    <span className="text-sm font-medium text-white/90">{it.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto">
              {settings.homeImage ? (
                // Prioriza imagem personalizada da Home vinda das Configurações
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative mx-auto w-[20rem] sm:w-[22rem] md:w-[24rem] aspect-[4/3] rounded-2xl border border-white/10 bg-white/10 dark:bg-black/20 shadow-2xl backdrop-blur-lg overflow-hidden"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/10 dark:to-black/20" aria-hidden />
                  <img
                    src={settings.homeImage}
                    alt="Ilustração principal"
                    className="w-full h-full object-contain opacity-75 mix-blend-lighten"
                    style={{
                      WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                      maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
                      filter: "saturate(1.05) contrast(1.05) brightness(1.05) drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
                      transform: "translateY(-2%)",
                    }}
                    loading="eager"
                    decoding="async"
                  />
                </motion.div>
              ) : settings.logoDataUrl ? (
                <div className="mx-auto h-40 w-40 sm:h-48 sm:w-48 rounded-full border bg-background/80 shadow-sm flex items-center justify-center">
                  <img
                    src={settings.logoDataUrl}
                    alt={`Logo ${settings.title}`}
                    className="max-h-28 max-w-28 sm:max-h-32 sm:max-w-32 object-contain"
                    loading="lazy"
                  />
                </div>
              ) : (
                // Tenta carregar imagem pública /hero.png; se não existir, cai no SVG ilustrativo
                <HeroImageFallback />
              )}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

// Componente auxiliar: tenta exibir /hero.png (em public/) com opacidade e blend; se falhar, mostra SVG ilustrativa
function HeroImageFallback() {
  const [hide, setHide] = useState(false);
  const heroSrc = `${import.meta.env.BASE_URL}hero.png`;
  if (hide) return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="relative mx-auto h-56 w-72 sm:h-64 sm:w-80 rounded-2xl border border-white/10 bg-white/10 dark:bg-black/20 shadow-2xl backdrop-blur-lg flex items-center justify-center overflow-hidden"
    >
      <svg width="100%" height="100%" viewBox="0 0 400 260" role="img" aria-label="Ilustração de laptop com gráficos">
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <rect x="70" y="40" rx="10" ry="10" width="260" height="150" fill="url(#grad)" opacity="0.15" />
        <rect x="85" y="55" rx="6" ry="6" width="230" height="120" fill="#0b1220" opacity="0.6" />
        <rect x="110" y="150" width="18" height="20" fill="#60a5fa" />
        <rect x="140" y="140" width="18" height="30" fill="#a78bfa" />
        <rect x="170" y="120" width="18" height="50" fill="#22d3ee" />
        <rect x="200" y="100" width="18" height="70" fill="#60a5fa" />
        <rect x="230" y="130" width="18" height="40" fill="#22d3ee" />
        <polyline points="110,150 140,140 170,120 200,100 230,130 260,115" fill="none" stroke="#86efac" strokeWidth="3" strokeLinejoin="round" />
        <rect x="60" y="190" width="280" height="18" rx="9" fill="url(#grad)" opacity="0.35" />
      </svg>
    </motion.div>
  );
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative mx-auto w-[20rem] sm:w-[22rem] md:w-[24rem] aspect-[4/3] rounded-2xl border border-white/10 bg-white/10 dark:bg-black/20 shadow-2xl backdrop-blur-lg overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10 dark:via-black/10 dark:to-black/20" aria-hidden />
      <img
        src={heroSrc}
        alt="Imagem principal"
        onError={() => setHide(true)}
        className="w-full h-full object-contain opacity-75 mix-blend-lighten"
        style={{
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,1) 72%, rgba(0,0,0,0) 100%)",
          filter: "saturate(1.05) contrast(1.05) brightness(1.05) drop-shadow(0 8px 20px rgba(0,0,0,0.25))",
          transform: "translateY(-2%)",
        }}
        loading="eager"
        decoding="async"
      />
    </motion.div>
  );
}

export default Index;

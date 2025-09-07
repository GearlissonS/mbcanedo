import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useSettings } from "@/context/SettingsContext";
import { Building2, Home as HomeIcon, Handshake, TrendingUp, KeyRound, LayoutDashboard, Settings, FileText } from "lucide-react";
import BackButton from "@/components/BackButton";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Building2, label: "Imóveis", to: "/properties" },
  { icon: Handshake, label: "Negociações", to: "/sales" },
  { icon: TrendingUp, label: "Ranking", to: "/ranking" },
  { icon: Settings, label: "Configurações", to: "/settings" },
  { icon: FileText, label: "Relatórios", to: "/reports" },
];

const shortcutIcons = [
  { icon: Building2, label: "Imóveis", to: "/properties" },
  { icon: HomeIcon, label: "Casas", to: "/houses" },
  { icon: Handshake, label: "Equipe", to: "/team" },
  { icon: TrendingUp, label: "Crescimento", to: "/growth" },
  { icon: KeyRound, label: "Chaves", to: "/keys" },
];

const Index = () => {
  const { settings } = useSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.title,
    url: typeof window !== "undefined" ? window.location.origin : "/",
  } as const;

  // Keyboard navigation for menu
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!menuRef.current) return;
      const items = Array.from(menuRef.current.querySelectorAll('a'));
      const active = document.activeElement;
      const idx = items.indexOf(active instanceof HTMLAnchorElement ? active : null);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        items[(idx + 1) % items.length]?.focus();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        items[(idx - 1 + items.length) % items.length]?.focus();
        e.preventDefault();
      }
    };
    menuRef.current?.addEventListener('keydown', handleKeyDown);
    return () => menuRef.current?.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] overflow-x-hidden">
      <Helmet>
        <title>{settings.title} — Gestão de Vendas Imobiliárias</title>
        <meta name="description" content={`${settings.title}: soluções modernas para gestão imobiliária.`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <BackButton />
      <section className="w-full max-w-3xl px-4 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full">
          <h1 className="text-5xl font-extrabold text-white text-center mb-2 tracking-tight">
            My Broker Senador Canedo
          </h1>
          <h2 className="text-2xl font-semibold text-blue-400 text-center mb-4">Gestão de Corretores</h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 text-center">
            Profissionalismo, confiança e modernidade para sua imobiliária. Organize vendas, equipe, ranking e KPIs em um dashboard inovador.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex flex-row gap-4 mb-8">
          <Button asChild size="lg" className="bg-blue-600 text-white shadow-lg hover:scale-105 transition-transform">
            <Link to="/sales">Cadastrar Vendas</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="hover:bg-blue-50 hover:text-blue-700">
            <Link to="/dashboard">Ver Dashboard</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="hover:bg-blue-50 hover:text-blue-700">
            <Link to="/ranking">Ver Ranking</Link>
          </Button>
        </motion.div>
        <nav ref={menuRef} tabIndex={0} className="w-full flex flex-wrap justify-center gap-4 mb-8 outline-none" aria-label="Menu principal">
          <AnimatePresence>
            {menuItems.slice(0,4).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.08 }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-blue-900/30 transition-all border border-blue-100 cursor-pointer focus:ring-2 focus:ring-blue-400"
              >
                <Link to={item.to} className="flex items-center gap-2 outline-none" tabIndex={0} aria-label={item.label}>
                  <item.icon className="h-6 w-6 text-blue-400" aria-hidden="true" />
                  <span className="text-base font-semibold text-white/90">{item.label}</span>
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: 0.5, delay: 0.32 }} className="relative">
              <div className="group">
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-blue-900/30 transition-all border border-blue-100 text-white/90 font-semibold cursor-pointer focus:ring-2 focus:ring-blue-400">
                  Mais
                </button>
                <div className="absolute left-0 mt-2 w-40 rounded-xl bg-white/90 shadow-lg border border-blue-100 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {menuItems.slice(4).map((item) => (
                    <Link key={item.label} to={item.to} className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-700 rounded-xl">
                      <item.icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </nav>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto w-[22rem] h-[16rem] rounded-2xl border border-blue-400/40 bg-white/30 backdrop-blur-md shadow-[0_0_16px_2px_#38bdf8] flex items-center justify-center overflow-hidden mb-8">
          {/* Aqui pode ir o gráfico animado ou imagem central */}
          {settings.logoDataUrl ? (
            <img src={settings.logoDataUrl} alt={`Logo ${settings.title}`} className="max-h-32 max-w-32 object-contain" loading="lazy" />
          ) : (
            <svg width="100" height="100" viewBox="0 0 100 100" aria-label="Logo fallback">
              <circle cx="50" cy="50" r="48" fill="url(#grad)" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </motion.div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-4 text-white/80">
          {shortcutIcons.map((it, i) => (
            <Link to={it.to} key={it.label} className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-blue-400/30 transition-all border border-white/10 shadow-sm py-3 cursor-pointer">
              <it.icon className="h-6 w-6 text-blue-300 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
              <span className="text-sm font-medium text-white/90">{it.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;

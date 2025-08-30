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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-200 overflow-x-hidden">
      <Helmet>
        <title>{settings.title} — Gestão de Vendas Imobiliárias</title>
        <meta name="description" content={`${settings.title}: soluções modernas para gestão imobiliária.`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <BackButton />
      <section className="w-full max-w-3xl px-4 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400"
        >
          {settings.title} <span className="font-light">Gestão Imobiliária</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-8 text-center"
        >
          Profissionalismo, confiança e modernidade para sua imobiliária. Organize vendas, equipe, ranking e KPIs em um dashboard inovador.
        </motion.p>
        <div ref={menuRef} tabIndex={0} className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8 outline-none" aria-label="Menu principal">
          <AnimatePresence>
            {menuItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px -8px #3b82f6" }}
                className="flex flex-col items-center justify-center rounded-2xl bg-white/80 shadow-lg hover:shadow-xl transition-all border border-blue-100 p-6 cursor-pointer focus:ring-2 focus:ring-blue-400"
              >
                <Link to={item.to} className="flex flex-col items-center gap-2 outline-none" tabIndex={0} aria-label={item.label}>
                  <item.icon className="h-8 w-8 text-blue-500 mb-2" aria-hidden="true" />
                  <span className="text-base font-semibold text-gray-900 dark:text-white">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {/* Imagem ou logo central */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto w-48 h-48 rounded-full border bg-gradient-to-br from-blue-100 via-white to-blue-200 shadow-xl flex items-center justify-center overflow-hidden"
        >
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
      </section>
    </div>
  );
};

export default Index;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const AppLayout = lazy(() => import("@/layouts/AppLayout").catch((e) => { console.error('[lazy] Failed to load layouts/AppLayout', e); throw e; }));
const MainLayout = lazy(() => import("./layouts/MainLayout").catch((e) => { console.error('[lazy] Failed to load layouts/MainLayout', e); throw e; }));
const Home = lazy(() => import("./pages/Home").catch((e) => { console.error('[lazy] Failed to load pages/Home', e); throw e; }));
const Index = lazy(() => import("./pages/Index").catch((e) => { console.error('[lazy] Failed to load pages/Index', e); throw e; }));
const NotFound = lazy(() => import("./pages/NotFound").catch((e) => { console.error('[lazy] Failed to load pages/NotFound', e); throw e; }));
const Sales = lazy(() => import("./pages/Sales").catch((e) => { console.error('[lazy] Failed to load pages/Sales', e); throw e; }));
const Ranking = lazy(() => import("./pages/Ranking").catch((e) => { console.error('[lazy] Failed to load pages/Ranking', e); throw e; }));
const Dashboard = lazy(() => import("./pages/Dashboard").catch((e) => { console.error('[lazy] Failed to load pages/Dashboard', e); throw e; }));
const Settings = lazy(() => import("./pages/Settings").catch((e) => { console.error('[lazy] Failed to load pages/Settings', e); throw e; }));
const RankingFull = lazy(() => import("./pages/RankingFull").catch((e) => { console.error('[lazy] Failed to load pages/RankingFull', e); throw e; }));
import { SettingsProvider } from "@/context/SettingsContext";
import { DataProvider } from "@/context/DataContext";
import { ThemeProvider } from "@/context/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider userId="demo-user">
        <SettingsProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Suspense fallback={<div className="flex justify-center items-center h-screen text-lg">Carregando...</div>}>
                  <InnerRoutes />
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </DataProvider>
        </SettingsProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;

function InnerRoutes() {
  const location = useLocation();
  const KanbanVendas = React.lazy(() => import("./pages/KanbanVendas/KanbanVendas").catch((e) => { console.error('[lazy] Failed to load pages/KanbanVendas/KanbanVendas', e); throw e; }));
  const MetasPage = React.lazy(() => import("./pages/MetasPage").catch((e) => { console.error('[lazy] Failed to load pages/MetasPage', e); throw e; }));
  // Página de corretores removida
  const Metas = React.lazy(() => import("./pages/Metas").catch((e) => { console.error('[lazy] Failed to load pages/Metas', e); throw e; }));
  const EquipeManager = React.lazy(() => import("./pages/EquipeManager").catch((e) => { console.error('[lazy] Failed to load pages/EquipeManager', e); throw e; }));
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35 }}
        className="min-h-screen"
      >
        <Routes location={location} key={location.pathname}>
          <Route element={<MainLayout />}> 
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/ranking/full" element={<RankingFull />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/kanban-vendas" element={<KanbanVendas />} />
            <Route path="/cadastro-metas" element={<Metas />} />
            {/* Página de corretores removida */}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

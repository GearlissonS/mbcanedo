import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const MainLayout = lazy(() => import("./layouts/MainLayout"));
const Home = lazy(() => import("./pages/Home"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Sales = lazy(() => import("./pages/Sales"));
const Ranking = lazy(() => import("./pages/Ranking"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));
const RankingFull = lazy(() => import("./pages/RankingFull"));
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
              <BrowserRouter 
                basename="/mbcanedo"
              >
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
  const KanbanVendas = React.lazy(() => import("./pages/KanbanVendas/KanbanVendas"));
  const MetasPage = React.lazy(() => import("./pages/MetasPage"));
  // Página de corretores removida
  const Metas = React.lazy(() => import("./pages/Metas"));
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
            <Route path="/" element={<Home />} />
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

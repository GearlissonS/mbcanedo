import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
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
              <BrowserRouter>
                <Suspense fallback={<div className="flex justify-center items-center h-screen text-lg">Carregando...</div>}>
                  <Routes>
                    <Route element={<AppLayout />}>
                      <Route path="/" element={<Index />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/ranking" element={<Ranking />} />
                      <Route path="/ranking/full" element={<RankingFull />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
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

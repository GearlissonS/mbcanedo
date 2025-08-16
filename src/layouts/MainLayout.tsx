import React from "react";
import { motion } from "framer-motion";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/context/SettingsContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menu = [
  { label: "Início", path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Ranking de Corretores", path: "/ranking" },
  { label: "Kanban de Vendas", path: "/kanban-vendas" },
  { label: "Cadastro de Metas", path: "/cadastro-metas" },
  { label: "Configurações", path: "/settings" },
];

export default function MainLayout() {
  const { settings } = useSettings();
  const location = useLocation();
  // Mock usuário logado
  const user = { name: "João Silva", avatar: `${import.meta.env.BASE_URL}placeholder.svg` };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050B2E] to-[#0A1B4D] flex flex-col">
      {/* Menu topo animado */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full px-6 py-3 flex items-center justify-between bg-[#08153A]/80 backdrop-blur border-b border-slate-800"
      >
        <div className="flex items-center gap-4">
          <motion.img
            src={settings.logoDataUrl || `${import.meta.env.BASE_URL}favicon.ico`}
            alt="Logo"
            className="h-8 w-8 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          />
          <motion.span
            className="font-extrabold text-xl text-white tracking-tight"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >{settings.title}</motion.span>
        </div>
        <nav className="flex gap-2 ml-8">
          {menu.map((item, idx) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.08, backgroundColor: "#1e293b", color: "#fff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                to={item.path}
                className={`px-4 py-2 rounded font-semibold text-sm transition ${location.pathname === item.path ? "bg-primary text-white" : "text-slate-200 hover:bg-primary/20"}`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Avatar className="h-9 w-9 ring-2 ring-primary/60">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-xs">{user.name?.split(" ").map(p=>p[0]).slice(0,2).join("") || "US"}</AvatarFallback>
          </Avatar>
          <span className="text-white font-medium text-sm">{user.name}</span>
        </motion.div>
      </motion.header>
      {/* Conteúdo */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}

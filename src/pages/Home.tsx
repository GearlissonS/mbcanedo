
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cloud, Building2, Users, BarChart3, LogIn, List } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import BackButton from "@/components/BackButton";
// import de fonte removido pois não está instalado

const cards = [
  {
    icon: Cloud,
    title: "Tecnologia",
    color: "from-purple-400 via-cyan-400 to-blue-400"
  },
  {
    icon: Building2,
    title: "Imóveis",
    color: "from-blue-400 via-cyan-400 to-purple-400"
  },
  {
    icon: Users,
    title: "Equipe",
    color: "from-cyan-400 via-purple-400 to-blue-400"
  },
  {
    icon: BarChart3,
    title: "Vendas",
    color: "from-blue-400 via-purple-400 to-cyan-400"
  },
];

export default function Home() {
  // ...existing code...
  const { settings } = useSettings();
  const bgImage = settings.homeImage;
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          background: bgImage
            ? `url(${bgImage}) center/cover no-repeat, linear-gradient(135deg, #0f172a 70%, #f8fafc 100%)`
            : "linear-gradient(135deg, #0f172a 70%, #f8fafc 100%)",
        }}
      >
        <BackButton />
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: bgImage
          ? `url(${bgImage}) center/cover no-repeat, linear-gradient(135deg, #0f172a 70%, #f8fafc 100%)`
          : "linear-gradient(135deg, #0f172a 70%, #f8fafc 100%)",
      }}
    >
      {/* Overlay para legibilidade */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{background: "linear-gradient(120deg, #0f172a88 60%, #f8fafc44 100%)", backdropFilter: "blur(8px)"}} />
      {/* Elementos decorativos animados tipo bokeh */}
      <motion.div className="absolute top-10 left-20 h-24 w-24 rounded-full bg-blue-500 opacity-20 blur-xl" animate={{ y: [0, 30, 0], x: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-20 right-32 h-16 w-16 rounded-full bg-cyan-400 opacity-25 blur-xl" animate={{ y: [0, -20, 0], x: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }} />
      <motion.div className="absolute top-1/2 left-1/4 h-12 w-12 rounded-full bg-white opacity-10 blur-xl" animate={{ y: [0, 10, 0], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} />

      <motion.div className="z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4 py-12">
        {/* Silhueta de casa e nome MY Broker */}
        <motion.div
          className="mb-8 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="10,60 70,20 130,60 120,60 70,30 20,60" fill="#fff" fillOpacity="0.7" />
            <rect x="25" y="60" width="90" height="30" rx="6" fill="#fff" fillOpacity="0.85" />
            <rect x="65" y="75" width="15" height="15" rx="2" fill="#888" fillOpacity="0.7" />
            <rect x="35" y="70" width="18" height="10" rx="2" fill="#888" fillOpacity="0.7" />
            <rect x="38" y="73" width="12" height="4" rx="1" fill="#fff" fillOpacity="0.7" />
            <rect x="87" y="70" width="18" height="10" rx="2" fill="#888" fillOpacity="0.7" />
            <rect x="90" y="73" width="12" height="4" rx="1" fill="#fff" fillOpacity="0.7" />
            <ellipse cx="70" cy="97" rx="38" ry="6" fill="#000" fillOpacity="0.10" />
          </svg>
          <span className="mt-2 text-base font-semibold text-white/90 tracking-wide drop-shadow">MY Broker</span>
        </motion.div>
        <motion.h1
          className="font-extrabold text-4xl md:text-6xl mb-4 tracking-tight bg-gradient-to-br from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent font-[Poppins,sans-serif]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          GESTÃO DE CORRETORES
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-slate-200 mb-8 max-w-xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Gestão de vendas, corretores, ranking e relatórios em tempo real.
        </motion.p>

        {/* Grid de cards minimalistas com ícones grandes */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mb-10 place-items-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}>
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="flex flex-col items-center justify-center gap-4 p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.7 + idx * 0.18 }}
                whileHover={{ scale: 1.12 }}
              >
                <motion.div
                  className="rounded-full border-2 border-white bg-transparent flex items-center justify-center"
                  style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.12)" }}
                  whileHover={{ borderColor: "#38bdf8" }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon size={72} className={`text-white drop-shadow-lg transition-colors duration-300`} />
                </motion.div>
                <div className="mt-2 text-base font-semibold text-white/90 tracking-wide text-center">
                  {card.title}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Botões com ícones */}
        <motion.div className="flex gap-4 justify-center" initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.2 }}>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button className="px-8 py-3 text-lg font-bold bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 text-white rounded-[1.5rem] shadow-lg shadow-cyan-400/30 hover:bg-gradient-to-br hover:from-blue-600 hover:via-cyan-600 hover:to-purple-600 transition flex items-center gap-2">
              <motion.span
                className="mr-2 flex"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <LogIn size={20} />
              </motion.span>
              Entrar
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <Button variant="outline" className="px-8 py-3 text-lg font-bold rounded-[1.5rem] border-2 border-primary text-primary hover:bg-primary hover:text-white transition flex items-center gap-2">
              <motion.span
                className="mr-2 flex"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                <List size={20} />
              </motion.span>
              Ver Funcionalidades
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

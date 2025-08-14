import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#050B2E] to-[#0A1B4D] relative overflow-hidden">
      {/* Elementos decorativos animados */}
      <motion.div
        className="absolute top-10 left-20 h-6 w-6 rounded-full bg-blue-500 opacity-30"
        animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-32 h-4 w-4 rounded-full bg-cyan-400 opacity-40"
        animate={{ y: [0, -20, 0], x: [0, -15, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 left-1/4 h-3 w-3 rounded-full bg-white opacity-20"
        animate={{ y: [0, 10, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      {/* Container central animado */}
      <motion.div
        className="z-10 max-w-xl w-full mx-auto flex flex-col items-center justify-center text-center px-4 py-12"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="font-extrabold text-4xl md:text-6xl text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Sistema Imobiliário Moderno
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl text-slate-200 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          Gestão de vendas, corretores, ranking e relatórios em tempo real. Interface responsiva, rápida e personalizável.
        </motion.p>
        {/* Espaço para mockup/imagem */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          whileHover={{ scale: 1.04, rotate: 2, boxShadow: "0 8px 32px #0A1B4D55" }}
        >
          <img src="/placeholder.svg" alt="Mockup" className="w-64 h-40 object-contain rounded-2xl shadow-lg" />
        </motion.div>
        {/* Botões */}
        <motion.div
          className="flex gap-4 justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Button className="px-8 py-3 text-lg font-bold bg-primary text-white rounded-full shadow-lg hover:bg-primary/80 transition">Entrar</Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.96 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
            <Button variant="outline" className="px-8 py-3 text-lg font-bold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white transition">Ver Funcionalidades</Button>
          </motion.div>
        </motion.div>
  </motion.div>
    </div>
  );
}

import React, { createContext, useContext, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export type MenuKey = "home" | "sales" | "ranking" | "dashboard" | "settings";

export interface Broker {
  id: string;
  name: string;
  team?: string | null;
  avatarDataUrl?: string | null;
  nickname: string;
  creci: string;
  vgv?: number;
  tempoMedioVenda?: number;
};

export interface Settings {
  title: string;
  primaryHex: string;
  accentHex: string;
  chartColors: string[];
  commissionRate: number; // %
  rankingSound: "none" | "ding" | "tada";
  rankingAnimation: boolean;
  rankingSoundFile?: string | null;
  rankingSoundEnabled?: boolean;
  origins: string[];
  styles: string[];
  products: string[];
  menuOrder: MenuKey[];
  logoDataUrl?: string | null;
  brokers?: Broker[];
  // Theme & background customization
  backgroundStyle: "geometric" | "none";
  backgroundIntensity: number; // 0-100
  showThemedIcons: boolean;
  // ... outros campos
}

interface SettingsContextType {
  settings: Settings;
  setSettings: (s: Settings) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  playRankingSound: () => void;
  applyTheme: () => void;
}

const defaultSettings: Settings = {
  title: "My Broker Senador Canedo",
  primaryHex: "#0f172a", // navy
  accentHex: "#0ea5e9",
  chartColors: ["#0f172a", "#0ea5e9", "#1e293b", "#38bdf8", "#60a5fa"],
  commissionRate: 5,
  rankingSound: "ding",
  rankingAnimation: true,
  origins: ["Orgânico", "Indicação", "Mídia Paga"],
  styles: ["Casa", "Apartamento", "Cobertura"],
  products: ["Lançamento", "Revenda"],
  menuOrder: ["home", "sales", "ranking", "dashboard", "settings"],
  logoDataUrl: null,
  brokers: [
  { id: "1", name: "Ana Souza", nickname: "Ana", creci: "12345F", team: "Time A", avatarDataUrl: null },
  { id: "2", name: "Bruno Lima", nickname: "Bruno", creci: "23456F", team: "Time A", avatarDataUrl: null },
  { id: "3", name: "Carla Mendes", nickname: "Carla", creci: "34567F", team: "Time B", avatarDataUrl: null },
  { id: "4", name: "Diego Rocha", nickname: "Diego", creci: "45678F", team: "Time B", avatarDataUrl: null },
  { id: "5", name: "Eduarda Pires", nickname: "Eduarda", creci: "56789F", team: "Time C", avatarDataUrl: null },
  ],
  backgroundStyle: "geometric",
  backgroundIntensity: 40,
  showThemedIcons: true,
  rankingSoundFile: null,
  rankingSoundEnabled: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function hexToHsl(hex: string): string {
  let r = 0, g = 0, b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>("mb:settings", defaultSettings);

const applyTheme = () => {
  const root = document.documentElement;
  // Light theme (white + blue) by default
  root.classList.remove("dark");
  root.style.setProperty("--primary", hexToHsl(settings.primaryHex));
  root.style.setProperty("--accent", hexToHsl(settings.accentHex));
};

  useEffect(() => {
    applyTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.primaryHex, settings.accentHex]);

  const updateSettings = (patch: Partial<Settings>) => setSettings({ ...settings, ...patch });

  const playRankingSound = () => {
    if (settings.rankingSound === "none" || typeof window === "undefined") return;
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    try {
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      const base = settings.rankingSound === "ding" ? 880 : 523.25; // A5 or C5
      o.frequency.value = base;
      o.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      o.start();
      o.stop(ctx.currentTime + 0.26);
      setTimeout(() => ctx.close(), 400);
    } catch {}
  };

  const value: SettingsContextType = { settings, setSettings, updateSettings, playRankingSound, applyTheme };
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

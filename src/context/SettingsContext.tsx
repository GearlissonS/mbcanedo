import React, { useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SettingsContext as CoreSettingsContext, type Settings } from "./settings-core";
// Re-export core types and hook so older imports keep working
export type { MenuKey, Broker } from "./settings-core";
export { useSettings } from "./settings-core";

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
  let h = 0, s = 0;
  const l = (max + min) / 2;
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
  // Read and persist settings locally
  // Keep the full implementation in this file but use the core context from settings-core
  const defaultSettings: Settings = {
    title: "My Broker Senador Canedo",
    primaryHex: "#0f172a",
    accentHex: "#0ea5e9",
    chartColors: ["#0f172a", "#0ea5e9", "#1e293b", "#38bdf8", "#60a5fa"],
    commissionRate: 5,
    rankingSound: "ding",
    rankingAnimation: true,
    rankingSoundFile: null,
    rankingSoundEnabled: true,
    origins: ["Orgânico", "Indicação", "Mídia Paga"],
    styles: ["Casa", "Apartamento", "Cobertura"],
    products: ["Lançamento", "Revenda"],
    menuOrder: ["home", "sales", "ranking", "dashboard", "settings"],
    logoDataUrl: null,
    brokers: [],
    backgroundStyle: "geometric",
    backgroundIntensity: 40,
    showThemedIcons: true,
    homeDescription: undefined,
    homeImage: undefined,
    theme: "light",
  };

  const [settings, setSettings] = useLocalStorage<Settings>("mb:settings", defaultSettings);

  useEffect(() => {
    // apply theme when settings change
    const root = document.documentElement;
    if (settings?.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings]);

  const applyTheme = () => {
    if (!settings) return;
    const root = document.documentElement;
    root.style.setProperty("--primary", settings.primaryHex || "#0f172a");
    root.style.setProperty("--accent", settings.accentHex || "#0ea5e9");
  };

  const playRankingSound = () => {
    // lightweight sound function kept local
    try {
      if (settings?.rankingSound === "none") return;
      const maybeAudio = (window as unknown) as {
        AudioContext?: typeof AudioContext
        webkitAudioContext?: typeof AudioContext
      }
      const AudioCtor = maybeAudio.AudioContext ?? maybeAudio.webkitAudioContext
      if (!AudioCtor) return;
      const ctx = new AudioCtor()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = "sine"
      const base = settings?.rankingSound === "ding" ? 880 : 523.25
      o.frequency.value = base
      o.connect(g)
      g.connect(ctx.destination)
      g.gain.setValueAtTime(0.001, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      o.start()
      o.stop(ctx.currentTime + 0.26)
      setTimeout(() => ctx.close(), 400)
    } catch (err) {
      console.debug("ranking sound failed", err)
    }
  };

  const value = {
    settings,
    setSettings: (s: Settings) => setSettings(s),
    updateSettings: (patch: Partial<Settings>) => setSettings({ ...(settings || defaultSettings), ...patch }),
    playRankingSound,
    applyTheme,
  };

  return <CoreSettingsContext.Provider value={value}>{children}</CoreSettingsContext.Provider>;
};

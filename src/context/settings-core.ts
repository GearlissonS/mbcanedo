import React, { createContext, useContext } from "react";

export type MenuKey = "home" | "sales" | "ranking" | "dashboard" | "settings";

export interface Broker {
  id: string;
  name: string;
  team?: string | null;
  avatarDataUrl?: string | null;
  nickname: string;
  creci: string;
  vgv?: number;
  tempoMedio?: number;
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
  backgroundStyle: "geometric" | "none";
  backgroundIntensity: number; // 0-100
  showThemedIcons: boolean;
  homeDescription?: string;
  homeImage?: string;
  theme?: "light" | "dark";
}

export interface SettingsContextType {
  settings: Settings;
  setSettings: (s: Settings) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  playRankingSound: () => void;
  applyTheme: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
};

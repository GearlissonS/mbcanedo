import React, { createContext, useContext } from "react";

export type Theme = "light" | "dark";
export type Palette = { primary: string; secondary: string };

export type ThemeContextType = {
  theme: Theme;
  palette: Palette;
  setTheme: (t: Theme) => void;
  setPalette: (p: Palette) => void;
  savePreferences: () => Promise<void>;
  loadPreferences: () => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

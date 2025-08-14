import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Theme = "light" | "dark";
type Palette = {
  primary: string;
  secondary: string;
};

type ThemeContextType = {
  theme: Theme;
  palette: Palette;
  setTheme: (t: Theme) => void;
  setPalette: (p: Palette) => void;
  savePreferences: () => Promise<void>;
  loadPreferences: () => Promise<void>;
};

const defaultPalette: Palette = {
  primary: "#2563eb", // azul
  secondary: "#f59e42", // laranja
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [palette, setPalette] = useState<Palette>(defaultPalette);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.setProperty("--color-primary", palette.primary);
    document.documentElement.style.setProperty("--color-secondary", palette.secondary);
  }, [theme, palette]);

  const savePreferences = async () => {
    await supabase.from("user_preferences").upsert({
      user_id: userId,
      theme,
      primary: palette.primary,
      secondary: palette.secondary,
    });
  };

  const loadPreferences = async () => {
    const { data } = await supabase.from("user_preferences").select("theme,primary,secondary").eq("user_id", userId).single();
    if (data) {
      setTheme(data.theme as Theme);
      setPalette({ primary: data.primary, secondary: data.secondary });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, palette, setTheme, setPalette, savePreferences, loadPreferences }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

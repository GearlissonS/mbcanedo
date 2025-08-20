import React, { useState, useEffect } from "react";
import { safeSelect, safeInsert } from "@/lib/safeSupabaseClient";
import { ThemeContext as CoreThemeContext } from "./theme-core";
export { useTheme } from "./theme-core";

const defaultPalette = {
  primary: "#2563eb",
  secondary: "#f59e42",
};

export const ThemeProvider: React.FC<{ userId: string; children: React.ReactNode }> = ({ userId, children }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [palette, setPalette] = useState(defaultPalette);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.setProperty("--color-primary", palette.primary);
    document.documentElement.style.setProperty("--color-secondary", palette.secondary);
  }, [theme, palette]);

  const savePreferences = async () => {
    try {
      await safeInsert("user_preferences", {
        user_id: userId,
        theme,
        primary: palette.primary,
        secondary: palette.secondary,
      });
    } catch (e) {
      console.warn("[ThemeContext] Falha ao salvar preferências.", e);
    }
  };

  const loadPreferences = async () => {
    try {
      const prefs = await safeSelect("user_preferences", { select: "theme,primary,secondary" });
      const data = Array.isArray(prefs) ? prefs.find((p: any) => p.user_id === userId) : null;
      if (data) {
        setTheme(data.theme as "light" | "dark");
        setPalette({ primary: data.primary, secondary: data.secondary });
      }
    } catch (e) {
      console.warn("[ThemeContext] Falha ao carregar preferências, usando padrão.", e);
    }
  };

  return (
    <CoreThemeContext.Provider value={{ theme, palette, setTheme, setPalette, savePreferences, loadPreferences }}>
      {children}
    </CoreThemeContext.Provider>
  );
};

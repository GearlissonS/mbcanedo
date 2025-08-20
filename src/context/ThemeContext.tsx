import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
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
      setTheme(data.theme as "light" | "dark");
      setPalette({ primary: data.primary, secondary: data.secondary });
    }
  };

  return (
    <CoreThemeContext.Provider value={{ theme, palette, setTheme, setPalette, savePreferences, loadPreferences }}>
      {children}
    </CoreThemeContext.Provider>
  );
};

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (err) {
      // If parsing fails, fallback to initial value
  console.debug('useLocalStorage JSON parse failed', err);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // ignore storage write errors (quota, incognito, etc.)
  console.debug('useLocalStorage setItem failed', err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

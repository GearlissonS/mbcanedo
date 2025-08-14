import React from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSettings } from "@/context/SettingsContext";
import { showSuccess, showError } from "@/components/NotificationToast";
import { DataContext as CoreDataContext } from "./data-core";
import type { Sale, Status } from "./types";

interface DataContextType {
  sales: Sale[];
  addSale: (s: Sale) => void;
  updateSale: (id: string, patch: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  setSales: (arr: Sale[]) => void;
  recalcVgc: (vgv: number) => number;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sales, setSales] = useLocalStorage<Sale[]>("mb:sales", []);
  const { settings } = useSettings();

  const addSale = (s: Sale) => {
    setSales([s, ...sales]);
    showSuccess('Venda adicionada', 'A venda foi registrada com sucesso!');
  };
  
  const updateSale = (id: string, patch: Partial<Sale>) => {
    setSales(sales.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    showSuccess('Venda atualizada', 'As informações foram atualizadas com sucesso!');
  };
  
  const deleteSale = (id: string) => {
    setSales(sales.filter((s) => s.id !== id));
    showSuccess('Venda removida', 'A venda foi removida com sucesso!');
  };
  
  const recalcVgc = (vgv: number) => Number(((vgv * settings.commissionRate) / 100).toFixed(2));

  const value: DataContextType = { sales, addSale, updateSale, deleteSale, setSales, recalcVgc };
  return <CoreDataContext.Provider value={value}>{children}</CoreDataContext.Provider>;
};
 

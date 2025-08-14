import React, { createContext, useContext } from "react";
import type { Sale } from "./types";

interface DataContextType {
  sales: Sale[];
  addSale: (s: Sale) => void;
  updateSale: (id: string, patch: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  setSales: (arr: Sale[]) => void;
  recalcVgc: (vgv: number) => number;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

import { useMemo } from 'react';
import type { Sale } from '../context/types';

interface ChartDataHookProps {
  sales: Sale[];
  period: 'mensal' | 'anual' | 'custom';
  startDate?: string;
  endDate?: string;
  seller?: string;
}

export function useChartData({ sales, period, startDate, endDate, seller }: ChartDataHookProps) {
  const filteredSales = useMemo(() => {
    const now = new Date();
    let start: Date | null = null, end: Date | null = null;
    
    if (period === "mensal") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === "anual") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    }

    return sales.filter((sale) => {
      const saleDate = new Date(sale.dataCompetencia);
      const inRange = start && end ? saleDate >= start && saleDate <= end : true;
      const sellerMatch = seller && seller !== 'all' ? sale.vendedor === seller : true;
      return inRange && sellerMatch;
    });
  }, [sales, period, startDate, endDate, seller]);

  const monthlyData = useMemo(() => {
    const monthMap: Record<string, { vgv: number; vgc: number }> = {};
    
    filteredSales.forEach((sale) => {
      const date = new Date(sale.dataCompetencia);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { vgv: 0, vgc: 0 };
      }
      
      monthMap[monthKey].vgv += sale.vgv;
      monthMap[monthKey].vgc += sale.vgc;
    });

    return Object.entries(monthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        mes: month,
        VGV: Number(data.vgv.toFixed(2)),
        VGC: Number(data.vgc.toFixed(2))
      }));
  }, [filteredSales]);

  const rankingData = useMemo(() => {
    const sellerMap = new Map<string, number>();
    
    filteredSales.forEach((sale) => {
      const vendedor = sale.vendedor ?? '';
      const current = sellerMap.get(vendedor) || 0;
      sellerMap.set(vendedor, current + sale.vgv);
    });

    return Array.from(sellerMap.entries())
      .map(([vendedor, vgv]) => ({ vendedor, VGV: vgv }))
      .sort((a, b) => b.VGV - a.VGV)
      .slice(0, 10);
  }, [filteredSales]);

  const typeData = useMemo(() => {
    const typeMap = new Map<string, number>();
    
    filteredSales.forEach((sale) => {
      const tipo = sale.tipo ?? '';
      const current = typeMap.get(tipo) || 0;
      typeMap.set(tipo, current + sale.vgv);
    });

    return Array.from(typeMap.entries())
      .map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const originData = useMemo(() => {
    const originMap = new Map<string, number>();
    
    filteredSales.forEach((sale) => {
      const origem = sale.origem ?? '';
      const current = originMap.get(origem) || 0;
      originMap.set(origem, current + sale.vgv);
    });

    return Array.from(originMap.entries())
      .map(([name, value]) => ({ name, value }));
  }, [filteredSales]);

  const kpis = useMemo(() => {
    const totalVgv = filteredSales.reduce((acc, sale) => acc + sale.vgv, 0);
    const totalVgc = filteredSales.reduce((acc, sale) => acc + sale.vgc, 0);
    const totalSales = filteredSales.length;
    const approvedSales = filteredSales.filter(sale => sale.status === "Aprovada").length;
    const conversionRate = totalSales > 0 ? (approvedSales / totalSales) * 100 : 0;

    return {
      totalVgv,
      totalVgc,
      totalSales,
      conversionRate,
      approvedSales
    };
  }, [filteredSales]);

  return {
    filteredSales,
    monthlyData,
    rankingData,
    typeData,
    originData,
    kpis
  };
}


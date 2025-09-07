import React, { useEffect, useState } from 'react';
import { getSales } from '../services/salesService';
import { getAgents } from '../services/agentsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { Venda } from '../types/core';
import type { Agente } from '../types/core';

interface MonthlyData {
  month: string;
  total: number;
}

export default function SalesDashboard() {
  const [sales, setSales] = useState<Venda[]>([]);
  const [agents, setAgents] = useState<Agente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getSales(), getAgents()])
      .then(([salesData, agentsData]) => {
        setSales(salesData);
        setAgents(agentsData);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Total de vendas
  const totalVendas = sales.length;
  // VGV
  const vgv = sales.reduce((sum, s) => sum + s.valor, 0);
  // Ranking top 3 corretores
  const ranking = agents
    .map(agent => ({
      ...agent,
      vendas: sales.filter(s => s.agente_id === agent.id).length,
      vgv: sales.filter(s => s.agente_id === agent.id).reduce((sum, s) => sum + s.valor, 0)
    }))
    .sort((a, b) => b.vgv - a.vgv)
    .slice(0, 3);

  // Gráfico de vendas mensais
  const monthlyData: MonthlyData[] = [];
  sales.forEach(sale => {
    const month = new Date(sale.created_at).toLocaleString('pt-BR', { month: 'short', year: '2-digit' });
    const found = monthlyData.find(m => m.month === month);
    if (found) found.total += sale.valor;
    else monthlyData.push({ month, total: sale.valor });
  });

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Dashboard de Vendas</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-sm text-gray-500">Total de Vendas</div>
              <div className="text-2xl font-bold">{totalVendas}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-sm text-gray-500">VGV</div>
              <div className="text-2xl font-bold">R$ {vgv.toLocaleString('pt-BR')}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <div className="text-sm text-gray-500">Top 3 Corretores</div>
              <ul className="text-lg">
                {ranking.map(agent => (
                  <li key={agent.id}>
                    {agent.nome} ({agent.vendas} vendas, R$ {agent.vgv.toLocaleString('pt-BR')})
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold mb-2">Vendas Mensais</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

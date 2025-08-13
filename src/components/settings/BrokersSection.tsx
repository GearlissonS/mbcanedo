// Função para buscar vendas do Supabase (exemplo, não chamada ainda)
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchSalesFromSupabase(brokerId: string, period: 'mensal'|'anual') {
  const now = new Date();
  let fromDate: Date;
  if (period === 'mensal') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    fromDate = new Date(now.getFullYear(), 0, 1);
  }
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('brokerId', brokerId)
    .gte('soldAt', fromDate.toISOString());
  if (error || !data) return [];
  return data.map((s: any) => ({
    brokerId: s.brokerId,
    value: s.value,
    soldAt: new Date(s.soldAt),
    listedAt: new Date(s.listedAt),
  }));
}

// Para usar: substitua mockSales por resultado de fetchSalesFromSupabase(b.id, period) e trate loading/erro.
import { useState } from "react";
import { Info } from "lucide-react";
import { Broker } from "../../context/SettingsContext";
// Mock de vendas
const mockSales = [
  { brokerId: "1", value: 300000, soldAt: new Date("2025-08-01"), listedAt: new Date("2025-07-01") },
  { brokerId: "1", value: 250000, soldAt: new Date("2025-07-15"), listedAt: new Date("2025-06-10") },
  { brokerId: "2", value: 400000, soldAt: new Date("2025-08-10"), listedAt: new Date("2025-07-20") },
  { brokerId: "3", value: 150000, soldAt: new Date("2025-07-05"), listedAt: new Date("2025-06-01") },
  { brokerId: "3", value: 200000, soldAt: new Date("2025-08-12"), listedAt: new Date("2025-07-10") },
  { brokerId: "4", value: 500000, soldAt: new Date("2025-08-02"), listedAt: new Date("2025-07-01") },
  { brokerId: "5", value: 350000, soldAt: new Date("2025-07-25"), listedAt: new Date("2025-07-01") },
];
import { useSettings } from "@/context/SettingsContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BrokersSection() {
  const { settings, updateSettings } = useSettings();
  const [newName, setNewName] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [newCRECI, setNewCRECI] = useState("");
  const [newTeam, setNewTeam] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [period, setPeriod] = useState<'mensal'|'anual'>('mensal');
  const addBroker = () => {
    if (!newName.trim() || !newNickname.trim() || !newCRECI.trim()) return;
    const finalize = (avatarDataUrl?: string) => {
      const next = [...(settings.brokers || [])];
      next.push({
        id: crypto.randomUUID(),
        name: newName.trim(),
        nickname: newNickname.trim(),
        creci: newCRECI.trim(),
        team: newTeam.trim(),
        avatarDataUrl,
      });
      updateSettings({ brokers: next });
      setNewName("");
      setNewNickname("");
      setNewCRECI("");
      setNewTeam("");
      setNewFile(null);
    };
    if (newFile) {
      const reader = new FileReader();
      reader.onload = () => finalize(String(reader.result));
      reader.readAsDataURL(newFile);
    } else {
      finalize();
    }
  };

  const updateName = (id: string, name: string) => {
    const next = (settings.brokers || []).map((b) => (b.id === id ? { ...b, name } : b));
    updateSettings({ brokers: next });
  };

  const updateTeam = (id: string, team: string) => {
    const next = (settings.brokers || []).map((b) => (b.id === id ? { ...b, team } : b));
    updateSettings({ brokers: next });
  };
  const updateAvatar = (id: string, file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const next = (settings.brokers || []).map((b) => (b.id === id ? { ...b, avatarDataUrl: String(reader.result) } : b));
      updateSettings({ brokers: next });
    };
    reader.readAsDataURL(file);
  };

  const removeBroker = (id: string) => {
    const next = (settings.brokers || []).filter((b) => b.id !== id);
    updateSettings({ brokers: next });
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h2 className="font-semibold mb-3">Corretores</h2>

      {/* Add */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4">
        <div className="md:col-span-1">
          <Label>Nome completo</Label>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex.: Ana Souza" required />
        </div>
        <div className="md:col-span-1">
          <Label>Apelido</Label>
          <Input value={newNickname} onChange={(e) => setNewNickname(e.target.value)} placeholder="Ex.: Ana" required />
        </div>
        <div className="md:col-span-1">
          <Label>CRECI</Label>
          <Input value={newCRECI} onChange={(e) => setNewCRECI(e.target.value)} placeholder="Ex.: 12345F" required />
        </div>
        <div className="md:col-span-1">
          <Label>Equipe</Label>
          <Input value={newTeam} onChange={(e) => setNewTeam(e.target.value)} placeholder="Ex.: Time A" />
        </div>
        <div className="md:col-span-1">
          <Label>Avatar</Label>
          <Input type="file" accept="image/*" onChange={(e) => setNewFile(e.target.files?.[0] || null)} />
        </div>
        <div className="md:col-span-1 flex items-end">
          <Button onClick={addBroker} className="w-full">Adicionar</Button>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <Label>Filtro VGV:</Label>
        <Button variant={period === 'mensal' ? 'default' : 'outline'} onClick={() => setPeriod('mensal')}>Mensal</Button>
        <Button variant={period === 'anual' ? 'default' : 'outline'} onClick={() => setPeriod('anual')}>Anual</Button>
      </div>

      {/* List */}
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(settings.brokers || []).length === 0 && (
          <li className="text-sm text-muted-foreground">Nenhum corretor cadastrado ainda.</li>
        )}
        {(settings.brokers || []).map((b: Broker) => {
          // Filtrar vendas do corretor
          const sales = mockSales.filter(s => s.brokerId === b.id);
          // Filtro de período
          const now = new Date();
          let filteredSales = sales;
          if (period === 'mensal') {
            filteredSales = sales.filter(s => s.soldAt.getMonth() === now.getMonth() && s.soldAt.getFullYear() === now.getFullYear());
          } else if (period === 'anual') {
            filteredSales = sales.filter(s => s.soldAt.getFullYear() === now.getFullYear());
          }
          // Calcular VGV
          const vgv = filteredSales.reduce((acc, s) => acc + s.value, 0);
          // Calcular tempo médio de venda
          const tempos = filteredSales.map(s => (s.soldAt.getTime() - s.listedAt.getTime()) / (1000 * 60 * 60 * 24));
          const tempoMedio = tempos.length > 0 ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length) : 0;
          return (
            <li key={b.id} className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl border shadow-sm bg-white/80 hover:shadow-lg transition">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src={b.avatarDataUrl || `https://i.pravatar.cc/64?u=${encodeURIComponent(b.name || b.id)}`}
                  alt={`Avatar de ${b.name}`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                  loading="lazy"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{b.name}</span>
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded">{b.nickname}</span>
                  </div>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>CRECI: {b.creci}</span>
                    <span>Equipe: {b.team}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">VGV ({period}) <Info size={14} aria-label="Volume Geral de Vendas no período selecionado" /></span>
                  <span className="font-bold text-green-700 text-lg">{vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">Tempo médio <Info size={14} aria-label="Tempo médio de venda dos imóveis (dias)" /></span>
                  <span className="font-bold text-blue-700 text-lg">{tempoMedio} dias</span>
                </div>
                <div className="flex flex-col items-center">
                  <Label className="text-xs">Alterar avatar</Label>
                  <Input type="file" accept="image/*" onChange={(e) => updateAvatar(b.id, e.target.files?.[0])} />
                  <Button variant="destructive" size="sm" onClick={() => removeBroker(b.id)}>Remover</Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

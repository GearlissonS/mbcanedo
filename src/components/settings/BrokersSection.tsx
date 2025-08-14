// Função para buscar vendas do Supabase (exemplo, não chamada ainda)
import { supabase } from '@/context/supabaseClient';

interface SupabaseSale { brokerId: string; value: number; soldAt: string; listedAt: string }

async function fetchSalesFromSupabase(brokerId: string, period: 'mensal'|'anual') {
  const now = new Date();
  let fromDate: Date;
  if (period === 'mensal') {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    fromDate = new Date(now.getFullYear(), 0, 1);
  }
  const { data, error } = await supabase
  .from('vendas')
    .select('*')
    .eq('brokerId', brokerId)
    .gte('soldAt', fromDate.toISOString());
  if (error || !data) return [];
  return (data as SupabaseSale[]).map((s) => ({
    brokerId: s.brokerId,
    value: s.value,
    soldAt: new Date(s.soldAt),
    listedAt: new Date(s.listedAt),
  }));
}

// Para usar: substitua mockSales por resultado de fetchSalesFromSupabase(b.id, period) e trate loading/erro.
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
// Schema de validação
const brokerSchema = z.object({
  name: z.string().min(3, "Nome obrigatório"),
  nickname: z.string().min(2, "Apelido obrigatório"),
  creci: z.string().min(3, "CRECI obrigatório"),
  team: z.string().min(1, "Equipe obrigatória"),
  vgv: z.number().min(0),
  tempoMedio: z.number().min(0),
  avatar: z.any().optional(),
});

type BrokerForm = z.infer<typeof brokerSchema>;
import { motion } from "framer-motion";
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
  // Função para navegação/edição do corretor
  const handleEditBroker = (id: string) => {
    // Exemplo: navegação para página de edição
    // window.location.href = `/corretores/editar/${id}`;
    // Ou use navegação do React Router/Next.js
    alert(`Editar corretor: ${id}`);
  };
  const { settings, updateSettings } = useSettings();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BrokerForm>({
    resolver: zodResolver(brokerSchema),
    defaultValues: { name: "", nickname: "", creci: "", team: "", vgv: 0, tempoMedio: 0, avatar: undefined },
  });
  const avatarFile = watch("avatar");
  const avatarPreview = useRef<string | null>(null);
  if (avatarFile && avatarFile[0] && !avatarPreview.current) {
    const file = avatarFile[0];
    if (file && ["image/jpeg","image/png","image/webp"].includes(file.type) && file.size <= 2*1024*1024) {
      const reader = new FileReader();
      reader.onload = (e) => { avatarPreview.current = String(e.target?.result); };
      reader.readAsDataURL(file);
    }
  }
  const [period, setPeriod] = useState<'mensal'|'anual'>('mensal');

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

      {/* Cadastro de corretor */}
      <motion.form
        className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        onSubmit={handleSubmit(async (data) => {
        // Compressão/redimensionamento
        let avatarDataUrl = null;
        if (data.avatar && data.avatar[0]) {
          const file = data.avatar[0];
          const img = document.createElement('img');
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = String(e.target?.result);
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = 512;
              canvas.height = 512;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, 512, 512);
                avatarDataUrl = canvas.toDataURL('image/webp', 0.8);
                finalize();
              }
            };
          };
          reader.readAsDataURL(file);
        } else {
          finalize();
        }
        function finalize() {
          const next = [...(settings.brokers || [])];
          next.push({
            id: crypto.randomUUID(),
            name: data.name,
            nickname: data.nickname,
            creci: data.creci,
            team: data.team,
            vgv: data.vgv,
            tempoMedio: data.tempoMedio,
            avatarDataUrl,
          });
          updateSettings({ brokers: next });
          reset();
        }
      })}>
        <div className="md:col-span-1">
          <Label>Nome completo</Label>
          <Input {...register("name")} placeholder="Ex.: Ana Souza" />
          {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
        </div>
        <div className="md:col-span-1">
          <Label>Apelido</Label>
          <Input {...register("nickname")} placeholder="Ex.: Ana" />
          {errors.nickname && <span className="text-xs text-red-500">{errors.nickname.message}</span>}
        </div>
        <div className="md:col-span-1">
          <Label>CRECI</Label>
          <Input {...register("creci")} placeholder="Ex.: 12345F" />
          {errors.creci && <span className="text-xs text-red-500">{errors.creci.message}</span>}
        </div>
        <div className="md:col-span-1">
          <Label>Equipe</Label>
          <select {...register("team")} className="w-full border rounded px-2 py-1">
            <option value="">Selecione</option>
            <option value="Time A">Time A</option>
            <option value="Time B">Time B</option>
            <option value="Time C">Time C</option>
          </select>
          {errors.team && <span className="text-xs text-red-500">{errors.team.message}</span>}
        </div>
        <div className="md:col-span-1">
          <Label>VGV mensal</Label>
          <Input type="number" {...register("vgv", { valueAsNumber: true })} min={0} placeholder="Ex.: 100000" />
        </div>
        <div className="md:col-span-1">
          <Label>Tempo médio (dias)</Label>
          <Input type="number" {...register("tempoMedio", { valueAsNumber: true })} min={0} placeholder="Ex.: 30" />
        </div>
        <div className="md:col-span-1">
          <Label>Foto (jpg, png, webp, até 2MB)</Label>
          <Input type="file" accept="image/jpeg,image/png,image/webp" {...register("avatar")} />
          {avatarFile && avatarFile[0] && avatarPreview.current && (
            <div className="mt-2 flex justify-center">
              <img src={avatarPreview.current} alt="Preview" className="h-16 w-16 rounded-full object-cover border-2 border-primary" />
            </div>
          )}
        </div>
        <div className="md:col-span-1 flex items-end">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }} className="w-full">
            <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Adicionar"}</Button>
          </motion.div>
        </div>
      </motion.form>
      <div className="flex gap-3 mb-4 items-center">
        <Label>Filtro VGV:</Label>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant={period === 'mensal' ? 'default' : 'outline'} onClick={() => setPeriod('mensal')}>Mensal</Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button variant={period === 'anual' ? 'default' : 'outline'} onClick={() => setPeriod('anual')}>Anual</Button>
        </motion.div>
      </div>

      {/* List */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, idx) => (
            <li key={idx} className="flex flex-col md:flex-row items-stretch justify-between gap-6 p-4 rounded-2xl border shadow bg-white dark:bg-slate-900/80 animate-pulse">
              <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-zinc-800" />
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
                  <div className="h-4 w-20 bg-gray-200 dark:bg-zinc-800 rounded mb-1" />
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-center w-full md:w-auto mt-4 md:mt-0">
                <div className="flex flex-row gap-6 w-full md:w-auto justify-between">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
                  <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
                </div>
                <div className="flex flex-col items-center w-full md:w-auto mt-4 md:mt-0">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
                  <div className="h-8 w-24 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
                </div>
              </div>
            </li>
          ))
        ) : (settings.brokers || []).length === 0 ? (
          <li className="text-sm text-muted-foreground">Nenhum corretor cadastrado ainda.</li>
        ) : (
          (settings.brokers || []).map((b: Broker) => {
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
              <motion.li
                key={b.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                transition={{ duration: 0.4, type: 'spring' }}
                className="flex flex-col md:flex-row items-stretch justify-between gap-6 p-4 rounded-2xl border shadow bg-white dark:bg-slate-900/80 transition w-full"
              >
                <div className="flex items-center gap-4 w-full md:w-auto min-w-0">
                  {b.avatarDataUrl ? (
                    <img
                      src={b.avatarDataUrl}
                      alt={`Avatar de ${b.name}`}
                      className="h-16 w-16 rounded-full object-cover border-2 border-primary"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary text-white font-bold text-xl border-2 border-primary">
                      {b.name ? b.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : <svg className="h-8 w-8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>}
                    </div>
                  )}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="font-bold text-lg md:text-xl truncate">{b.name}</span>
                    <span className="text-xs text-muted-foreground">Apelido: {b.nickname}</span>
                    <span className="text-xs text-muted-foreground">CRECI: {b.creci}</span>
                    <span className="text-xs text-muted-foreground">Equipe: {b.team}</span>
                  </div>
                </div>
                <div className="flex flex-row gap-6 items-center w-full md:w-auto mt-4 md:mt-0 justify-between">
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">VGV ({period})</span>
                    <span className="font-bold text-green-700 text-base md:text-lg">{vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground">Tempo médio</span>
                    <span className="font-bold text-blue-700 text-base md:text-lg">{tempoMedio} dias</span>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4" onClick={() => handleEditBroker(b.id)}>
                    Editar
                  </Button>
                </div>
              </motion.li>
            );
          })
        )}
      </ul>
    </div>
  );
}

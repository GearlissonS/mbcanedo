import { useMemo, useRef, useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { useSettings } from "@/context/SettingsContext";
import { Helmet } from "react-helmet-async";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface RankItem { vendedor: string; vgv: number; }

export default function Ranking() {
  const { sales } = useData();
  const { settings, playRankingSound } = useSettings();
  const [period, setPeriod] = useState<"mensal" | "anual">("mensal");

  const ranking = useMemo(() => {
    const now = new Date();
    let start: Date, end: Date;
    if (period === "mensal") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }
    const map = new Map<string, number>();
    sales.forEach((s) => {
      const d = new Date(s.dataCompetencia);
      if (d >= start && d <= end) {
        map.set(s.vendedor, (map.get(s.vendedor) || 0) + s.vgv);
      }
    });
    const arr: RankItem[] = Array.from(map.entries()).map(([vendedor, vgv]) => ({ vendedor, vgv }));
    arr.sort((a, b) => b.vgv - a.vgv);
    return arr;
  }, [sales, period]);

  const prevOrder = useRef<string[]>([]);
  useEffect(() => {
    if (prevOrder.current.length) {
      ranking.forEach((item, idx) => {
        const prevIdx = prevOrder.current.indexOf(item.vendedor);
        if (prevIdx !== -1 && prevIdx > idx) {
          // overtook someone!
          playRankingSound();
        }
      });
    }
    prevOrder.current = ranking.map((r) => r.vendedor);
  }, [ranking, playRankingSound]);

  const fallback: Array<RankItem & { avatar: string }> = [
    { vendedor: "Ana Souza", vgv: 1250000, avatar: "https://i.pravatar.cc/128?u=ana.souza" },
    { vendedor: "Bruno Lima", vgv: 980000, avatar: "https://i.pravatar.cc/128?u=bruno.lima" },
    { vendedor: "Carla Mendes", vgv: 870000, avatar: "https://i.pravatar.cc/128?u=carla.mendes" },
    { vendedor: "Diego Rocha", vgv: 650000, avatar: "https://i.pravatar.cc/128?u=diego.rocha" },
    { vendedor: "Eduarda Pires", vgv: 540000, avatar: "https://i.pravatar.cc/128?u=eduarda.pires" },
    { vendedor: "Felipe Nunes", vgv: 430000, avatar: "https://i.pravatar.cc/128?u=felipe.nunes" },
  ];

const toView = (arr: RankItem[]): Array<RankItem & { avatar: string }> =>
  arr.map((r) => {
    const broker = settings.brokers?.find((b) => b.name === r.vendedor);
    const avatar = broker?.avatarDataUrl || `https://i.pravatar.cc/128?u=${encodeURIComponent(r.vendedor || 'anon')}`;
    return { ...r, avatar };
  });

  const data = (ranking.length ? toView(ranking) : fallback);
  const top3 = data.slice(0, 3);
  const others = data.slice(3);

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{settings.title} — Ranking</title>
        <meta name="description" content="Ranking gamificado de corretores, com pódio e lista ordenada por VGV." />
      </Helmet>

      <div className="flex items-end gap-3">
        <Label>Período</Label>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mensal">Mensal</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-xl border bg-card shadow-[var(--shadow-elevated)]">
          <h1 className="text-2xl font-bold mb-4">Pódio</h1>
          <div className="grid grid-cols-3 gap-4 items-end">
            {top3.map((r, i) => (
              <div key={r.vendedor} className={`text-center animate-scale-in ${settings.rankingAnimation ? 'transition-transform hover:scale-105' : ''}`}>
                <div aria-label={`Medalha ${i===0?'ouro':i===1?'prata':'bronze'}`} className="text-2xl">{i===0?'🥇':i===1?'🥈':'🥉'}</div>
                <div className="mx-auto mt-2 w-24 h-24 rounded-full p-1 shadow" style={{ background: 'var(--gradient-primary)' }}>
                  <Avatar className="h-full w-full ring-2 ring-[hsl(var(--accent))]">
                    <AvatarImage src={r.avatar} alt={`Foto de ${r.vendedor}`} />
                    <AvatarFallback>{(r.vendedor || '—').split(' ').map((n) => n[0]).join('').slice(0,2)}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="mt-2 font-medium">{r.vendedor || '—'}</div>
                <div className="text-sm text-muted-foreground">VGV: {r.vgv.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' })}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Demais corretores</h2>
          <ol className="space-y-2">
            {others.map((r, idx) => (
              <li key={r.vendedor} className="flex items-center justify-between p-2 rounded-md bg-muted/40 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="w-6 text-sm font-semibold">#{idx + 4}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={r.avatar} alt={`Foto de ${r.vendedor}`} />
                  <AvatarFallback>{(r.vendedor || '—').split(' ').map((n) => n[0]).join('').slice(0,2)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{r.vendedor || '—'}</span>
              </div>
              <span className="text-sm text-muted-foreground">{r.vgv.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' })}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}

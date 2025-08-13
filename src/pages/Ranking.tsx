import { useMemo, useRef, useEffect, useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
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
  const [search, setSearch] = useState("");
  const [highlighted, setHighlighted] = useState<string | null>(null);

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
    if (search.trim()) {
      return arr.filter(r => r.vendedor.toLowerCase().includes(search.trim().toLowerCase()));
    }
    return arr;
  }, [sales, period]);

  const prevOrder = useRef<string[]>([]);
  useEffect(() => {
    if (prevOrder.current.length) {
      ranking.forEach((item, idx) => {
        const prevIdx = prevOrder.current.indexOf(item.vendedor);
        if (prevIdx !== -1 && prevIdx > idx) {
          playRankingSound();
          setHighlighted(item.vendedor);
          setTimeout(() => setHighlighted(null), 2000);
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
    <main className="space-y-6" aria-label="Ranking de Corretores">
      <Helmet>
        <title>{settings.title} — Ranking</title>
        <meta name="description" content="Ranking gamificado de corretores, com pódio e lista ordenada por VGV." />
        <meta property="og:title" content={`${settings.title} — Ranking`} />
        <meta property="og:description" content="Ranking gamificado de corretores, com pódio e lista ordenada por VGV." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={settings.logoDataUrl || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${settings.title} — Ranking`} />
        <meta name="twitter:description" content="Ranking gamificado de corretores, com pódio e lista ordenada por VGV." />
        <meta name="twitter:image" content={settings.logoDataUrl || ''} />
      </Helmet>

      <div className="flex flex-col md:flex-row items-end gap-3">
        <Label htmlFor="periodo">Período</Label>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-40" id="periodo" aria-label="Selecionar período"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="mensal">Mensal</SelectItem>
            <SelectItem value="anual">Anual</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="busca" className="ml-4">Buscar corretor</Label>
        <Input id="busca" type="text" placeholder="Digite o nome..." value={search} onChange={e => setSearch(e.target.value)} className="w-48" aria-label="Buscar corretor" />
      </div>

  {/* Removido loader pois não há loading no contexto */}
  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-8 rounded-xl border bg-card shadow-[var(--shadow-elevated)] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary-glow/10 pointer-events-none" />
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              🏆 Pódio dos Campeões
            </h1>
            <div className="flex items-end justify-center gap-8 min-h-[320px]">
              {/* Reorder for visual impact: 2nd, 1st, 3rd */}
              {[1, 0, 2].map((position) => {
                const r = top3[position];
                if (!r) return null;
                const heights = { 0: 'h-32', 1: 'h-24', 2: 'h-20' };
                const medalGradients = {
                  0: 'from-yellow-300 via-yellow-500 to-yellow-600',
                  1: 'from-gray-300 via-gray-400 to-gray-500', 
                  2: 'from-amber-600 via-amber-700 to-amber-800'
                };
                const glowColors = {
                  0: 'shadow-yellow-500/30',
                  1: 'shadow-gray-400/30',
                  2: 'shadow-amber-600/30'
                };
                return (
                  <div 
                    key={r.vendedor} 
                    className={`text-center animate-scale-in ${settings.rankingAnimation ? 'transition-all duration-300 hover:scale-105' : ''} ${highlighted === r.vendedor ? 'ring-4 ring-primary-glow' : ''}`}
                    style={{ animationDelay: `${position * 0.2}s` }}
                    aria-label={`Corretor ${r.vendedor}, posição ${position + 1}`}
                  >
                    {/* Medal */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${medalGradients[position]} shadow-lg ${glowColors[position]} mb-4 animate-pulse`}>
                      <span className="text-2xl font-bold text-white drop-shadow-lg">
                        {position === 0 ? '1°' : position === 1 ? '2°' : '3°'}
                      </span>
                    </div>
                    {/* Podium Base */}
                    <div className={`mx-auto ${heights[position]} w-20 bg-gradient-to-t from-primary/20 to-primary/10 rounded-t-lg border-2 border-primary/30 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary">
                        {position + 1}º
                      </div>
                    </div>
                    {/* Avatar */}
                    <div className="mx-auto -mt-8 relative z-10">
                      <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-br from-primary via-primary-glow to-primary shadow-lg">
                        <Tooltip>
                          <span className="text-xs px-2 py-1 bg-muted rounded absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                            VGV: {r.vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <Avatar className="h-full w-full ring-2 ring-white">
                            <AvatarImage src={r.avatar} alt={`Foto de ${r.vendedor}`} loading="lazy" />
                            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary-glow/20 text-primary font-bold">
                              {(r.vendedor || '—').split(' ').map((n) => n[0]).join('').slice(0,2)}
                            </AvatarFallback>
                          </Avatar>
                        </Tooltip>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="mt-3 space-y-1">
                      <div className="font-bold text-sm">{r.vendedor || '—'}</div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {r.vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      {position === 0 && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 rounded-full text-xs font-bold text-yellow-700 border border-yellow-400/30">
                          👑 Líder
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Demais corretores</h2>
          <ol className="space-y-2" aria-label="Lista de corretores">
            {others.map((r, idx) => (
              <li key={r.vendedor} className={`flex items-center justify-between p-2 rounded-md bg-muted/40 animate-fade-in ${highlighted === r.vendedor ? 'ring-2 ring-primary-glow' : ''}`}
                  aria-label={`Corretor ${r.vendedor}, posição ${idx + 4}`}>
                <div className="flex items-center gap-2">
                  <span className="w-6 text-sm font-semibold">#{idx + 4}</span>
                  <Tooltip>
                    <span className="text-xs px-2 py-1 bg-muted rounded absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      VGV: {r.vgv.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={r.avatar} alt={`Foto de ${r.vendedor}`} loading="lazy" />
                      <AvatarFallback>{(r.vendedor || '—').split(' ').map((n) => n[0]).join('').slice(0,2)}</AvatarFallback>
                    </Avatar>
                  </Tooltip>
                  <span className="font-medium">{r.vendedor || '—'}</span>
                </div>
                <span className="text-sm text-muted-foreground">{r.vgv.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' })}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      
    </main>
  );
}

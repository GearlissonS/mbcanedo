import { useState } from "react";
import { useSettings, MenuKey } from "@/context/SettingsContext";
import { useData, Sale } from "@/context/DataContext";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BrokersSection from "@/components/settings/BrokersSection";

export default function Settings() {
  const { settings, updateSettings, applyTheme } = useSettings();
  const { sales, setSales } = useData();

  const [primary, setPrimary] = useState(settings.primaryHex);
  const [accent, setAccent] = useState(settings.accentHex);
  const [chartColors, setChartColors] = useState(settings.chartColors.join(","));

  const saveTheme = () => {
    const colors = chartColors.split(",").map((c) => c.trim()).filter(Boolean);
    updateSettings({ primaryHex: primary, accentHex: accent, chartColors: colors });
    applyTheme();
  };

  const moveMenu = (key: MenuKey, dir: -1 | 1) => {
    const order = [...settings.menuOrder];
    const idx = order.indexOf(key);
    const target = idx + dir;
    if (target < 0 || target >= order.length) return;
    [order[idx], order[target]] = [order[target], order[idx]];
    updateSettings({ menuOrder: order });
  };

  const onLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateSettings({ logoDataUrl: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ settings, sales }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my-broker-dados.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (data.settings) updateSettings(data.settings);
        if (data.sales) setSales(data.sales as Sale[]);
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{settings.title} — Configurações</title>
        <meta name="description" content="Personalize cores, logo, título, listas, comissão, ranking e exporte/import dados." />
      </Helmet>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-3">Tema</h2>
          <div className="space-y-3">
            <div>
              <Label>Título da Home</Label>
              <Input value={settings.title} onChange={(e) => updateSettings({ title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Cor Primária</Label>
                <Input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
              </div>
              <div>
                <Label>Cor de Acento</Label>
                <Input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Cores dos Gráficos (separe por vírgula)</Label>
              <Input value={chartColors} onChange={(e) => setChartColors(e.target.value)} />
            </div>
            <div>
              <Label>Logo</Label>
              <Input type="file" accept="image/*" onChange={onLogo} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label>Fundo</Label>
                <select
                  className="w-full h-10 rounded-md border bg-background px-3"
                  value={settings.backgroundStyle || "geometric"}
                  onChange={(e) => updateSettings({ backgroundStyle: e.target.value as any })}
                >
                  <option value="geometric">Geométrico</option>
                  <option value="none">Nenhum</option>
                </select>
              </div>
              <div>
                <Label>Intensidade do Fundo</Label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.backgroundIntensity ?? 40}
                  onChange={(e) => updateSettings({ backgroundIntensity: Number(e.target.value) })}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">{settings.backgroundIntensity ?? 40}%</div>
              </div>
              <div className="flex items-end">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(settings.showThemedIcons ?? true) === true}
                    onChange={(e) => updateSettings({ showThemedIcons: e.target.checked })}
                  />
                  <span>Ícones temáticos</span>
                </label>
              </div>
            </div>

            <Button onClick={saveTheme}>Salvar Tema</Button>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-3">Menu</h2>
          <ul className="space-y-2">
            {settings.menuOrder.map((k) => (
              <li key={k} className="flex items-center justify-between p-2 rounded-md border">
                <span className="capitalize">{k}</span>
                <div className="space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => moveMenu(k, -1)}>▲</Button>
                  <Button size="sm" variant="secondary" onClick={() => moveMenu(k, 1)}>▼</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-3">Listas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label>Origem</Label>
              <Input value={settings.origins.join(", ")} onChange={(e) => updateSettings({ origins: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </div>
            <div>
              <Label>Estilo</Label>
              <Input value={settings.styles.join(", ")} onChange={(e) => updateSettings({ styles: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </div>
            <div>
              <Label>Produto</Label>
              <Input value={settings.products.join(", ")} onChange={(e) => updateSettings({ products: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} />
            </div>
          </div>
        </div>

        {/* Corretores */}
        {/* We extract into a dedicated component for maintainability */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <BrokersSection />

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-3">Gamificação</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Som do Ranking</Label>
              <select className="w-full h-10 rounded-md border bg-background px-3" value={settings.rankingSound} onChange={(e) => updateSettings({ rankingSound: e.target.value as any })}>
                <option value="none">Nenhum</option>
                <option value="ding">Ding</option>
                <option value="tada">Tada</option>
              </select>
            </div>
            <div>
              <Label>Animação</Label>
              <select className="w-full h-10 rounded-md border bg-background px-3" value={String(settings.rankingAnimation)} onChange={(e) => updateSettings({ rankingAnimation: e.target.value === 'true' })}>
                <option value="true">Ativada</option>
                <option value="false">Desativada</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-card">
          <h2 className="font-semibold mb-3">Taxa de Comissão Global</h2>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Label>Taxa (%)</Label>
              <Input type="number" step="0.01" value={settings.commissionRate} onChange={(e) => updateSettings({ commissionRate: Number(e.target.value) })} />
            </div>
            <Button onClick={() => applyTheme()}>Aplicar</Button>
          </div>
        </div>
      </section>

      <Separator />

      <section className="p-4 border rounded-lg bg-card">
        <h2 className="font-semibold mb-3">Importar / Exportar Dados</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <Button onClick={exportJSON}>Exportar JSON</Button>
          <Label className="cursor-pointer inline-flex items-center gap-2">
            <span className="h-10 inline-flex items-center px-3 rounded-md border">Importar JSON</span>
            <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
          </Label>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSettings, MenuKey } from "@/context/SettingsContext";
import { useData } from "@/context/data-core";
import type { Sale } from "@/context/types";
import { Helmet } from "react-helmet-async";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrokersSection from "@/components/settings/BrokersSection";
import BackButton from "@/components/BackButton";

export default function Settings() {
  // ...existing code...
  const { settings, updateSettings, applyTheme } = useSettings();
  const { sales, setSales } = useData();

  // Estado local para preview instantâneo
  const [previewSettings, setPreviewSettings] = useState(settings);
  useEffect(() => {
    setPreviewSettings(settings);
  }, [settings]);

  // Aplica preview instantâneo ao tema
  useEffect(() => {
    applyTheme();
  }, [previewSettings, applyTheme]);

  // Handlers para campos
  const handleChange = (patch: Partial<typeof previewSettings>) => {
    setPreviewSettings(prev => ({ ...prev, ...patch }));
  };

  const [chartColors, setChartColors] = useState(settings.chartColors.join(","));
  useEffect(() => {
    setChartColors(previewSettings.chartColors.join(","));
  }, [previewSettings.chartColors]);

  const saveTheme = () => {
    updateSettings(previewSettings);
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
      } catch (err) {
        // ignore invalid import files
  console.debug('importJSON failed', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{settings.title} — Configurações</title>
        <meta name="description" content="Personalize cores, logo, título, listas, comissão, ranking e exporte/import dados." />
      </Helmet>

      <Tabs defaultValue="tema" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tema">Tema</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="listas">Listas</TabsTrigger>
          <TabsTrigger value="corretores">Corretores</TabsTrigger>
          <TabsTrigger value="gamificacao">Gamificação</TabsTrigger>
          <TabsTrigger value="dados">Dados</TabsTrigger>
        </TabsList>

        {/* Aba Tema */}
        <TabsContent value="tema" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-card">
              <h2 className="font-semibold mb-3">Aparência</h2>
              <div className="space-y-3">
                <div>
                  <BackButton />
                  <Label>Título da Home</Label>
                  <Input value={previewSettings.title} onChange={(e) => handleChange({ title: e.target.value })} />
                </div>
                <div>
                  <Label>Descrição da Home</Label>
                  <Input value={previewSettings.homeDescription ?? ""} onChange={(e) => handleChange({ homeDescription: e.target.value })} />
                </div>
                <div>
                  <Label>Imagem da Home</Label>
                  <Input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => handleChange({ homeImage: String(reader.result) });
                    reader.readAsDataURL(file);
                  }} />
                  {previewSettings.homeImage && (
                    <img src={previewSettings.homeImage} alt="Home" className="mt-2 w-32 h-20 object-contain rounded-lg border" />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Cor Primária</Label>
                    <Input type="color" value={previewSettings.primaryHex} onChange={(e) => handleChange({ primaryHex: e.target.value })} />
                  </div>
                  <div>
                    <Label>Cor de Acento</Label>
                    <Input type="color" value={previewSettings.accentHex} onChange={(e) => handleChange({ accentHex: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Cores dos Gráficos (separe por vírgula)</Label>
                  <Input value={chartColors} onChange={(e) => {
                    setChartColors(e.target.value);
                    handleChange({ chartColors: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) });
                  }} />
                </div>
                <div>
                  <Label>Logo</Label>
                  <Input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => handleChange({ logoDataUrl: String(reader.result) });
                    reader.readAsDataURL(file);
                  }} />
                </div>
                <div>
                  <Label>Modo</Label>
                  <select value={previewSettings.theme ?? "light"} onChange={e => handleChange({ theme: e.target.value as "light" | "dark" })} className="w-full border rounded px-2 py-1">
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                  </select>
                </div>
                <Button onClick={saveTheme}>Salvar Tema</Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-card">
              <h2 className="font-semibold mb-3">Fundo</h2>
              <div className="space-y-3">
                <div>
                  <Label>Estilo</Label>
                  <select
                    className="w-full h-10 rounded-md border bg-background px-3"
                    value={settings.backgroundStyle || "geometric"}
                    onChange={(e) => updateSettings({ backgroundStyle: e.target.value as "geometric" | "none" })}
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
            </div>
          </div>
        </TabsContent>

        {/* Aba Menu */}
        <TabsContent value="menu" className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="font-semibold mb-3">Ordem do Menu</h2>
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
        </TabsContent>

        {/* Aba Listas */}
        <TabsContent value="listas" className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="font-semibold mb-3">Opções de Listas</h2>
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
        </TabsContent>

        {/* Aba Corretores */}
        <TabsContent value="corretores" className="space-y-4">
          <BrokersSection />
        </TabsContent>

        {/* Aba Gamificação */}
        <TabsContent value="gamificacao" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg bg-card">
              <h2 className="font-semibold mb-3">Ranking</h2>
              <div className="space-y-3">
                <div>
                  <Label>Som do Ranking</Label>
                  <select className="w-full h-10 rounded-md border bg-background px-3" value={settings.rankingSound} onChange={(e) => updateSettings({ rankingSound: e.target.value as "none" | "ding" | "tada" })}>
                    <option value="none">Nenhum</option>
                    <option value="ding">Ding</option>
                    <option value="tada">Tada</option>
                  </select>
                  <div className="mt-2">
                    <Label>Upload de som (.mp3, máx. 2MB)</Label>
                    <Input type="file" accept="audio/mp3" onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) {
                        alert("O arquivo deve ter no máximo 2MB.");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => updateSettings({ rankingSoundFile: String(reader.result) });
                      reader.readAsDataURL(file);
                    }} />
                    <div className="text-xs text-muted-foreground mt-1">O som será usado ao ultrapassar no ranking.</div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="checkbox" checked={settings.rankingSoundEnabled ?? true} onChange={e => updateSettings({ rankingSoundEnabled: e.target.checked })} />
                    <span>Habilitar som do ranking</span>
                  </div>
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
              <div className="space-y-3">
                <div>
                  <Label>Taxa (%)</Label>
                  <Input type="number" step="0.01" value={settings.commissionRate} onChange={(e) => updateSettings({ commissionRate: Number(e.target.value) })} />
                </div>
                <Button onClick={() => applyTheme()}>Aplicar</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Aba Dados */}
        <TabsContent value="dados" className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h2 className="font-semibold mb-3">Importar / Exportar Dados</h2>
            <div className="flex flex-wrap gap-3 items-center">
              <Button onClick={exportJSON}>Exportar JSON</Button>
              <Label className="cursor-pointer inline-flex items-center gap-2">
                <span className="h-10 inline-flex items-center px-3 rounded-md border">Importar JSON</span>
                <input type="file" accept="application/json" onChange={importJSON} className="hidden" />
              </Label>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

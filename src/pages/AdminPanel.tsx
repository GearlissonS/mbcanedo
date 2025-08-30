import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { UploadCloud, Palette, Image, List, Save, Import, Export, Eye } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Exemplo de verificação de permissão (substitua por sua lógica real)
const isAdmin = true; // TODO: integrar com autenticação

const defaultConfig = {
  title: "My Broker",
  description: "Gestão imobiliária moderna.",
  logoDataUrl: "",
  homeImage: "",
  colors: {
    primary: "#2563eb",
    secondary: "#06b6d4",
    mode: "light",
  },
  cards: [
    { icon: "LayoutDashboard", label: "Dashboard", to: "/dashboard" },
    { icon: "Building2", label: "Imóveis", to: "/properties" },
    { icon: "Handshake", label: "Negociações", to: "/sales" },
    { icon: "TrendingUp", label: "Ranking", to: "/ranking" },
    { icon: "Settings", label: "Configurações", to: "/settings" },
  ],
  lists: {
    origens: ["Site", "Indicação", "Instagram"],
    estilos: ["Apartamento", "Casa", "Terreno"],
    produtos: ["Venda", "Aluguel"],
  },
};

export default function AdminPanel() {
  const { settings, setSettings } = useSettings();
  const [config, setConfig] = useState(settings || defaultConfig);
  const [preview, setPreview] = useState(false);
  const [importJson, setImportJson] = useState("");

  if (!isAdmin) return <div className="p-8 text-center text-red-500">Acesso restrito a administradores.</div>;

  // Handlers
  const handleChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };
  const handleColorChange = (field, value) => {
    setConfig((prev) => ({ ...prev, colors: { ...prev.colors, [field]: value } }));
  };
  const handleCardChange = (idx, field, value) => {
    const cards = [...config.cards];
    cards[idx][field] = value;
    setConfig((prev) => ({ ...prev, cards }));
  };
  const handleListChange = (list, idx, value) => {
    const lists = { ...config.lists };
    lists[list][idx] = value;
    setConfig((prev) => ({ ...prev, lists }));
  };
  const handleSave = async () => {
    // Salva no Supabase
    await supabase.from("core.config").upsert([config]);
    setSettings(config);
    alert("Configurações salvas!");
  };
  const handleExport = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = () => {
    try {
      const imported = JSON.parse(importJson);
      setConfig(imported);
      alert("Configuração importada!");
    } catch {
      alert("JSON inválido");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-200 p-8 flex flex-col items-center">
      <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6">Painel Administrativo</motion.h2>
      <div className="w-full max-w-2xl bg-white/80 rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid gap-4">
          <div>
            <label className="font-semibold">Título do site</label>
            <Input value={config.title} onChange={e => handleChange("title", e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Descrição</label>
            <Input value={config.description} onChange={e => handleChange("description", e.target.value)} />
          </div>
          <div>
            <label className="font-semibold flex items-center gap-2"><Image className="w-5 h-5" /> Logo</label>
            <Input value={config.logoDataUrl} onChange={e => handleChange("logoDataUrl", e.target.value)} placeholder="URL ou base64" />
          </div>
          <div>
            <label className="font-semibold flex items-center gap-2"><Image className="w-5 h-5" /> Imagem da Home</label>
            <Input value={config.homeImage} onChange={e => handleChange("homeImage", e.target.value)} placeholder="URL ou base64" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5" /> Primária</label>
              <Input type="color" value={config.colors.primary} onChange={e => handleColorChange("primary", e.target.value)} />
            </div>
            <div>
              <label className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5" /> Secundária</label>
              <Input type="color" value={config.colors.secondary} onChange={e => handleColorChange("secondary", e.target.value)} />
            </div>
            <div>
              <label className="font-semibold flex items-center gap-2"><Palette className="w-5 h-5" /> Tema</label>
              <select value={config.colors.mode} onChange={e => handleColorChange("mode", e.target.value)} className="w-full rounded border px-2 py-1">
                <option value="light">Claro</option>
                <option value="dark">Escuro</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-semibold flex items-center gap-2"><List className="w-5 h-5" /> Cards da Home</label>
            <div className="grid gap-2">
              {config.cards.map((card, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input value={card.label} onChange={e => handleCardChange(idx, "label", e.target.value)} className="w-32" />
                  <Input value={card.icon} onChange={e => handleCardChange(idx, "icon", e.target.value)} className="w-32" />
                  <Input value={card.to} onChange={e => handleCardChange(idx, "to", e.target.value)} className="w-32" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="font-semibold flex items-center gap-2"><List className="w-5 h-5" /> Listas Customizáveis</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(config.lists).map(([list, values]) => (
                <div key={list}>
                  <span className="font-medium">{list}</span>
                  {values.map((val, idx) => (
                    <Input key={idx} value={val} onChange={e => handleListChange(list, idx, e.target.value)} className="mt-1" />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button onClick={handleSave} variant="default"><Save className="w-5 h-5 mr-2" /> Salvar</Button>
          <Button onClick={() => setPreview(!preview)} variant="secondary"><Eye className="w-5 h-5 mr-2" /> Preview</Button>
          <Button onClick={handleExport} variant="outline"><Export className="w-5 h-5 mr-2" /> Exportar JSON</Button>
          <Dialog>
            <Button variant="outline"><Import className="w-5 h-5 mr-2" /> Importar JSON</Button>
            <div className="p-4">
              <textarea value={importJson} onChange={e => setImportJson(e.target.value)} className="w-full h-32 border rounded p-2" placeholder="Cole o JSON aqui" />
              <Button onClick={handleImport} variant="default" className="mt-2">Importar</Button>
            </div>
          </Dialog>
        </div>
      </div>
      {preview && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-2">Preview</h3>
          <pre className="text-xs bg-gray-100 rounded p-2 overflow-x-auto">{JSON.stringify(config, null, 2)}</pre>
        </motion.div>
      )}
    </div>
  );
}

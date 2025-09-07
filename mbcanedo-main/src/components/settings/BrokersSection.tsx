import { useState } from "react";
import { useSettings } from "@/context/SettingsContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function BrokersSection() {
  const { settings, updateSettings } = useSettings();
  const [newName, setNewName] = useState("");
  const [newTeam, setNewTeam] = useState("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const addBroker = () => {
    if (!newName.trim()) return;
    const finalize = (avatarDataUrl?: string) => {
      const next = [...(settings.brokers || [])];
      next.push({ id: crypto.randomUUID(), name: newName.trim(), avatarDataUrl });
      updateSettings({ brokers: next });
      setNewName("");
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <div className="md:col-span-1">
          <Label>Nome</Label>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex.: Ana Souza" />
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

      {/* List */}
      <ul className="space-y-3">
        {(settings.brokers || []).length === 0 && (
          <li className="text-sm text-muted-foreground">Nenhum corretor cadastrado ainda.</li>
        )}
        {(settings.brokers || []).map((b) => (
          <li key={b.id} className="flex items-center justify-between gap-3 p-2 rounded-md border">
            <div className="flex items-center gap-3">
              <img
                src={b.avatarDataUrl || `https://i.pravatar.cc/64?u=${encodeURIComponent(b.name || b.id)}`}
                alt={`Avatar de ${b.name}`}
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <Label className="text-xs">Nome</Label>
                <Input value={b.name} onChange={(e) => updateName(b.id, e.target.value)} />
                <div className="mt-2">
                  <Label className="text-xs">Equipe</Label>
                  <Input value={b.team || ""} onChange={(e) => updateTeam(b.id, e.target.value)} placeholder="Ex.: Time A" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs">Alterar avatar</Label>
              <Input type="file" accept="image/*" onChange={(e) => updateAvatar(b.id, e.target.files?.[0])} />
              <Button variant="destructive" onClick={() => removeBroker(b.id)}>Remover</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

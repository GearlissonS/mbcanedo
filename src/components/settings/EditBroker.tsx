import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Broker } from "@/context/SettingsContext";

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

interface EditBrokerProps {
  broker: Broker;
  onSave: (data: Broker) => void;
  onRemoveAvatar: () => void;
}

export default function EditBroker({ broker, onSave, onRemoveAvatar }: EditBrokerProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BrokerForm>({
    resolver: zodResolver(brokerSchema),
    defaultValues: {
      name: broker.name,
      nickname: broker.nickname,
      creci: broker.creci,
      team: broker.team || "",
      vgv: broker.vgv || 0,
      tempoMedio: broker.tempoMedio || 0,
      avatar: undefined,
    },
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

  return (
    <motion.form
      className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      onSubmit={handleSubmit(async (data) => {
      // Compressão/redimensionamento
      let avatarDataUrl = broker.avatarDataUrl;
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
        onSave({
          ...broker,
          name: data.name,
          nickname: data.nickname,
          creci: data.creci,
          team: data.team,
          vgv: data.vgv,
          tempoMedio: data.tempoMedio,
          avatarDataUrl,
        });
        reset();
      }
    })}>
      <div className="md:col-span-1 flex flex-col items-center">
        <Label>Foto atual</Label>
        {broker.avatarDataUrl ? (
          <img src={broker.avatarDataUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover border-2 border-primary mb-2" />
        ) : (
          <div className="h-16 w-16 rounded-full flex items-center justify-center bg-primary text-white font-bold text-xl border-2 border-primary mb-2">
            {broker.name ? broker.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : <svg className="h-8 w-8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /></svg>}
          </div>
        )}
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={onRemoveAvatar}>Remover foto</Button>
      </div>
      <div className="md:col-span-1">
        <Label>Trocar foto</Label>
        <Input type="file" accept="image/jpeg,image/png,image/webp" {...register("avatar")} />
        {avatarFile && avatarFile[0] && avatarPreview.current && (
          <div className="mt-2 flex justify-center">
            <img src={avatarPreview.current} alt="Preview" className="h-16 w-16 rounded-full object-cover border-2 border-primary" />
          </div>
        )}
      </div>
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
      <div className="md:col-span-1 flex items-end">
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Salvando..." : "Salvar alterações"}</Button>
      </div>
  </motion.form>
  );
}

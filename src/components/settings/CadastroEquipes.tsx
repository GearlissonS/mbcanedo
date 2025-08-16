import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/context/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CadastroEquipes() {
  const [nome, setNome] = useState("");
  const queryClient = useQueryClient();

  const { data: equipes, isLoading } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const addEquipe = useMutation({
    mutationFn: async () => {
      const trimmed = nome.trim();
      if (!trimmed) return;
      const { error } = await supabase.from("equipes").insert([{ nome: trimmed }]);
      if (error) throw error;
    },
    onSuccess: () => {
      setNome("");
      queryClient.invalidateQueries({ queryKey: ["equipes"] });
      toast.success("Equipe adicionada");
    },
    onError: () => toast.error("Não foi possível salvar"),
  });

  const deleteEquipe = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("equipes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipes"] });
      toast.success("Equipe excluída");
    },
    onError: () => toast.error("Falha ao excluir"),
  });

  return (
    <Card className="max-w-lg mx-auto p-4">
      <CardHeader>
        <CardTitle>Cadastro de Equipes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Digite o nome da equipe"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            disabled={addEquipe.isPending}
          />
          <Button onClick={() => addEquipe.mutate()} disabled={!nome.trim() || addEquipe.isPending}>
            Salvar
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Equipes Cadastradas</h3>
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Carregando…</div>
          ) : (
            <ul className="space-y-1">
              {equipes?.map((e: any) => (
                <li key={e.id} className="flex justify-between items-center py-1">
                  <span>{e.nome}</span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEquipe.mutate(e.id)}
                    disabled={deleteEquipe.isPending}
                  >
                    Excluir
                  </Button>
                </li>
              ))}
              {(!equipes || equipes.length === 0) && (
                <li className="text-sm text-muted-foreground">Nenhuma equipe cadastrada.</li>
              )}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

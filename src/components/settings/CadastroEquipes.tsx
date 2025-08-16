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
    <div className="bg-gray-50 rounded p-2">
      <Card className="max-w-xl mx-auto bg-white rounded-2xl shadow">
        <CardHeader>
          <CardTitle>Cadastro de Equipes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Digite o nome da equipe"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={addEquipe.isPending}
              className="w-full rounded-xl border border-gray-300 bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={() => addEquipe.mutate()}
              disabled={!nome.trim() || addEquipe.isPending}
              className="rounded-xl px-5 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Salvar
            </Button>
          </div>

          {/* Atalho extra: botão Cadastrar */}
          <div className="mt-2">
            <Button
              onClick={() => addEquipe.mutate()}
              disabled={!nome.trim() || addEquipe.isPending}
              className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              variant="default"
            >
              Cadastrar
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
    </div>
  );
}

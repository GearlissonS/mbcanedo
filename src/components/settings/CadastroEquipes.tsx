import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { safeSelect, safeInsert, safeDelete } from "@/lib/safeSupabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CadastroEquipes() {
  const [nome, setNome] = useState("");
  const queryClient = useQueryClient();

  const { data: equipes, isLoading, isError } = useQuery({
    queryKey: ["equipes"],
    queryFn: async () => await safeSelect("equipes", { order: "created_at" }),
  });

  const addEquipe = useMutation({
    mutationFn: async () => {
      const trimmed = nome.trim();
      if (!trimmed) return;
      const ok = await safeInsert("equipes", { nome: trimmed });
      if (!ok) throw new Error("Falha ao inserir equipe");
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
      const ok = await safeDelete("equipes", id);
      if (!ok) throw new Error("Falha ao excluir equipe");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipes"] });
      toast.success("Equipe excluída");
    },
    onError: () => toast.error("Falha ao excluir"),
  });

  return (
    <div className="bg-transparent p-2">
      <Card className="max-w-xl mx-auto bg-card rounded-2xl soft-shadow">
        <CardHeader>
          <CardTitle className="text-slate-900">Cadastro de Equipes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Input
              placeholder="Digite o nome da equipe"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={addEquipe.isPending}
              className="w-full bg-white"
            />
            <Button
              onClick={() => addEquipe.mutate()}
              disabled={!nome.trim() || addEquipe.isPending}
              className="px-5"
            >
              Salvar
            </Button>
          </div>

          {/* Atalho extra: botão Cadastrar */}
          <div className="mt-2">
            <Button
              onClick={() => addEquipe.mutate()}
              disabled={!nome.trim() || addEquipe.isPending}
              className=""
              variant="default"
            >
              Cadastrar
            </Button>
          </div>

          <div className="mt-4">
            <h3 className="font-bold mb-2">Equipes Cadastradas</h3>
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Carregando…</div>
            ) : isError ? (
              <div className="text-sm text-red-500">Não foi possível carregar os dados agora. Tente novamente mais tarde.</div>
            ) : (
              <ul className="space-y-1">
                {equipes?.map((e: { id: string; nome: string }) => (
                  <li key={e.id} className="flex justify-between items-center py-1 border-b border-slate-200/70">
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

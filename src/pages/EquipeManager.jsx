import { useState, useEffect } from "react";
import { supabase } from "@/context/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, Edit2, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export default function EquipeManager() {
  const [equipes, setEquipes] = useState([]);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingNome, setEditingNome] = useState("");

  useEffect(() => {
    carregarEquipes();
  }, []);

  async function carregarEquipes() {
    setLoading(true);
    const { data, error } = await supabase.from("equipes").select("*").order("nome");
    if (error) {
      toast.error("Erro ao carregar equipes");
    } else {
      setEquipes(data || []);
    }
    setLoading(false);
  }

  async function adicionarEquipe() {
    const novo = nome.trim();
    if (!novo) return toast.warning("Informe o nome da equipe");
    setLoading(true);
    const { error } = await supabase.from("equipes").insert([{ nome: novo }]);
    setLoading(false);
    if (error) return toast.error("Não foi possível salvar");
    toast.success("Equipe adicionada");
    setNome("");
    carregarEquipes();
  }

  function iniciarEdicao(eq) {
    setEditingId(eq.id);
    setEditingNome(eq.nome);
  }

  async function salvarEdicao() {
    const novoNome = (editingNome || "").trim();
    if (!novoNome) return toast.warning("Nome inválido");
    setLoading(true);
    const { error } = await supabase.from("equipes").update({ nome: novoNome }).eq("id", editingId);
    setLoading(false);
    if (error) return toast.error("Falha ao atualizar");
    toast.success("Equipe atualizada");
    setEditingId(null);
    setEditingNome("");
    carregarEquipes();
  }

  async function excluirEquipe(id) {
    setLoading(true);
    const { error } = await supabase.from("equipes").delete().eq("id", id);
    setLoading(false);
    if (error) return toast.error("Falha ao excluir");
    toast.success("Equipe excluída");
    carregarEquipes();
  }

  return (
    <div className="min-h-[60vh] grid place-items-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Cadastro de Equipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 items-center mb-4">
            <Input
              placeholder="Digite o nome da equipe…"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
            />
            <Button onClick={adicionarEquipe} disabled={loading} className="gap-2">
              <PlusCircle size={18} /> Salvar
            </Button>
          </div>

          <div className="space-y-2">
            {loading && equipes.length === 0 ? (
              <div className="text-sm text-muted-foreground">Carregando…</div>
            ) : equipes.length === 0 ? (
              <div className="text-sm text-muted-foreground">Nenhuma equipe cadastrada.</div>
            ) : (
              <ul className="divide-y">
                {equipes.map((eq) => (
                  <li key={eq.id} className="py-2 flex items-center gap-2 justify-between">
                    {editingId === eq.id ? (
                      <div className="flex-1 flex gap-2 items-center">
                        <Input
                          value={editingNome}
                          onChange={(e) => setEditingNome(e.target.value)}
                          className="max-w-sm"
                          autoFocus
                        />
                        <Button size="sm" className="gap-1" onClick={salvarEdicao}>
                          <Check size={16} /> Salvar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditingNome(""); }}>Cancelar</Button>
                      </div>
                    ) : (
                      <div className="flex-1 font-medium">{eq.nome}</div>
                    )}
                    {editingId !== eq.id && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" className="gap-1" onClick={() => iniciarEdicao(eq)}>
                          <Edit2 size={16} /> Editar
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="gap-1">
                              <Trash2 size={16} /> Excluir
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Excluir equipe</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{eq.nome}"? Essa ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => excluirEquipe(eq.id)}>Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState, useEffect } from "react";
import { supabase } from "@/context/supabaseClient";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, Edit2, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/context/SettingsContext";

export default function EquipeManager() {
  const { settings } = useSettings();
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
    <div className="p-2">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Equipes</CardTitle>
          <div className="flex gap-2 items-center">
            <Input
              placeholder="Nova equipe…"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              className="w-56"
            />
            <Button onClick={adicionarEquipe} disabled={loading} className="gap-2">
              <PlusCircle size={18} /> Adicionar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && equipes.length === 0 ? (
            <div className="text-sm text-muted-foreground">Carregando…</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[160px]">Criada em</TableHead>
                  <TableHead className="w-[140px]">Corretores</TableHead>
                  <TableHead className="w-[220px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">Nenhuma equipe cadastrada.</TableCell>
                  </TableRow>
                ) : (
                  equipes.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="text-muted-foreground">{eq.id}</TableCell>
                      <TableCell>
                        {editingId === eq.id ? (
                          <div className="flex items-center gap-2">
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
                          <span className="font-medium">{eq.nome}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {eq.created_at ? new Date(eq.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        {Array.isArray(settings?.brokers)
                          ? (settings.brokers || []).filter((b) => b.team === eq.nome).length
                          : 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {editingId !== eq.id ? (
                          <div className="flex justify-end gap-2">
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
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

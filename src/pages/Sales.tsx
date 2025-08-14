import { useData } from "@/context/data-core";
import type { Sale } from "@/context/types";
import { useSettings } from "@/context/SettingsContext";
import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { exportCSV, exportPDF, exportXLSX } from "@/utils/exporters";
import { format } from "date-fns";
import { formatCurrencyBR } from "@/lib/utils";

function formatMoney(n: number) {
  return (n ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function Sales() {
  const { sales, addSale, updateSale, deleteSale, recalcVgc } = useData();
  const { settings } = useSettings();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ vendedor: string; status: string; period: "mensal" | "anual" | "custom"; start?: string; end?: string }>({ vendedor: "", status: "", period: "mensal" });

  const [form, setForm] = useState<Partial<Sale>>({
    id: "",
    dataCompetencia: new Date().toISOString().slice(0, 10),
    dataVencimento: new Date().toISOString().slice(0, 10),
    cliente: "",
    origem: settings.origins[0] ?? "",
    estilo: settings.styles[0] ?? "",
    produto: settings.products[0] ?? "",
    vgv: 0,
    vgc: 0,
    tipo: settings.products[0] ?? "",
    vendedor: "",
    captador: "",
    gerente: "",
    status: "Em análise",
    pago: false,
  });

  const filtered = useMemo(() => {
    const now = new Date();
    let start: Date | null = null, end: Date | null = null;
    if (filters.period === "mensal") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (filters.period === "anual") {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    } else if (filters.start && filters.end) {
      start = new Date(filters.start);
      end = new Date(filters.end);
    }
    return sales.filter((s) => {
      const d = new Date(s.dataCompetencia);
      const inRange = start && end ? d >= start && d <= end : true;
      const vendedorOk = filters.vendedor ? s.vendedor === filters.vendedor : true;
      const statusOk = filters.status ? s.status === filters.status : true;
      return inRange && vendedorOk && statusOk;
    });
  }, [sales, filters]);

  const vendedores = Array.from(new Set(sales.map((s) => s.vendedor))).filter(Boolean) as string[];
  const statuses = Array.from(new Set(sales.map((s) => s.status))).filter(Boolean) as string[];

  const onSubmit = () => {
    if (!form.id) return;
    const payload: Sale = {
      id: form.id!,
      dataCompetencia: form.dataCompetencia!,
      dataVencimento: form.dataVencimento!,
      cliente: form.cliente!,
      origem: form.origem!,
      estilo: form.estilo!,
      produto: form.produto!,
      vgv: Number(form.vgv || 0),
      vgc: Number(form.vgc || 0),
      tipo: form.tipo!,
      vendedor: form.vendedor!,
      captador: form.captador || "",
      gerente: form.gerente || "",
  status: String(form.status || "Em análise"),
      pago: Boolean(form.pago),
      createdAt: new Date().toISOString(),
    };

    if (editingId) {
      updateSale(editingId, payload);
      setEditingId(null);
    } else {
      addSale(payload);
    }

    setForm({
      id: "",
      dataCompetencia: new Date().toISOString().slice(0, 10),
      dataVencimento: new Date().toISOString().slice(0, 10),
      cliente: "",
      origem: settings.origins[0] ?? "",
      estilo: settings.styles[0] ?? "",
      produto: settings.products[0] ?? "",
      vgv: 0,
      vgc: 0,
      tipo: settings.products[0] ?? "",
      vendedor: "",
      captador: "",
      gerente: "",
      status: "Em análise",
      pago: false,
    });
  };

  const exportColumns = [
    { header: "ID", key: "id" },
    { header: "Comp", key: "dataCompetencia" },
    { header: "Venc", key: "dataVencimento" },
    { header: "Cliente", key: "cliente" },
    { header: "Origem", key: "origem" },
    { header: "Estilo", key: "estilo" },
    { header: "Produto", key: "produto" },
    { header: "VGV", key: "vgv" },
    { header: "VGC", key: "vgc" },
    { header: "Tipo", key: "tipo" },
    { header: "Vendedor", key: "vendedor" },
    { header: "Status", key: "status" },
    { header: "Pago", key: "pago" },
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>{settings.title} — Vendas</title>
        <meta name="description" content="Cadastro e listagem de vendas, com filtros e exportações (CSV, XLSX, PDF)." />
      </Helmet>

      <Tabs defaultValue="cadastrar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cadastrar">Cadastrar</TabsTrigger>
          <TabsTrigger value="listar">Listar</TabsTrigger>
        </TabsList>

        <TabsContent value="cadastrar" className="space-y-4">
          <section aria-labelledby="form-vendas">
            <h1 id="form-vendas" className="text-2xl font-semibold mb-2">Cadastro de Vendas</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-card p-4 rounded-lg border shadow-sm">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={form.id || ""} onChange={(e) => setForm({ ...form, id: e.target.value })} />
              </div>
              <div>
                <Label>Data da Venda</Label>
                <Input type="date" value={form.dataCompetencia || ""} onChange={(e) => setForm({ ...form, dataCompetencia: e.target.value })} />
              </div>
              <div>
                <Label>Data Vencimento</Label>
                <Input type="date" value={form.dataVencimento || ""} onChange={(e) => setForm({ ...form, dataVencimento: e.target.value })} />
              </div>
              <div>
                <Label>Cliente</Label>
                <Input value={form.cliente || ""} onChange={(e) => setForm({ ...form, cliente: e.target.value })} />
              </div>
              <div>
                <Label>Origem</Label>
                <Select value={form.origem} onValueChange={(v) => setForm({ ...form, origem: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {settings.origins.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estilo</Label>
                <Select value={form.estilo} onValueChange={(v) => setForm({ ...form, estilo: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {settings.styles.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Produto</Label>
                <Select value={form.produto} onValueChange={(v) => setForm({ ...form, produto: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {settings.products.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>VGV</Label>
                <Input 
                  type="text" 
                  value={form.vgv ? formatCurrencyBR(form.vgv, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ""} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    const vgv = value ? Number(value) : 0;
                    setForm((f) => ({ ...f, vgv, vgc: f.vgc && editingId ? Number(f.vgc) : recalcVgc(vgv) }));
                  }}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>VGC</Label>
                <Input 
                  type="text" 
                  value={form.vgc ? formatCurrencyBR(form.vgc, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : ""} 
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    const vgc = value ? Number(value) : 0;
                    setForm({ ...form, vgc });
                  }}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {settings.products.map((o) => (<SelectItem key={o} value={o}>{o}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vendedor</Label>
                <Select value={form.vendedor || ""} onValueChange={(v) => setForm({ ...form, vendedor: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o vendedor" /></SelectTrigger>
                  <SelectContent>
                    {settings.brokers && settings.brokers.length > 0 ? (
                      settings.brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.name}>
                          {broker.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Nenhum corretor cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {(!settings.brokers || settings.brokers.length === 0) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Cadastre corretores em Configurações → Corretores
                  </p>
                )}
              </div>
              <div>
                <Label>Captador</Label>
                <Select value={form.captador || ""} onValueChange={(v) => setForm({ ...form, captador: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o captador" /></SelectTrigger>
                  <SelectContent>
                    {settings.brokers && settings.brokers.length > 0 ? (
                      settings.brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.name}>
                          {broker.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Nenhum corretor cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Gerente</Label>
                <Select value={form.gerente || ""} onValueChange={(v) => setForm({ ...form, gerente: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione o gerente" /></SelectTrigger>
                  <SelectContent>
                    {settings.brokers && settings.brokers.length > 0 ? (
                      settings.brokers.map((broker) => (
                        <SelectItem key={broker.id} value={broker.name}>
                          {broker.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Nenhum corretor cadastrado
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Input value={form.status as string} onChange={(e) => setForm({ ...form, status: e.target.value })} />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Checkbox id="pago" checked={!!form.pago} onCheckedChange={(v) => setForm({ ...form, pago: Boolean(v) })} />
                <Label htmlFor="pago">Pago</Label>
              </div>
              <div className="md:col-span-4 flex justify-end gap-2 mt-2">
                <Button onClick={onSubmit}>{editingId ? "Atualizar" : "Adicionar"}</Button>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="listar" className="space-y-4">
          <section aria-labelledby="lista-vendas" className="space-y-3">
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <Label>Período</Label>
                <Select value={filters.period} onValueChange={(v: "mensal" | "anual" | "custom") => setFilters({ ...filters, period: v })}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {filters.period === "custom" && (
                <>
                  <div>
                    <Label>Início</Label>
                    <Input type="date" value={filters.start || ""} onChange={(e) => setFilters({ ...filters, start: e.target.value })} />
                  </div>
                  <div>
                    <Label>Fim</Label>
                    <Input type="date" value={filters.end || ""} onChange={(e) => setFilters({ ...filters, end: e.target.value })} />
                  </div>
                </>
              )}
              <div>
                <Label>Vendedor</Label>
                <Select value={filters.vendedor || "all"} onValueChange={(v) => setFilters({ ...filters, vendedor: v === "all" ? "" : v })}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {vendedores.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={filters.status || "all"} onValueChange={(v) => setFilters({ ...filters, status: v === "all" ? "" : v })}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Todos" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {statuses.map((v) => (<SelectItem key={v} value={v}>{v}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="secondary" onClick={() => exportCSV("vendas", filtered)}>CSV</Button>
                <Button variant="secondary" onClick={() => exportXLSX("vendas", filtered)}>XLSX</Button>
                <Button variant="secondary" onClick={() => exportPDF("vendas", filtered, exportColumns)}>PDF</Button>
              </div>
            </div>

            <h2 id="lista-vendas" className="text-xl font-semibold">Vendas</h2>
            <div className="rounded-lg border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Competência</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>VGV</TableHead>
                    <TableHead>VGC</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s, idx) => (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 + idx * 0.04 }}
                      whileHover={{ scale: 1.02, backgroundColor: "#1e293b" }}
                      className="animate-fade-in"
                    >
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{format(new Date(s.dataCompetencia), 'dd/MM/yyyy')}</TableCell>
                      <TableCell>{s.cliente}</TableCell>
                      <TableCell>{s.vendedor}</TableCell>
                      <TableCell>{formatMoney(s.vgv)}</TableCell>
                      <TableCell>{formatMoney(s.vgc)}</TableCell>
                      <TableCell>{s.status}</TableCell>
                      <TableCell>{s.pago ? "Sim" : "Não"}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="secondary" onClick={() => { setEditingId(s.id); setForm(s); }}>Editar</Button>
                        <Button size="sm" variant="destructive" onClick={() => deleteSale(s.id)}>Excluir</Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

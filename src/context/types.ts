export type Status = "Em análise" | "Aprovada" | "Cancelada" | string;

export interface Sale {
  id: string;
  dataCompetencia: string; // ISO date
  dataVencimento?: string; // ISO date
  cliente?: string;
  origem?: string;
  estilo?: string;
  produto?: string;
  vgv: number; // Valor Geral de Vendas
  vgc: number; // Valor Geral de Comissão (default = vgv * taxa)
  tipo?: string; // Revenda | Lançamento | ...
  vendedor?: string;
  captador?: string;
  gerente?: string;
  status?: Status;
  paid?: boolean;
  pago?: boolean;
  createdAt?: string; // ISO
}

export type StatusVenda = 'PENDENTE' | 'FECHADA' | 'CANCELADA';

export interface Agente {
  id: string;
  user_id?: string;
  nome: string;
  apelido?: string;
  avatar_url?: string;
  ativo: boolean;
  created_at: string;
}

export interface Equipe {
  id: string;
  nome: string;
  descricao?: string;
  created_at: string;
}

export interface Venda {
  id: string;
  agente_id: string;
  equipe_id?: string;
  valor: number;
  origem?: string;
  tipo?: string;
  data_venda: string;
  status: StatusVenda;
  created_at: string;
}

export interface Meta {
  id: string;
  alvo: 'AGENTE' | 'EQUIPE';
  agente_id?: string;
  equipe_id?: string;
  periodo: string;
  meta_vgv: number;
  created_at: string;
}

export interface Lista {
  id: string;
  categoria: 'origens'|'estilos'|'produtos';
  valor: string;
  ordem?: number;
}

export interface Config {
  id: 1;
  titulo: string;
  tema: 'claro'|'escuro'|'auto';
  cor_primaria: string;
  cor_secundaria: string;
  efeitos: { animacoes: boolean; motionReduce: boolean; };
  bg_tipo: 'default'|'url'|'storage'|'preset';
  bg_valor?: string;
  logo_url?: string;
  updated_at: string;
}

import { z } from 'zod';

export const vendaSchema = z.object({
  agente_id: z.string().uuid(),
  equipe_id: z.string().uuid().optional(),
  valor: z.coerce.number().min(0),
  origem: z.string().optional(),
  tipo: z.string().optional(),
  data_venda: z.coerce.date(),
  status: z.enum(['PENDENTE','FECHADA','CANCELADA']).default('PENDENTE'),
});

export const configSchema = z.object({
  titulo: z.string().min(3).max(60),
  tema: z.enum(['claro','escuro','auto']),
  cor_primaria: z.string(),
  cor_secundaria: z.string(),
  efeitos: z.object({ animacoes: z.boolean(), motionReduce: z.boolean() }),
  bg_tipo: z.enum(['default','url','storage','preset']),
  bg_valor: z.string().optional(),
  logo_url: z.string().url().optional(),
});

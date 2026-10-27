import { z } from "zod";
import { urlHttps, HOSTS_CAMARA } from "./url.js";

// As APIs oficiais nem sempre entregam o que a documentação promete.
// Por isso tudo que não é essencial aceita null/ausente.

export const DeputadoSchema = z.object({
  id: z.number(),
  nome: z.string().min(1),
  siglaPartido: z.string().nullish(),
  siglaUf: z.string().nullish(),
  urlFoto: z.string().nullish().transform((v) => urlHttps(v, HOSTS_CAMARA)),
});

export const DespesaSchema = z.object({
  ano: z.coerce.number().int(),
  mes: z.coerce.number().int().min(1).max(12),
  tipoDespesa: z.string().min(1),
  codDocumento: z.union([z.string(), z.number()]).nullish(),
  parcela: z.coerce.number().nullish(),
  dataDocumento: z.string().nullish(),
  nomeFornecedor: z.string().nullish(),
  cnpjCpfFornecedor: z.string().nullish(),
  valorLiquido: z.coerce.number(),
  urlDocumento: z.string().nullish().transform((v) => urlHttps(v)),
});

export const BuscaSchema = z.object({
  q: z.string().trim().max(100).optional(),
  uf: z.string().length(2).toUpperCase().optional(),
  pagina: z.coerce.number().int().min(1).max(1000).default(1),
});

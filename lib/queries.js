import { prisma } from "./prisma";
import { comCache } from "./cache";

const CINCO_MIN = 5 * 60 * 1000;
const DEZ_MIN = 10 * 60 * 1000;

export const POR_PAGINA = 24;

const partidoAtual = {
  filiacoes: { where: { fim: null }, take: 1, include: { partido: true } },
};

export function listarParlamentares({ q, uf, pagina = 1 }) {
  return comCache(`lista:${q ?? ""}|${uf ?? ""}|${pagina}`, CINCO_MIN, () => consultarLista({ q, uf, pagina }));
}

async function consultarLista({ q, uf, pagina }) {
  const where = {
    emExercicio: true,
    ...(q && { nome: { contains: q, mode: "insensitive" } }),
    ...(uf && { uf }),
  };
  const [itens, total] = await Promise.all([
    prisma.parlamentar.findMany({ where, orderBy: { nome: "asc" }, skip: (pagina - 1) * POR_PAGINA, take: POR_PAGINA, include: partidoAtual }),
    prisma.parlamentar.count({ where }),
  ]);
  return { itens, total, paginas: Math.max(1, Math.ceil(total / POR_PAGINA)) };
}

export function buscarParlamentar(id) {
  return comCache(`parl:${id}`, DEZ_MIN, () => prisma.parlamentar.findUnique({ where: { id }, include: partidoAtual }));
}

export function resumoGastos(parlamentarId, anoEscolhido) {
  return comCache(`gastos:${parlamentarId}:${anoEscolhido}`, DEZ_MIN, () => consultarGastos(parlamentarId, anoEscolhido));
}

async function consultarGastos(parlamentarId, anoEscolhido) {
  const anos = await prisma.despesa.groupBy({ by: ["ano"], where: { parlamentarId }, orderBy: { ano: "desc" } });
  if (!anos.length) return null;
  const ano = anos.some((a) => a.ano === anoEscolhido) ? anoEscolhido : anos[0].ano;
  const where = { parlamentarId, ano };
  const [total, categorias, meses, fornecedores] = await Promise.all([
    prisma.despesa.aggregate({ where, _sum: { valor: true }, _count: true }),
    prisma.despesa.groupBy({ by: ["categoria"], where, _sum: { valor: true }, orderBy: { _sum: { valor: "desc" } } }),
    prisma.despesa.groupBy({ by: ["mes"], where, _sum: { valor: true }, orderBy: { mes: "asc" } }),
    prisma.despesa.groupBy({ by: ["fornecedor"], where, _sum: { valor: true }, orderBy: { _sum: { valor: "desc" } }, take: 10 }),
  ]);
  const n = (v) => Number(v ?? 0);
  return {
    ano,
    anos: anos.map((a) => a.ano),
    total: n(total._sum.valor),
    quantidade: total._count,
    categorias: categorias.map((c) => ({ nome: c.categoria, valor: n(c._sum.valor) })),
    meses: meses.map((m) => ({ mes: m.mes, valor: n(m._sum.valor) })),
    fornecedores: fornecedores.map((f) => ({ nome: f.fornecedor ?? "Sem fornecedor informado", valor: n(f._sum.valor) })),
  };
}

export function ultimaColeta(fonte) {
  return comCache(`coleta:${fonte}`, CINCO_MIN, async () => {
    const c = await prisma.coleta.findUnique({ where: { fonte } });
    return c?.ultimaCargaEm ?? null;
  });
}

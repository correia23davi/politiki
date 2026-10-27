// Uso: npm run ingest:camara -- [--ano 2026] [--limite 10]
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { paginar } from "../lib/camara.js";
import { DeputadoSchema, DespesaSchema } from "../lib/schemas.js";

const args = process.argv.slice(2);
const arg = (nome, padrao) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : padrao;
};
const ano = Number(arg("ano", new Date().getFullYear()));
const limite = Number(arg("limite", 0)) || Infinity;

async function carregarDeputados() {
  const vistos = [];
  for await (const lote of paginar("/deputados", { ordenarPor: "nome" })) {
    for (const bruto of lote) {
      const r = DeputadoSchema.safeParse(bruto);
      if (!r.success) { console.warn("Deputado ignorado:", r.error.issues[0]?.message); continue; }
      const d = r.data;
      const p = await prisma.parlamentar.upsert({
        where: { idCamara: d.id },
        create: { idCamara: d.id, nome: d.nome, uf: d.siglaUf ?? "--", fotoUrl: d.urlFoto, emExercicio: true },
        update: { nome: d.nome, uf: d.siglaUf ?? "--", fotoUrl: d.urlFoto, emExercicio: true },
      });
      vistos.push(p.id);
      if (d.siglaPartido) await registrarFiliacao(p.id, d.siglaPartido);
    }
  }
  // quem saiu da lista deixa de estar em exercício, mas o histórico permanece
  await prisma.parlamentar.updateMany({
    where: { casa: "CAMARA", id: { notIn: vistos } },
    data: { emExercicio: false },
  });
  console.log(`Deputados em exercício: ${vistos.length}`);
  return vistos;
}

// Guarda o partido com data: só cria nova filiação se o partido mudou.
async function registrarFiliacao(parlamentarId, sigla) {
  const partido = await prisma.partido.upsert({ where: { sigla }, create: { sigla }, update: {} });
  const atual = await prisma.filiacao.findFirst({ where: { parlamentarId, fim: null }, orderBy: { inicio: "desc" } });
  if (atual?.partidoId === partido.id) return;
  const agora = new Date();
  if (atual) await prisma.filiacao.update({ where: { id: atual.id }, data: { fim: agora } });
  await prisma.filiacao.create({ data: { parlamentarId, partidoId: partido.id, inicio: agora } });
}

async function carregarDespesas(ids) {
  let n = 0;
  for (const id of ids.slice(0, limite)) {
    const p = await prisma.parlamentar.findUnique({ where: { id } });
    const linhas = [];
    for await (const lote of paginar(`/deputados/${p.idCamara}/despesas`, { ano: String(ano) })) {
      for (const bruto of lote) {
        const r = DespesaSchema.safeParse(bruto);
        if (!r.success) { console.warn(`Despesa inválida (${p.nome}):`, r.error.issues[0]?.message); continue; }
        const d = r.data;
        const data = d.dataDocumento ? new Date(d.dataDocumento) : null;
        linhas.push({
          parlamentarId: id,
          ano: d.ano,
          mes: d.mes,
          data: data && !isNaN(data) ? data : null,
          categoria: d.tipoDespesa,
          fornecedor: d.nomeFornecedor ?? null,
          documentoFornecedor: d.cnpjCpfFornecedor ?? null,
          valor: d.valorLiquido,
          urlDocumento: d.urlDocumento ?? null,
          codDocumento: `${d.codDocumento ?? "sd"}-${d.parcela ?? 0}-${linhas.length}`,
        });
      }
    }
    // Recarrega o ano inteiro do parlamentar: as despesas podem ser retificadas na origem.
    await prisma.$transaction([
      prisma.despesa.deleteMany({ where: { parlamentarId: id, ano } }),
      prisma.despesa.createMany({ data: linhas, skipDuplicates: true }),
    ]);
    console.log(`${++n}. ${p.nome}: ${linhas.length} despesas de ${ano}`);
  }
}

try {
  const ids = await carregarDeputados();
  await carregarDespesas(ids);
  await prisma.coleta.upsert({ where: { fonte: "camara" }, create: { fonte: "camara", ultimaCargaEm: new Date() }, update: { ultimaCargaEm: new Date() } });
  console.log("Concluído.");
} finally {
  await prisma.$disconnect();
}

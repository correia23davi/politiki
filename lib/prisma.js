import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

function criarCliente() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada. Copie .env.example para .env e preencha.");
  }
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

// Cliente criado só no primeiro uso: o site abre e as páginas sem banco
// funcionam mesmo sem DATABASE_URL (as demais mostram "fonte indisponível").
export const prisma = new Proxy({}, {
  get(_, prop) {
    globalForPrisma.prisma ??= criarCliente();
    return globalForPrisma.prisma[prop];
  },
});

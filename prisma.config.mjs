import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // O valor padrão só permite gerar o cliente sem banco; db:push exige a URL real.
  datasource: { url: process.env.DATABASE_URL ?? "postgresql://usuario:senha@localhost:5432/politiki" },
});

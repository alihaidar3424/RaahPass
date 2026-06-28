import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma Migrate needs a direct Postgres connection (no PgBouncer pooler).
 * Neon pooler URLs cannot acquire advisory locks used by `migrate deploy`.
 */
export function migrationDatabaseUrl(): string {
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL;
  }

  const databaseUrl = process.env.DATABASE_URL ?? env("DATABASE_URL");

  // Neon: ep-xxx-pooler.region.aws.neon.tech -> ep-xxx.region.aws.neon.tech
  if (databaseUrl.includes("-pooler.")) {
    return databaseUrl.replace("-pooler.", ".");
  }

  return databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationDatabaseUrl(),
  },
});

import { describe, expect, it } from "vitest";
import { normalizePostgresUrl } from "@/lib/postgres-url";

describe("normalizePostgresUrl", () => {
  it("upgrades require/prefer/verify-ca to verify-full", () => {
    expect(
      normalizePostgresUrl(
        "postgresql://u:p@ep-x-pooler.aws.neon.tech/db?sslmode=require&channel_binding=require",
      ),
    ).toContain("sslmode=verify-full");
    expect(
      normalizePostgresUrl("postgresql://u:p@localhost/db?sslmode=prefer"),
    ).toContain("sslmode=verify-full");
    expect(
      normalizePostgresUrl("postgresql://u:p@localhost/db?sslmode=verify-ca"),
    ).toContain("sslmode=verify-full");
  });

  it("leaves verify-full and local urls without sslmode alone", () => {
    const full =
      "postgresql://u:p@ep-x.aws.neon.tech/db?sslmode=verify-full&channel_binding=require";
    expect(normalizePostgresUrl(full)).toContain("sslmode=verify-full");
    expect(normalizePostgresUrl(full)).toContain("channel_binding=require");

    const local = "postgresql://postgres:postgres@localhost:5433/raahpass?schema=public";
    expect(normalizePostgresUrl(local)).toBe(local);
  });
});

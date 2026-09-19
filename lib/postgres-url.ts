/**
 * node-postgres currently treats sslmode=require as verify-full and warns.
 * Prefer an explicit verify-full so behavior stays secure when pg v9 lands.
 */
export function normalizePostgresUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const mode = parsed.searchParams.get("sslmode");
    if (mode === "require" || mode === "prefer" || mode === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
    }
    parsed.searchParams.delete("uselibpqcompat");
    return parsed.toString();
  } catch {
    return url
      .replace(/([?&])sslmode=(prefer|require|verify-ca)\b/i, "$1sslmode=verify-full")
      .replace(/([?&])uselibpqcompat=true&?/i, "$1")
      .replace(/[?&]$/, "");
  }
}

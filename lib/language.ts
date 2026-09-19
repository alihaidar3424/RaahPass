import type { Language } from "@/lib/validations";

export function parseLanguage(value: string | string[] | undefined | null): Language {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "ur" ? "ur" : "en";
}

export function withLang(href: string, lang: Language): string {
  const [path, query = ""] = href.split("?");
  const params = new URLSearchParams(query);
  params.set("lang", lang);
  const next = params.toString();
  return next ? `${path}?${next}` : path;
}

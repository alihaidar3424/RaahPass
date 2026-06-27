import type { Language } from "@/lib/validations";

export function parseLanguage(value: string | string[] | undefined | null): Language {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "ur" ? "ur" : "en";
}

export function withLang(href: string, lang: Language): string {
  const separator = href.includes("?") ? "&" : "?";
  return `${href}${separator}lang=${lang}`;
}

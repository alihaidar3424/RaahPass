import bank from "@/data/traffic-signs.json";
import type { Language } from "@/lib/validations";

export type SignCategory =
  | "regulatory"
  | "warning"
  | "informatory"
  | "markings"
  | "other";

export type TrafficSign = {
  slug: string;
  nameEn: string;
  nameUr: string;
  category: SignCategory;
  image: string;
  descriptionEn: string;
  descriptionUr: string;
  questionIds: string[];
};

const signs = (bank.signs as TrafficSign[]).filter(
  (sign) =>
    Boolean(sign.image) &&
    !sign.image.endsWith("/") &&
    sign.image !== "/signs/quiz/" &&
    !sign.image.startsWith("/signs/quiz/"),
);

export function getAllSigns(): TrafficSign[] {
  return signs;
}

export function getSignBySlug(slug: string): TrafficSign | undefined {
  return signs.find((sign) => sign.slug === slug);
}

export function getSignCategories(): SignCategory[] {
  const present = new Set(signs.map((sign) => sign.category));
  return (bank.categories as SignCategory[]).filter((category) => present.has(category));
}

export function signName(sign: TrafficSign, lang: Language): string {
  return lang === "ur" ? sign.nameUr : sign.nameEn;
}

export function signDescription(sign: TrafficSign, lang: Language): string {
  return lang === "ur" ? sign.descriptionUr : sign.descriptionEn;
}

export function categoryLabel(category: SignCategory, lang: Language): string {
  const labels: Record<SignCategory, { en: string; ur: string }> = {
    regulatory: { en: "Regulatory", ur: "ضابطہ" },
    warning: { en: "Warning", ur: "انتباہ" },
    informatory: { en: "Informatory", ur: "معلوماتی" },
    markings: { en: "Road markings", ur: "سڑک کی لائنیں" },
    other: { en: "Other", ur: "دیگر" },
  };
  return lang === "ur" ? labels[category].ur : labels[category].en;
}

export function filterSigns(opts: {
  query?: string;
  category?: SignCategory | "all";
}): TrafficSign[] {
  const q = opts.query?.trim().toLowerCase() ?? "";
  const category = opts.category ?? "all";

  return signs.filter((sign) => {
    if (category !== "all" && sign.category !== category) return false;
    if (!q) return true;
    return (
      sign.nameEn.toLowerCase().includes(q) ||
      sign.nameUr.includes(q) ||
      sign.slug.includes(q) ||
      sign.descriptionEn.toLowerCase().includes(q) ||
      sign.descriptionUr.includes(q)
    );
  });
}

export const SIGN_COUNT = signs.length;

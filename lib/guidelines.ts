import { prisma } from "@/lib/prisma";
import type { Language } from "@/lib/validations";

export type GuidelineListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  sortOrder: number;
};

export type GuidelineDetail = GuidelineListItem & {
  content: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

function pickLocalized(language: Language, en: string, ur: string): string {
  return language === "ur" ? ur : en;
}

export async function getGuidelines(language: Language): Promise<GuidelineListItem[]> {
  const rows = await prisma.guideline.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { titleEn: "asc" }],
  });

  return rows.map((row) => ({
    slug: row.slug,
    title: pickLocalized(language, row.titleEn, row.titleUr),
    excerpt: pickLocalized(language, row.excerptEn ?? "", row.excerptUr ?? ""),
    category: row.category,
    sortOrder: row.sortOrder,
  }));
}

export async function getGuidelineBySlug(
  slug: string,
  language: Language,
): Promise<GuidelineDetail | null> {
  const row = await prisma.guideline.findFirst({
    where: { slug, isActive: true },
  });

  if (!row) return null;

  return {
    slug: row.slug,
    title: pickLocalized(language, row.titleEn, row.titleUr),
    excerpt: pickLocalized(language, row.excerptEn ?? "", row.excerptUr ?? ""),
    category: row.category,
    sortOrder: row.sortOrder,
    content: pickLocalized(language, row.contentEn, row.contentUr),
    imageUrl: row.imageUrl,
    imageAlt: row.imageUrl
      ? pickLocalized(language, row.imageAltEn ?? "", row.imageAltUr ?? "") || null
      : null,
  };
}

export async function getAdjacentGuidelines(
  slug: string,
  language: Language,
): Promise<{ prev: GuidelineListItem | null; next: GuidelineListItem | null }> {
  const all = await getGuidelines(language);
  const index = all.findIndex((item) => item.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? all[index - 1] : null,
    next: index < all.length - 1 ? all[index + 1] : null,
  };
}

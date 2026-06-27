import { AppShell } from "@/components/layout/AppShell";
import { GuidelineCard } from "@/components/guidelines/GuidelineCard";
import { getGuidelines } from "@/lib/guidelines";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type GuidelinesPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function GuidelinesPage({ searchParams }: GuidelinesPageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";
  const items = await getGuidelines(lang);

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="guidelines"
      showBottomNav
      langBasePath="/guidelines"
    >
      <main className="mx-auto max-w-lg space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t(lang, "guidelinesTitle")}</h1>
          <p className="mt-2 text-slate-600">{t(lang, "guidelinesSubtitle")}</p>
        </div>

        {Object.entries(grouped).map(([category, categoryItems]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {category}
            </h2>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <GuidelineCard key={item.slug} item={item} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </AppShell>
  );
}

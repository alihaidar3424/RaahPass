import { AppShell } from "@/components/layout/AppShell";
import { GuidelineCard } from "@/components/guidelines/GuidelineCard";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
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
    <AppShell lang={lang} rtl={rtl} nav="learn" showBottomNav langBasePath="/guidelines">
      <PageContainer withBottomNav width="content" className="page-stack">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t(lang, "guidelinesTitle")}</h1>
          <p className={mutedTextClassName("mt-2 md:text-base")}>{t(lang, "guidelinesSubtitle")}</p>
        </div>

        {Object.entries(grouped).map(([category, categoryItems]) => (
          <section key={category} className="section-stack">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {category}
            </h2>
            <div className="section-stack">
              {categoryItems.map((item) => (
                <GuidelineCard key={item.slug} item={item} lang={lang} />
              ))}
            </div>
          </section>
        ))}
      </PageContainer>
    </AppShell>
  );
}

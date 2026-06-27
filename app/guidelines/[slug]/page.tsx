import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { GuidelineBody } from "@/components/guidelines/GuidelineBody";
import { LinkButton } from "@/components/ui/Button";
import { getAdjacentGuidelines, getGuidelineBySlug } from "@/lib/guidelines";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type GuidelineArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export default async function GuidelineArticlePage({
  params,
  searchParams,
}: GuidelineArticlePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const lang = await resolveLanguage(query.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  const article = await getGuidelineBySlug(slug, lang);
  if (!article) notFound();

  const { prev, next } = await getAdjacentGuidelines(slug, lang);

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="guidelines"
      showBottomNav
      langBasePath={`/guidelines/${slug}`}
      backHref={withLang("/guidelines", lang)}
    >
      <main className="mx-auto max-w-lg px-4 py-6 pb-24">
        <nav className="mb-3 text-xs text-slate-500">
          {t(lang, "readGuidelines")} / {article.category}
        </nav>
        <h1 className="text-2xl font-bold text-slate-900">{article.title}</h1>
        <p className="mt-2 text-slate-600">{article.excerpt}</p>

        <article className="mt-6">
          <GuidelineBody content={article.content} />
        </article>

        <div className="mt-8 space-y-3">
          <LinkButton href={withLang("/start", lang)} fullWidth>
            {t(lang, "startFromGuideline")}
          </LinkButton>

          <div className="flex gap-3">
            {prev ? (
              <LinkButton
                href={withLang(`/guidelines/${prev.slug}`, lang)}
                variant="secondary"
                className="flex-1"
              >
                ← {t(lang, "prevArticle")}
              </LinkButton>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <LinkButton
                href={withLang(`/guidelines/${next.slug}`, lang)}
                variant="secondary"
                className="flex-1"
              >
                {t(lang, "nextArticle")} →
              </LinkButton>
            ) : null}
          </div>
        </div>
      </main>
    </AppShell>
  );
}

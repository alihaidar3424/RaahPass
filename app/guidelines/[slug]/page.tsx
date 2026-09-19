import { notFound } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { GuidelineBody } from "@/components/guidelines/GuidelineBody";
import { GuidelineSourceFooter } from "@/components/guidelines/GuidelineSourceFooter";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
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
      nav="learn"
      showBottomNav
      langBasePath={`/guidelines/${slug}`}
      backHref={withLang("/guidelines", lang)}
      backLabel={t(lang, "guidelinesNav")}
    >
      <PageContainer withBottomNav className="page-stack">
        <nav className="text-xs text-muted-foreground">
          {t(lang, "readGuidelines")} / {article.category}
        </nav>
        <h1 className="text-2xl font-bold text-foreground">{article.title}</h1>
        <p className={mutedTextClassName()}>{article.excerpt}</p>

        {article.imageUrl ? (
          <figure className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="relative aspect-[4/3] w-full bg-muted/30">
              <Image
                src={article.imageUrl}
                alt={article.imageAlt ?? article.title}
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 640px"
                priority
              />
            </div>
          </figure>
        ) : null}

        <article>
          <GuidelineBody content={article.content} />
        </article>

        {article.source || article.sourceLinks.length > 0 ? (
          <GuidelineSourceFooter
            lang={lang}
            source={article.source}
            links={article.sourceLinks}
          />
        ) : null}

        <div className="section-stack">
          <LinkButton href={withLang("/start", lang)} fullWidth>
            {t(lang, "startFromGuideline")}
          </LinkButton>

          {prev || next ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <LinkButton
                  href={withLang(`/guidelines/${prev.slug}`, lang)}
                  variant="secondary"
                  fullWidth
                >
                  {rtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  {t(lang, "prevArticle")}
                </LinkButton>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <LinkButton
                  href={withLang(`/guidelines/${next.slug}`, lang)}
                  variant="secondary"
                  fullWidth
                  className={!prev ? "sm:col-start-2" : undefined}
                >
                  {t(lang, "nextArticle")}
                  {rtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </LinkButton>
              ) : null}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </AppShell>
  );
}

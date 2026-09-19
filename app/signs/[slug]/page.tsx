import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import {
  categoryLabel,
  getAllSigns,
  getSignBySlug,
  signDescription,
  signName,
} from "@/lib/traffic-signs";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
};

export function generateStaticParams() {
  return getAllSigns().map((sign) => ({ slug: sign.slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lang = await resolveLanguage((await searchParams).lang);
  const sign = getSignBySlug(slug);
  if (!sign) return { title: t(lang, "pageNotFound") };
  return {
    title: `${signName(sign, lang)} | ${t(lang, "signsTitle")}`,
    description: signDescription(sign, lang),
    openGraph: {
      title: signName(sign, lang),
      description: signDescription(sign, lang),
      images: [{ url: sign.image }],
      type: "article",
    },
  };
}

export default async function SignDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const lang = await resolveLanguage((await searchParams).lang);
  const rtl = dirForLanguage(lang) === "rtl";
  const sign = getSignBySlug(slug);
  if (!sign) notFound();

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="signs"
      showBottomNav
      langBasePath={`/signs/${slug}`}
      backHref={withLang("/signs", lang)}
      backLabel={t(lang, "signsTitle")}
    >
      <PageContainer withBottomNav width="shell" className="page-stack">
        <Card className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:gap-8 md:p-8 md:text-start">
          <div className="relative flex h-40 w-full items-center justify-center md:h-48 md:w-48 md:shrink-0">
            <Image
              src={sign.image}
              alt={signName(sign, lang)}
              width={180}
              height={180}
              className="max-h-40 w-auto object-contain md:max-h-44"
              priority
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {categoryLabel(sign.category, lang)}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-card-foreground md:text-3xl">
              {signName(sign, lang)}
            </h1>
            <p className={mutedTextClassName("mt-3 leading-6 md:text-base")}>
              {signDescription(sign, lang)}
            </p>
            {sign.questionIds.length > 0 ? (
              <p className={mutedTextClassName("mt-2 text-xs")}>
                {lang === "ur"
                  ? `اس نشان پر ${sign.questionIds.length} پریکٹس سوالات دستیاب ہیں۔`
                  : `${sign.questionIds.length} practice question(s) use this sign.`}
              </p>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <LinkButton href={withLang("/sign-test", lang)} fullWidth size="lg">
                {t(lang, "relatedPractice")}
              </LinkButton>
              <LinkButton href={withLang("/signs", lang)} fullWidth size="lg" variant="secondary">
                {t(lang, "signsTitle")}
              </LinkButton>
            </div>
          </div>
        </Card>
      </PageContainer>
    </AppShell>
  );
}

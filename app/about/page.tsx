import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { OwnerCard } from "@/components/brand/OwnerCard";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { BRAND } from "@/lib/brand";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { SIGN_QUESTION_COUNT } from "@/lib/sign-quiz";
import { SIGN_COUNT } from "@/lib/traffic-signs";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const lang = await resolveLanguage((await searchParams).lang);
  return { title: t(lang, "aboutTitle"), description: t(lang, "aboutBody") };
}

export default async function AboutPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="home"
      showBottomNav
      langBasePath="/about"
      backHref={withLang("/", lang)}
    >
      <PageContainer withBottomNav width="content" className="page-stack">
        <h1 className="text-2xl font-bold md:text-3xl">{t(lang, "aboutTitle")}</h1>
        <OwnerCard lang={lang} />
        <Card>
          <p className="leading-7 text-card-foreground">{t(lang, "aboutBody")}</p>
          <ul className={mutedTextClassName("mt-4 list-disc space-y-1 ps-5")}>
            <li>
              {SIGN_QUESTION_COUNT} {lang === "ur" ? "سائن ٹیسٹ سوالات" : "sign test questions"}
            </li>
            <li>
              {SIGN_COUNT} {lang === "ur" ? "ٹریفک سائنز" : "traffic signs in gallery"}
            </li>
            <li>247 {lang === "ur" ? "قوانین کے سوالات" : "rules practice questions"}</li>
            <li>{BRAND.nameEn} / {BRAND.nameUr}</li>
          </ul>
        </Card>
        <LinkButton href={withLang("/sign-test", lang)} fullWidth size="lg">
          {t(lang, "startSignTest")}
        </LinkButton>
        <LinkButton href={withLang("/contact", lang)} fullWidth variant="secondary">
          {t(lang, "navContact")}
        </LinkButton>
      </PageContainer>
    </AppShell>
  );
}

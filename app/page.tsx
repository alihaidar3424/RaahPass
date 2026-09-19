import { BookOpen, Calculator, Info, Mail, PlayCircle, TrafficCone } from "lucide-react";
import type { Metadata } from "next";
import { AppLogo } from "@/components/brand/AppLogo";
import { OwnerCard } from "@/components/brand/OwnerCard";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { LICENSE_LABELS, LICENSE_TYPES } from "@/lib/license-types";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";
import { NavLink } from "@/components/ui/NavLink";
import { BRAND } from "@/lib/brand";
import { OWNER } from "@/lib/owner";

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const lang = await resolveLanguage((await searchParams).lang);
  const title = `${BRAND.nameEn} — ${OWNER.nameEn}`;
  return {
    title,
    description: t(lang, "homeSubtitle"),
    openGraph: {
      title,
      description: t(lang, "homeSubtitle"),
      type: "website",
      images: [{ url: "/screenshots/desktop-home.png" }],
    },
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav langBasePath="/">
      <PageContainer withBottomNav width="wide" className="page-stack">
        <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-800 shadow-[var(--shadow-card)] dark:from-emerald-950 dark:via-teal-950 dark:to-emerald-900 md:rounded-3xl">
          <div className="relative grid gap-8 px-6 py-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-10 md:px-10 md:py-14 lg:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.05)_50%,transparent_51%)] bg-[length:40px_100%] opacity-60" />
            <div className="relative flex flex-col items-center gap-5 text-center md:items-start md:text-start">
              <AppLogo
                lang={lang}
                size="hero"
                showTagline
                variant="onDark"
                className="flex-col items-center gap-4 text-center md:items-start md:text-start"
              />
              <p className="max-w-md text-sm leading-7 text-emerald-50/90 md:text-base md:leading-7">
                {t(lang, "homeSubtitle")}
              </p>
              <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:justify-center md:justify-start">
                <LinkButton href={withLang("/sign-test", lang)} fullWidth size="lg" className="sm:flex-1">
                  <PlayCircle className="h-5 w-5" />
                  {t(lang, "startSignTest")}
                </LinkButton>
                <LinkButton
                  href={withLang("/signs", lang)}
                  fullWidth
                  size="lg"
                  variant="secondary"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 sm:flex-1"
                >
                  <TrafficCone className="h-5 w-5" />
                  {t(lang, "learnSigns")}
                </LinkButton>
              </div>
              <p className="text-xs text-emerald-100/70">{t(lang, "trustLine")}</p>
            </div>

            <div className="relative hidden md:grid md:grid-cols-2 md:gap-3">
              {LICENSE_TYPES.map((type) => {
                const label = LICENSE_LABELS[type];
                return (
                  <NavLink
                    key={type}
                    href={withLang(`/sign-test?license=${type}`, lang)}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-5 text-center text-white backdrop-blur-sm transition-colors hover:bg-white/15"
                  >
                    <p className="text-base font-bold">
                      {lang === "ur" ? label.shortUr : label.shortEn}
                    </p>
                    <p className="mt-1 text-xs text-emerald-50/80">
                      {lang === "ur" ? label.ur : label.en}
                    </p>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </section>

        <section className="md:hidden">
          <h2 className="mb-3 text-sm font-semibold text-foreground">{t(lang, "homeCategories")}</h2>
          <div className="grid grid-cols-2 gap-3">
            {LICENSE_TYPES.map((type) => {
              const label = LICENSE_LABELS[type];
              return (
                <NavLink
                  key={type}
                  href={withLang(`/sign-test?license=${type}`, lang)}
                  className="rounded-xl border border-border bg-card p-4 text-center shadow-[var(--shadow-card)] transition-colors hover:border-primary"
                >
                  <p className="text-sm font-bold text-card-foreground">
                    {lang === "ur" ? label.shortUr : label.shortEn}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lang === "ur" ? label.ur : label.en}
                  </p>
                </NavLink>
              );
            })}
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <LinkButton href={withLang("/start", lang)} fullWidth variant="secondary" size="lg">
            <BookOpen className="h-4 w-4" />
            {t(lang, "rulesPractice")}
          </LinkButton>
          <LinkButton href={withLang("/fees", lang)} fullWidth variant="secondary" size="lg">
            <Calculator className="h-4 w-4" />
            {t(lang, "navFees")}
          </LinkButton>
          <LinkButton href={withLang("/about", lang)} fullWidth variant="secondary" size="lg">
            <Info className="h-4 w-4" />
            {t(lang, "navAbout")}
          </LinkButton>
          <LinkButton href={withLang("/contact", lang)} fullWidth variant="secondary" size="lg">
            <Mail className="h-4 w-4" />
            {t(lang, "navContact")}
          </LinkButton>
        </section>

        <OwnerCard lang={lang} />
      </PageContainer>
    </AppShell>
  );
}

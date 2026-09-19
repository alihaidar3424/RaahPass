import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { FeeCalculator } from "@/components/fees/FeeCalculator";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const lang = await resolveLanguage((await searchParams).lang);
  return {
    title: t(lang, "feesTitle"),
    description: t(lang, "feesSubtitle"),
    openGraph: {
      title: t(lang, "feesTitle"),
      description: t(lang, "feesSubtitle"),
      type: "website",
      images: [{ url: "/screenshots/desktop-home.png" }],
    },
  };
}

export default async function FeesPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="fees"
      showBottomNav
      langBasePath="/fees"
      backHref={withLang("/", lang)}
    >
      <PageContainer withBottomNav width="shell" className="page-stack">
        <section>
          <h1 className="text-2xl font-bold md:text-3xl">{t(lang, "feesTitle")}</h1>
          <p className={mutedTextClassName("mt-2 md:text-base")}>{t(lang, "feesSubtitle")}</p>
        </section>
        <FeeCalculator lang={lang} />
      </PageContainer>
    </AppShell>
  );
}

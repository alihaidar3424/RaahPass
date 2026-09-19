import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/ui/PageContainer";
import { SignsGallery } from "@/components/signs/SignsGallery";
import { mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { SIGN_COUNT } from "@/lib/traffic-signs";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const lang = await resolveLanguage((await searchParams).lang);
  return {
    title: t(lang, "signsTitle"),
    description: t(lang, "signsSubtitle"),
    openGraph: {
      title: t(lang, "signsTitle"),
      description: t(lang, "signsSubtitle"),
      type: "website",
      images: [{ url: "/screenshots/desktop-home.png" }],
    },
  };
}

export default async function SignsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="signs"
      showBottomNav
      langBasePath="/signs"
      backHref={withLang("/", lang)}
    >
      <PageContainer withBottomNav width="wide" className="page-stack">
        <section>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t(lang, "signsTitle")}</h1>
          <p className={mutedTextClassName("mt-2 md:text-base")}>
            {t(lang, "signsSubtitle")} ({SIGN_COUNT})
          </p>
        </section>
        <SignsGallery lang={lang} />
      </PageContainer>
    </AppShell>
  );
}

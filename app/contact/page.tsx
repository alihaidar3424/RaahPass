import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { OwnerCard } from "@/components/brand/OwnerCard";
import { ContactForm } from "@/components/contact/ContactForm";
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
  return { title: t(lang, "contactTitle"), description: t(lang, "contactSubtitle") };
}

export default async function ContactPage({ searchParams }: PageProps) {
  const lang = await resolveLanguage((await searchParams).lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="home"
      showBottomNav
      langBasePath="/contact"
      backHref={withLang("/", lang)}
    >
      <PageContainer withBottomNav width="shell" className="page-stack">
        <section>
          <h1 className="text-2xl font-bold md:text-3xl">{t(lang, "contactTitle")}</h1>
          <p className={mutedTextClassName("mt-2 md:text-base")}>{t(lang, "contactSubtitle")}</p>
        </section>
        <OwnerCard lang={lang} />
        <ContactForm lang={lang} />
      </PageContainer>
    </AppShell>
  );
}

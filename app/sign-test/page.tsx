import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { PageContainer } from "@/components/ui/PageContainer";
import { SignTestStartForm } from "@/components/sign-test/SignTestStartForm";
import { mutedTextClassName } from "@/components/ui/Card";
import { isLicenseType } from "@/lib/license-types";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  searchParams: Promise<{ lang?: string; license?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const lang = await resolveLanguage((await searchParams).lang);
  return {
    title: t(lang, "signTestTitle"),
    description: t(lang, "signTestSubtitle"),
    openGraph: {
      title: t(lang, "signTestTitle"),
      description: t(lang, "signTestSubtitle"),
      type: "website",
      images: [{ url: "/screenshots/desktop-home.png" }],
    },
  };
}

export default async function SignTestPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";
  const licenseParam = params.license ?? "";
  const initialLicense = isLicenseType(licenseParam) ? licenseParam : "motorcar";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="sign-test"
      showBottomNav
      langBasePath="/sign-test"
      backHref={withLang("/", lang)}
    >
      <PageContainer withBottomNav width="shell" className="page-stack">
        <section>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{t(lang, "signTestTitle")}</h1>
          <p className={mutedTextClassName("mt-2 leading-6 md:text-base")}>{t(lang, "signTestSubtitle")}</p>
        </section>
        <SignTestStartForm lang={lang} initialLicense={initialLicense} />
      </PageContainer>
    </AppShell>
  );
}

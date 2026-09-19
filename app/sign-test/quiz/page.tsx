import { AppShell } from "@/components/layout/AppShell";
import { SignQuizClient } from "@/components/quiz/SignQuizClient";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { isLicenseType, type LicenseType } from "@/lib/license-types";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type PageProps = {
  searchParams: Promise<{ lang?: string; license?: string }>;
};

export default async function SignTestQuizPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";
  const licenseParam = params.license ?? "";
  const license: LicenseType = isLicenseType(licenseParam) ? licenseParam : "motorcar";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="none"
      langBasePath={`/sign-test/quiz?license=${license}`}
      backHref={withLang("/sign-test", lang)}
      backLabel={t(lang, "signTestTitle")}
    >
      <SignQuizClient language={lang} licenseType={license} />
      <PageContainer className="pb-8">
        <LinkButton href={withLang("/sign-test", lang)} variant="ghost" fullWidth>
          {t(lang, "back")}
        </LinkButton>
      </PageContainer>
    </AppShell>
  );
}

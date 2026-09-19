import { AppShell } from "@/components/layout/AppShell";
import { StartForm } from "@/components/start/StartForm";
import { PageContainer } from "@/components/ui/PageContainer";
import { mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type StartPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function StartPage({ searchParams }: StartPageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="start"
      showBottomNav
      langBasePath="/start"
      backHref={withLang("/", lang)}
      backLabel={t(lang, "navHome")}
    >
      <PageContainer withBottomNav width="shell" className="page-stack">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">{t(lang, "startTestTitle")}</h1>
          <p className={mutedTextClassName()}>{t(lang, "driverExam")}</p>
        </div>
        <StartForm lang={lang} />
      </PageContainer>
    </AppShell>
  );
}

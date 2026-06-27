import { AppShell } from "@/components/layout/AppShell";
import { StartForm } from "@/components/start/StartForm";
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
    >
      <main className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">{t(lang, "startTestTitle")}</h1>
          <p className="text-slate-600">{t(lang, "driverExam")}</p>
        </div>
        <StartForm lang={lang} />
      </main>
    </AppShell>
  );
}

import { BookOpen, PlayCircle, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { parseLanguage, withLang } from "@/lib/language";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t } from "@/lib/translations";

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const lang = await resolveLanguage(params.lang);
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav langBasePath="/">
      <main className="mx-auto max-w-lg space-y-8 px-4 py-8">
        <section className="text-center">
          <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-xl shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-700" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.15)_50%,transparent_51%)] bg-[length:40px_100%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <h1 className="text-3xl font-bold leading-tight text-slate-900">{t(lang, "homeTitle")}</h1>
          <p className="mx-auto mt-3 max-w-sm text-base leading-7 text-slate-600">
            {t(lang, "homeSubtitle")}
          </p>
        </section>

        <section className="space-y-3">
          <LinkButton href={withLang("/start", lang)} fullWidth size="lg">
            <PlayCircle className="h-5 w-5" />
            {t(lang, "startPractice")}
          </LinkButton>
          <LinkButton href={withLang("/guidelines", lang)} fullWidth size="lg" variant="secondary">
            <BookOpen className="h-5 w-5" />
            {t(lang, "readGuidelines")}
          </LinkButton>
          <p className="pt-2 text-center text-xs text-slate-500">{t(lang, "trustLine")}</p>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <div className="col-span-2 rounded-xl border border-l-4 border-l-blue-600 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                Official
              </span>
            </div>
            <h3 className="font-semibold text-slate-900">
              {lang === "ur" ? "ٹریفک سائنز" : "Traffic Signs"}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {lang === "ur"
                ? "247+ سوالات کے ساتھ پاکستان کے قوانین کی مشق"
                : "Practice Pakistan road rules with 247+ questions"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-900">70%</p>
            <p className="text-xs text-slate-500">{lang === "ur" ? "پاس اسکور" : "Pass score"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-bold text-slate-900">20</p>
            <p className="text-xs text-slate-500">{lang === "ur" ? "سوالات" : "Questions"}</p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

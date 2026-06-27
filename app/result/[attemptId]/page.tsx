import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { getResult } from "@/lib/quiz";
import { withLang } from "@/lib/language";
import { dirForLanguage, t, tf } from "@/lib/translations";

type ResultPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { attemptId } = await params;

  let result;
  try {
    result = await getResult(attemptId);
  } catch {
    notFound();
  }

  const lang = result.language;
  const rtl = dirForLanguage(lang) === "rtl";
  const passed = result.status === "PASS";

  return (
    <AppShell lang={lang} rtl={rtl} nav="none">
      <main className="mx-auto max-w-lg px-4 py-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div
            className={`mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 ${
              passed ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
            }`}
          >
            <span className="text-3xl font-black">{Math.round(result.percentage)}%</span>
          </div>

          <h1 className="text-xl font-bold text-slate-900">
            {passed
              ? tf(lang, "congratulations", { name: result.name })
              : tf(lang, "tryAgain", { name: result.name })}
          </h1>

          <p
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {passed ? t(lang, "passed") : t(lang, "failed")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">{t(lang, "correct")}</p>
              <p className="text-lg font-bold text-green-600">{result.correctAnswers}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-slate-500">{t(lang, "wrong")}</p>
              <p className="text-lg font-bold text-red-600">{result.wrongAnswers}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <LinkButton href={`/review/${attemptId}`} fullWidth variant="secondary">
            {t(lang, "viewReview")}
          </LinkButton>
          <LinkButton href={withLang("/start", lang)} fullWidth>
            {t(lang, "newTest")}
          </LinkButton>
        </div>
      </main>
    </AppShell>
  );
}

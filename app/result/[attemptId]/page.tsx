import { AttemptNotFound } from "@/components/quiz/AttemptNotFound";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { getResult } from "@/lib/quiz";
import { isQuizNotFound } from "@/lib/quiz-errors";
import { resolveLanguage } from "@/lib/resolve-language";
import { withLang } from "@/lib/language";
import { dirForLanguage, t, tf } from "@/lib/translations";
import { cn } from "@/lib/utils";

type ResultPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function ResultPage({ params }: ResultPageProps) {
  const { attemptId } = await params;

  let result;
  try {
    result = await getResult(attemptId);
  } catch (error) {
    if (isQuizNotFound(error)) {
      const lang = await resolveLanguage(undefined);
      return <AttemptNotFound lang={lang} />;
    }
    throw error;
  }

  const lang = result.language;
  const rtl = dirForLanguage(lang) === "rtl";
  const passed = result.status === "PASS";

  return (
    <AppShell lang={lang} rtl={rtl} nav="none">
      <PageContainer className="page-stack">
        <Card className="p-6 text-center">
          <div
            className={cn(
              "mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4",
              passed ? "border-success text-success" : "border-destructive text-destructive",
            )}
          >
            <span className="text-3xl font-black">{Math.round(result.percentage)}%</span>
          </div>

          <h1 className="text-xl font-bold text-foreground">
            {passed
              ? tf(lang, "congratulations", { name: result.name })
              : tf(lang, "tryAgain", { name: result.name })}
          </h1>

          <p
            className={cn(
              "mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold",
              passed ? "bg-success-muted text-success" : "bg-destructive-muted text-destructive",
            )}
          >
            {passed ? t(lang, "passed") : t(lang, "failed")}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">{t(lang, "correct")}</p>
              <p className="text-lg font-bold text-success">{result.correctAnswers}</p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <p className="text-muted-foreground">{t(lang, "wrong")}</p>
              <p className="text-lg font-bold text-destructive">{result.wrongAnswers}</p>
            </div>
          </div>
        </Card>

        <div className="section-stack">
          <LinkButton href={`/review/${attemptId}`} fullWidth variant="secondary">
            {t(lang, "viewReview")}
          </LinkButton>
          <LinkButton href={withLang("/start", lang)} fullWidth>
            {t(lang, "newTest")}
          </LinkButton>
        </div>
      </PageContainer>
    </AppShell>
  );
}

import { AttemptNotFound } from "@/components/quiz/AttemptNotFound";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { getReview } from "@/lib/quiz";
import { isQuizNotFound } from "@/lib/quiz-errors";
import { resolveLanguage } from "@/lib/resolve-language";
import { dirForLanguage, t, tf } from "@/lib/translations";

type ReviewPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { attemptId } = await params;

  let review;
  try {
    review = await getReview(attemptId);
  } catch (error) {
    if (isQuizNotFound(error)) {
      const lang = await resolveLanguage(undefined);
      return <AttemptNotFound lang={lang} />;
    }
    throw error;
  }

  const lang = review.language;
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="none">
      <PageContainer className="page-stack">
        <h1 className="text-xl font-bold text-foreground">{t(lang, "answerReview")}</h1>

        <div className="section-stack">
          {review.questions.map((question, index) => {
            const selectedLabel =
              question.options.find((o) => o.key === question.selectedOption)?.label ?? "—";
            const correctLabel =
              question.options.find((o) => o.key === question.correctOption)?.label ??
              question.correctOption;
            const explanation = question.explanation.trim() || t(lang, "noExplanation");

            return (
              <Card
                key={question.attemptQuestionId}
                accent={question.isCorrect ? "success" : "danger"}
              >
                <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                  {tf(lang, "questionOf", {
                    current: index + 1,
                    total: review.questions.length,
                  })}
                </p>
                <h2 className="text-base font-semibold leading-7 text-card-foreground">
                  {question.questionText}
                </h2>

                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">{t(lang, "yourAnswer")}</dt>
                    <dd className={question.isCorrect ? "text-success" : "text-destructive"}>
                      {question.selectedOption
                        ? `${question.selectedOption}. ${selectedLabel}`
                        : "—"}
                    </dd>
                  </div>
                  {!question.isCorrect ? (
                    <div>
                      <dt className="font-medium text-muted-foreground">
                        {t(lang, "correctAnswer")}
                      </dt>
                      <dd className="text-success">
                        {question.correctOption}. {correctLabel}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="font-medium text-muted-foreground">{t(lang, "explanation")}</dt>
                    <dd className="text-muted-foreground">{explanation}</dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>

        <LinkButton href={`/result/${attemptId}`} fullWidth variant="secondary">
          {t(lang, "backToResult")}
        </LinkButton>
      </PageContainer>
    </AppShell>
  );
}

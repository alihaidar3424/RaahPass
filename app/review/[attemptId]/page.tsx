import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { getReview } from "@/lib/quiz";
import { dirForLanguage, t, tf } from "@/lib/translations";

type ReviewPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { attemptId } = await params;

  let review;
  try {
    review = await getReview(attemptId);
  } catch {
    notFound();
  }

  const lang = review.language;
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell lang={lang} rtl={rtl} nav="none">
      <main className="mx-auto max-w-lg px-4 py-6">
        <h1 className="mb-4 text-xl font-bold text-slate-900">{t(lang, "answerReview")}</h1>

        <div className="space-y-4">
          {review.questions.map((question, index) => {
            const selectedLabel =
              question.options.find((option) => option.key === question.selectedOption)
                ?.label ?? "—";
            const correctLabel =
              question.options.find((option) => option.key === question.correctOption)
                ?.label ?? question.correctOption;
            const explanation =
              question.explanation.trim() || t(lang, "noExplanation");

            return (
              <article
                key={question.attemptQuestionId}
                className={`rounded-xl border bg-white p-4 shadow-sm ${
                  question.isCorrect ? "border-green-200" : "border-red-200"
                }`}
              >
                <p className="mb-2 text-xs font-medium uppercase text-slate-500">
                  {tf(lang, "questionOf", {
                    current: index + 1,
                    total: review.questions.length,
                  })}
                </p>
                <h2 className="text-base font-semibold leading-7 text-slate-900">
                  {question.questionText}
                </h2>

                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-slate-500">{t(lang, "yourAnswer")}</dt>
                    <dd className={question.isCorrect ? "text-green-700" : "text-red-700"}>
                      {question.selectedOption
                        ? `${question.selectedOption}. ${selectedLabel}`
                        : "—"}
                    </dd>
                  </div>
                  {!question.isCorrect ? (
                    <div>
                      <dt className="font-medium text-slate-500">{t(lang, "correctAnswer")}</dt>
                      <dd className="text-green-700">
                        {question.correctOption}. {correctLabel}
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="font-medium text-slate-500">{t(lang, "explanation")}</dt>
                    <dd className="text-slate-700">{explanation}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>

        <div className="mt-6 pb-8">
          <LinkButton href={`/result/${attemptId}`} fullWidth variant="secondary">
            {t(lang, "backToResult")}
          </LinkButton>
        </div>
      </main>
    </AppShell>
  );
}

"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CorrectOption } from "@/generated/prisma/client";
import { OptionButton } from "@/components/quiz/OptionButton";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { QuestionGrid } from "@/components/quiz/QuestionGrid";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { quizProgressKey } from "@/lib/constants";
import { submitQuizAndRedirect, type QuizQuestionDto } from "@/lib/quiz";
import { dirForLanguage, t, tf } from "@/lib/translations";
import type { Language } from "@/lib/validations";
import { QUIZ_SIZE } from "@/lib/validations";

type QuizClientProps = {
  attemptId: string;
  language: Language;
  questions: QuizQuestionDto[];
};

type SavedProgress = {
  answers: Record<string, CorrectOption>;
  index: number;
};

function storageKey(attemptId: string) {
  return quizProgressKey(attemptId);
}

export function QuizClient({ attemptId, language, questions }: QuizClientProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CorrectOption>>({});
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const rtl = dirForLanguage(language) === "rtl";
  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const questionIds = useMemo(
    () => questions.map((question) => question.attemptQuestionId),
    [questions],
  );

  const payload = useMemo(
    () =>
      questions.map((question) => ({
        attemptQuestionId: question.attemptQuestionId,
        selectedOption: answers[question.attemptQuestionId],
      })),
    [answers, questions],
  );

  useEffect(() => {
    const raw = sessionStorage.getItem(storageKey(attemptId));
    if (raw) {
      try {
        const saved = JSON.parse(raw) as SavedProgress;
        setAnswers(saved.answers ?? {});
        setIndex(saved.index ?? 0);
      } catch {
        sessionStorage.removeItem(storageKey(attemptId));
      }
    }
    setHydrated(true);
  }, [attemptId]);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(storageKey(attemptId), JSON.stringify({ answers, index }));
  }, [answers, index, attemptId, hydrated]);

  function selectOption(option: CorrectOption) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.attemptQuestionId]: option }));
  }

  function firstUnansweredIndex(): number {
    const idx = questions.findIndex((q) => !answers[q.attemptQuestionId]);
    return idx === -1 ? 0 : idx;
  }

  function handleSubmit() {
    if (answeredCount < QUIZ_SIZE) {
      setError(t(language, "allQuestionsRequired"));
      setIndex(firstUnansweredIndex());
      return;
    }
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError(t(language, "offlineMessage"));
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await submitQuizAndRedirect({
          attemptId,
          answers: payload as { attemptQuestionId: string; selectedOption: CorrectOption }[],
        });
        sessionStorage.removeItem(storageKey(attemptId));
      } catch {
        setError(t(language, "errorAlreadySubmitted"));
      }
    });
  }

  if (!hydrated || !current) {
    return (
      <PageContainer>
        <p className="text-center text-muted-foreground">{t(language, "loading")}</p>
      </PageContainer>
    );
  }

  return (
    <div dir={dirForLanguage(language)} className={rtl ? "urdu-text" : ""}>
      <PageContainer className="section-stack">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{tf(language, "questionOf", { current: index + 1, total: QUIZ_SIZE })}</span>
          <span>
            {answeredCount}/{QUIZ_SIZE}
          </span>
        </div>

        <ProgressBar current={index + 1} total={QUIZ_SIZE} />
        <QuestionGrid
          total={questions.length}
          currentIndex={index}
          answers={answers}
          questionIds={questionIds}
          onJump={setIndex}
        />

        <Card>
          <h2 className="text-lg font-semibold leading-7 text-card-foreground">
            {current.questionText}
          </h2>
        </Card>

        <div className="flex flex-col gap-3">
          {current.options.map((option) => (
            <OptionButton
              key={option.key}
              optionKey={option.key}
              label={option.label}
              selected={answers[current.attemptQuestionId] === option.key}
              onSelect={selectOption}
              rtl={rtl}
            />
          ))}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            disabled={index === 0}
            onClick={() => setIndex((v) => Math.max(0, v - 1))}
          >
            {t(language, "previous")}
          </Button>
          {index < questions.length - 1 ? (
            <Button type="button" className="flex-1" onClick={() => setIndex((v) => v + 1)}>
              {t(language, "next")}
            </Button>
          ) : (
            <Button type="button" className="flex-1" disabled={isPending} onClick={handleSubmit}>
              {isPending ? t(language, "submitting") : t(language, "submitTest")}
            </Button>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

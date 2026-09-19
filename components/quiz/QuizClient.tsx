"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { CorrectOption } from "@/generated/prisma/client";
import { OptionButton } from "@/components/quiz/OptionButton";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { QuestionGrid } from "@/components/quiz/QuestionGrid";
import { QuizSkeleton } from "@/components/quiz/QuizSkeleton";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { quizProgressKey } from "@/lib/constants";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import { submitQuizAndRedirect, type QuizQuestionDto } from "@/lib/quiz";
import { dirForLanguage, t, tf } from "@/lib/translations";
import type { Language } from "@/lib/validations";
import { QUIZ_DURATION_MS, QUIZ_SIZE } from "@/lib/validations";
import { cn } from "@/lib/utils";

type QuizClientProps = {
  attemptId: string;
  language: Language;
  questions: QuizQuestionDto[];
};

type SavedProgress = {
  answers: Record<string, CorrectOption>;
  index: number;
  startedAt: number;
};

function storageKey(attemptId: string) {
  return quizProgressKey(attemptId);
}

function buildSubmitPayload(
  questions: QuizQuestionDto[],
  answers: Record<string, CorrectOption>,
) {
  return questions.map((question) => ({
    attemptQuestionId: question.attemptQuestionId,
    ...(answers[question.attemptQuestionId]
      ? { selectedOption: answers[question.attemptQuestionId] }
      : {}),
  }));
}

export function QuizClient({ attemptId, language, questions }: QuizClientProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, CorrectOption>>({});
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(QUIZ_DURATION_MS);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isLockedRef = useRef(false);

  const rtl = dirForLanguage(language) === "rtl";
  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const questionIds = useMemo(
    () => questions.map((question) => question.attemptQuestionId),
    [questions],
  );
  const isLocked = isPending || submitted;

  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  useEffect(() => {
    let cancelled = false;
    const now = Date.now();

    queueMicrotask(() => {
      if (cancelled) return;
      const raw = sessionStorage.getItem(storageKey(attemptId));
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<SavedProgress>;
          setAnswers(saved.answers ?? {});
          setIndex(saved.index ?? 0);
          setStartedAt(saved.startedAt ?? now);
        } catch {
          sessionStorage.removeItem(storageKey(attemptId));
          setStartedAt(now);
        }
      } else {
        setStartedAt(now);
      }
      setHydrated(true);
    });

    return () => {
      cancelled = true;
    };
  }, [attemptId]);

  useEffect(() => {
    if (!hydrated || startedAt === null) return;
    sessionStorage.setItem(
      storageKey(attemptId),
      JSON.stringify({ answers, index, startedAt }),
    );
  }, [answers, index, startedAt, attemptId, hydrated]);

  useEffect(() => {
    if (!hydrated || startedAt === null) return;

    const tick = () => {
      setRemainingMs(Math.max(0, QUIZ_DURATION_MS - (Date.now() - startedAt)));
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [hydrated, startedAt]);

  const submitTest = useCallback(
    (timedOut: boolean) => {
      if (submitted || isPending) return;

      if (!timedOut && answeredCount < QUIZ_SIZE) {
        const firstUnanswered = questions.findIndex((q) => !answers[q.attemptQuestionId]);
        setError(t(language, "allQuestionsRequired"));
        setIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
        return;
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setError(t(language, "offlineMessage"));
        return;
      }

      setSubmitted(true);
      setError(timedOut ? t(language, "timeUp") : null);

      startTransition(async () => {
        try {
          await submitQuizAndRedirect({
            attemptId,
            timedOut,
            answers: buildSubmitPayload(questions, answers),
          });
          sessionStorage.removeItem(storageKey(attemptId));
        } catch {
          setSubmitted(false);
          setError(t(language, "errorAlreadySubmitted"));
        }
      });
    },
    [answeredCount, answers, attemptId, isPending, language, questions, submitted],
  );

  useEffect(() => {
    if (!hydrated || startedAt === null || remainingMs > 0) return;
    const timer = window.setTimeout(() => submitTest(true), 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, remainingMs, startedAt, submitTest]);

  const jumpToQuestion = useDebouncedCallback((nextIndex: number) => {
    if (isLockedRef.current) return;
    setIndex(nextIndex);
  }, 120);

  function selectOption(option: CorrectOption) {
    if (!current || isLocked) return;
    setAnswers((prev) => ({ ...prev, [current.attemptQuestionId]: option }));
  }

  if (!hydrated || !current || startedAt === null) {
    return <QuizSkeleton />;
  }

  return (
    <div dir={dirForLanguage(language)} className={cn("relative", rtl && "urdu-text")}>
      {isPending ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-[1px]"
          aria-live="polite"
          aria-busy
        >
          <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium text-foreground shadow-md">
            <Spinner className="size-4" />
            {t(language, "submitting")}
          </div>
        </div>
      ) : null}

      <PageContainer className={cn("section-stack", isPending && "pointer-events-none")} width="shell">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span>{tf(language, "questionOf", { current: index + 1, total: QUIZ_SIZE })}</span>
          <QuizTimer remainingMs={remainingMs} language={language} />
          <span className="ms-auto tabular-nums">
            {answeredCount}/{QUIZ_SIZE}
          </span>
        </div>

        <ProgressBar current={index + 1} total={QUIZ_SIZE} />
        <QuestionGrid
          total={questions.length}
          currentIndex={index}
          answers={answers}
          questionIds={questionIds}
          disabled={isLocked}
          onJump={jumpToQuestion}
        />

        <Card className="flex flex-col gap-4">
          {current.imageUrl ? (
            <div className="relative flex h-44 w-full items-center justify-center rounded-lg bg-muted/40">
              <Image
                src={current.imageUrl}
                alt={current.imageAlt ?? ""}
                width={180}
                height={180}
                className="max-h-40 w-auto object-contain"
                priority
              />
            </div>
          ) : null}
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
              disabled={isLocked}
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
            disabled={index === 0 || isLocked}
            onClick={() => setIndex((v) => Math.max(0, v - 1))}
          >
            {t(language, "previous")}
          </Button>
          {index < questions.length - 1 ? (
            <Button
              type="button"
              className="flex-1"
              disabled={isLocked}
              onClick={() => setIndex((v) => v + 1)}
            >
              {t(language, "next")}
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              loading={isPending}
              disabled={isLocked}
              onClick={() => submitTest(false)}
            >
              {t(language, "submitTest")}
            </Button>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

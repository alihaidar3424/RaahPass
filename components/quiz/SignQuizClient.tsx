"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { OptionButton } from "@/components/quiz/OptionButton";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { QuestionGrid } from "@/components/quiz/QuestionGrid";
import { QuizSkeleton } from "@/components/quiz/QuizSkeleton";
import { QuizSpeechControls } from "@/components/quiz/QuizSpeechControls";
import { QuizTimer } from "@/components/quiz/QuizTimer";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import type { LicenseType } from "@/lib/license-types";
import {
  localizeSignQuestionsByIds,
  sampleSignQuestions,
  scoreSignSession,
  type SignOptionKey,
  type SignQuizQuestion,
} from "@/lib/sign-quiz";
import {
  getSignSessionSnapshot,
  writeSignSession,
  type SignSessionPayload,
} from "@/lib/sign-session";
import {
  canUseSpeechRecognition,
  canUseSpeechSynthesis,
  createSpeechListener,
  matchSpokenOption,
  speakQuestion,
  stopSpeaking,
} from "@/lib/speech";
import { withLang } from "@/lib/language";
import { dirForLanguage, t, tf } from "@/lib/translations";
import type { Language } from "@/lib/validations";
import { QUIZ_DURATION_MS, QUIZ_SIZE } from "@/lib/validations";
import { cn } from "@/lib/utils";

type SignQuizClientProps = {
  language: Language;
  licenseType: LicenseType;
};

export function SignQuizClient({ language, licenseType }: SignQuizClientProps) {
  const router = useRouter();
  const sessionKey = `${language}:${licenseType}`;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, SignOptionKey>>({});
  const [questions, setQuestions] = useState<SignQuizQuestion[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(QUIZ_DURATION_MS);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [listening, setListening] = useState(false);
  const bootKeyRef = useRef(sessionKey);
  const bootGenerationRef = useRef(0);
  const listenerRef = useRef<ReturnType<typeof createSpeechListener>>(null);
  const currentRef = useRef<SignQuizQuestion | undefined>(undefined);
  const submittedRef = useRef(false);

  const speakerSupported = useSyncExternalStore(
    () => () => {},
    canUseSpeechSynthesis,
    () => false,
  );
  const micSupported = useSyncExternalStore(
    () => () => {},
    canUseSpeechRecognition,
    () => false,
  );

  const rtl = dirForLanguage(language) === "rtl";
  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const questionIds = useMemo(() => questions.map((q) => q.id), [questions]);

  useEffect(() => {
    currentRef.current = current;
    submittedRef.current = submitted;
  }, [current, submitted]);

  useEffect(() => {
    if (!canUseSpeechSynthesis()) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoices);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const generation = ++bootGenerationRef.current;
    setHydrated(false);

    queueMicrotask(() => {
      if (cancelled || generation !== bootGenerationRef.current) return;
      bootKeyRef.current = sessionKey;
      const now = Date.now();
      const saved = getSignSessionSnapshot();

      if (
        saved &&
        !saved.finished &&
        saved.licenseType === licenseType &&
        Array.isArray(saved.questions) &&
        saved.questions.length > 0 &&
        typeof saved.startedAt === "number" &&
        now - saved.startedAt < QUIZ_DURATION_MS
      ) {
        const ids = saved.questions.map((q) => q.id);
        // Always re-localize from the bank — session may store the wrong language
        // text after a lang switch race (persist before boot finishes).
        const localized = localizeSignQuestionsByIds(ids, language);

        if (localized.length === saved.questions.length) {
          setQuestions(localized);
          setAnswers(saved.answers ?? {});
          setIndex(Math.min(saved.index ?? 0, localized.length - 1));
          setStartedAt(saved.startedAt);
          setSubmitted(false);
          setError(null);
          setRemainingMs(Math.max(0, QUIZ_DURATION_MS - (now - saved.startedAt)));
          setHydrated(true);
          return;
        }
      }

      const sampled = sampleSignQuestions(language, licenseType, QUIZ_SIZE);
      setQuestions(sampled);
      setStartedAt(now);
      setAnswers({});
      setIndex(0);
      setSubmitted(false);
      setError(null);
      setRemainingMs(QUIZ_DURATION_MS);
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, [language, licenseType, sessionKey]);

  useEffect(() => {
    if (!hydrated || startedAt === null || questions.length === 0 || submitted) return;
    if (bootKeyRef.current !== sessionKey) return;
    const payload: SignSessionPayload = {
      questions,
      answers,
      index,
      startedAt,
      language,
      licenseType,
    };
    writeSignSession(payload);
  }, [answers, hydrated, index, language, licenseType, questions, sessionKey, startedAt, submitted]);

  useEffect(() => {
    if (!hydrated || startedAt === null) return;
    const tick = () => {
      setRemainingMs(Math.max(0, QUIZ_DURATION_MS - (Date.now() - startedAt)));
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [hydrated, startedAt]);

  const finish = useCallback(
    (timedOut: boolean) => {
      if (submitted || questions.length === 0) return;
      if (!timedOut && answeredCount < questions.length) {
        const first = questions.findIndex((q) => !answers[q.id]);
        setError(t(language, "allQuestionsRequired"));
        setIndex(first === -1 ? 0 : first);
        return;
      }
      stopSpeaking();
      listenerRef.current?.stop();
      setListening(false);
      setSubmitted(true);
      const result = scoreSignSession(questions, answers, language, licenseType);
      const payload: SignSessionPayload = {
        questions,
        answers,
        index,
        startedAt: startedAt ?? Date.now(),
        language,
        licenseType,
        finished: true,
        result,
      };
      writeSignSession(payload);
      router.push(withLang("/sign-test/result", language));
    },
    [answeredCount, answers, index, language, licenseType, questions, router, startedAt, submitted],
  );

  useEffect(() => {
    if (!hydrated || startedAt === null || remainingMs > 0) return;
    const timer = window.setTimeout(() => finish(true), 0);
    return () => window.clearTimeout(timer);
  }, [finish, hydrated, remainingMs, startedAt]);

  const jumpToQuestion = useDebouncedCallback((nextIndex: number) => {
    setIndex(nextIndex);
  }, 120);

  function selectOption(option: SignOptionKey) {
    if (!current || submitted) return;
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  }

  const replayQuestion = useCallback(() => {
    if (!current || !speakerOn || !speakerSupported) return;
    speakQuestion(current.questionText, current.options, language);
  }, [current, language, speakerOn, speakerSupported]);

  useEffect(() => {
    if (!hydrated || !current || submitted || !speakerOn || !speakerSupported) {
      stopSpeaking();
      return;
    }
    const question = current;
    const timer = window.setTimeout(() => {
      speakQuestion(question.questionText, question.options, language);
    }, 250);
    return () => {
      window.clearTimeout(timer);
      stopSpeaking();
    };
  }, [current, hydrated, language, speakerOn, speakerSupported, submitted]);

  useEffect(() => {
    let cancelled = false;
    listenerRef.current?.stop();
    listenerRef.current = null;

    queueMicrotask(() => {
      if (cancelled) return;
      setListening(false);
    });

    if (!hydrated || submitted || !micOn || !micSupported) return;

    const listener = createSpeechListener({
      language,
      onTranscript: (transcript, isFinal) => {
        if (!isFinal) return;
        const q = currentRef.current;
        if (!q || submittedRef.current) return;
        const matched = matchSpokenOption(transcript, q.options);
        if (matched) {
          setAnswers((prev) => ({ ...prev, [q.id]: matched }));
        }
      },
      onError: () => {
        queueMicrotask(() => {
          if (!cancelled) setListening(false);
        });
      },
    });

    if (!listener) {
      queueMicrotask(() => {
        if (!cancelled) setMicOn(false);
      });
      return;
    }

    listenerRef.current = listener;
    listener.start();
    queueMicrotask(() => {
      if (!cancelled) setListening(true);
    });

    return () => {
      cancelled = true;
      listener.stop();
      listenerRef.current = null;
    };
  }, [hydrated, language, micOn, micSupported, submitted]);

  useEffect(() => {
    return () => {
      stopSpeaking();
      listenerRef.current?.stop();
    };
  }, []);

  if (!hydrated || !current || startedAt === null) {
    return <QuizSkeleton />;
  }

  return (
    <div dir={dirForLanguage(language)} className={cn(rtl && "urdu-text")}>
      <PageContainer className="section-stack" width="shell">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <span>
            {tf(language, "questionOf", { current: index + 1, total: questions.length })}
          </span>
          <QuizTimer remainingMs={remainingMs} language={language} />
          <span className="ms-auto tabular-nums">
            {answeredCount}/{questions.length}
          </span>
        </div>

        <QuizSpeechControls
          language={language}
          speakerOn={speakerOn}
          micOn={micOn}
          speakerSupported={speakerSupported}
          micSupported={micSupported}
          listening={listening}
          onToggleSpeaker={() => {
            setSpeakerOn((v) => {
              if (v) stopSpeaking();
              return !v;
            });
          }}
          onToggleMic={() => setMicOn((v) => !v)}
          onReplay={replayQuestion}
        />

        {micOn && listening ? (
          <p className={mutedTextClassName("text-center text-xs")}>
            {t(language, "speechListening")} — {t(language, "speechMicHint")}
          </p>
        ) : null}
        {!speakerSupported && !micSupported ? (
          <p className={mutedTextClassName("text-center text-xs")}>
            {t(language, "speechUnsupported")}
          </p>
        ) : null}

        <ProgressBar current={index + 1} total={questions.length} />
        <QuestionGrid
          total={questions.length}
          currentIndex={index}
          answers={answers}
          questionIds={questionIds}
          onJump={jumpToQuestion}
        />

        <Card className="flex flex-col items-center gap-4">
          <div className="relative flex h-56 w-full items-center justify-center rounded-xl bg-muted/40 p-4 sm:h-64">
            <Image
              src={current.image}
              alt={current.questionText}
              width={280}
              height={280}
              className="max-h-48 w-auto object-contain sm:max-h-56"
              priority
            />
          </div>
          <h2 className="w-full text-lg font-semibold leading-7 text-card-foreground">
            {current.questionText}
          </h2>
        </Card>

        <div className="flex flex-col gap-3">
          {current.options.map((option) => (
            <OptionButton
              key={option.key}
              optionKey={option.key}
              label={option.label}
              selected={answers[current.id] === option.key}
              disabled={submitted}
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
            disabled={index === 0 || submitted}
            onClick={() => setIndex((v) => Math.max(0, v - 1))}
          >
            {t(language, "previous")}
          </Button>
          {index < questions.length - 1 ? (
            <Button
              type="button"
              className="flex-1"
              disabled={submitted}
              onClick={() => setIndex((v) => v + 1)}
            >
              {t(language, "next")}
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              disabled={submitted}
              onClick={() => finish(false)}
            >
              {t(language, "submitTest")}
            </Button>
          )}
        </div>
      </PageContainer>
    </div>
  );
}

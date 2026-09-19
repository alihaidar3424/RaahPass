"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { withLang } from "@/lib/language";
import {
  getSignSessionServerSnapshot,
  getSignSessionSnapshot,
  subscribeSignSession,
} from "@/lib/sign-session";
import { dirForLanguage, t } from "@/lib/translations";
import type { Language } from "@/lib/validations";
import { cn } from "@/lib/utils";

type SignTestReviewClientProps = {
  fallbackLang?: Language;
};

export function SignTestReviewClient({ fallbackLang = "en" }: SignTestReviewClientProps) {
  const stored = useSyncExternalStore(
    subscribeSignSession,
    getSignSessionSnapshot,
    getSignSessionServerSnapshot,
  );
  const [wrongOnly, setWrongOnly] = useState(true);

  const data = stored?.finished && stored.result ? stored.result : null;

  const rows = useMemo(() => {
    if (!data) return [];
    return data.questions
      .map((q, i) => ({
        q,
        i,
        selected: data.answers[q.id],
        ok: data.answers[q.id] === q.correct,
      }))
      .filter((row) => (wrongOnly ? !row.ok : true));
  }, [data, wrongOnly]);

  if (stored === null && typeof window === "undefined") {
    return (
      <AppShell lang={fallbackLang} nav="none">
        <PageContainer className="py-16 text-center" width="shell">
          {t(fallbackLang, "loading")}
        </PageContainer>
      </AppShell>
    );
  }

  if (!data) {
    return (
      <AppShell lang={fallbackLang} nav="sign-test" showBottomNav langBasePath="/sign-test/review">
        <PageContainer withBottomNav className="page-stack text-center" width="shell">
          <p>{t(fallbackLang, "sessionExpired")}</p>
          <LinkButton href={withLang("/sign-test", fallbackLang)}>
            {t(fallbackLang, "startSignTest")}
          </LinkButton>
        </PageContainer>
      </AppShell>
    );
  }

  const lang = data.language;
  const rtl = dirForLanguage(lang) === "rtl";

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="sign-test"
      showBottomNav
      langBasePath="/sign-test/review"
      backHref={withLang("/sign-test/result", lang)}
      backLabel={t(lang, "backToResult")}
    >
      <PageContainer withBottomNav className="page-stack" width="shell">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{t(lang, "answerReview")}</h1>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setWrongOnly(true)}
              className={cn(
                "min-h-11 rounded-xl border px-3 text-sm font-semibold",
                wrongOnly
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {t(lang, "reviewWrongOnly")}
            </button>
            <button
              type="button"
              onClick={() => setWrongOnly(false)}
              className={cn(
                "min-h-11 rounded-xl border px-3 text-sm font-semibold",
                !wrongOnly
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {t(lang, "reviewAll")}
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <Card>
            <p className="text-center font-medium text-success">{t(lang, "passed")}</p>
            <p className={mutedTextClassName("mt-2 text-center")}>
              {data.wrongCount === 0
                ? lang === "ur"
                  ? "تمام جوابات درست ہیں۔"
                  : "All answers were correct."
                : t(lang, "noSignsFound")}
            </p>
          </Card>
        ) : (
          <ul className="section-stack">
            {rows.map(({ q, i, selected, ok }) => {
              const selectedLabel = q.options.find((o) => o.key === selected)?.label;
              const correctLabel = q.options.find((o) => o.key === q.correct)?.label;
              return (
                <li key={q.id}>
                  <Card accent={ok ? "success" : "danger"} className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      {i + 1}/{data.questions.length}
                    </p>
                    <div className="relative flex h-28 w-full items-center justify-center rounded-lg bg-muted/40">
                      <Image
                        src={q.image}
                        alt={q.questionText}
                        width={160}
                        height={160}
                        className="max-h-36 w-auto object-contain"
                      />
                    </div>
                    <p className="font-semibold text-card-foreground">{q.questionText}</p>
                    <p className={cn("text-sm", ok ? "text-success" : "text-destructive")}>
                      {t(lang, "yourAnswer")}: {selected ? `${selected}. ${selectedLabel}` : "—"}
                    </p>
                    {!ok ? (
                      <p className="text-sm text-success">
                        {t(lang, "correctAnswer")}: {q.correct}. {correctLabel}
                      </p>
                    ) : null}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}

        <LinkButton href={withLang("/sign-test/result", lang)} fullWidth variant="secondary">
          {t(lang, "backToResult")}
        </LinkButton>
      </PageContainer>
    </AppShell>
  );
}

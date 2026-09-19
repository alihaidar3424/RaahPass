"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { LICENSE_LABELS } from "@/lib/license-types";
import { withLang } from "@/lib/language";
import {
  getSignSessionServerSnapshot,
  getSignSessionSnapshot,
  subscribeSignSession,
} from "@/lib/sign-session";
import { dirForLanguage, t, tf } from "@/lib/translations";
import type { Language } from "@/lib/validations";
import { PASS_THRESHOLD } from "@/lib/validations";

type SignTestResultClientProps = {
  fallbackLang?: Language;
};

export function SignTestResultClient({ fallbackLang = "en" }: SignTestResultClientProps) {
  const stored = useSyncExternalStore(
    subscribeSignSession,
    getSignSessionSnapshot,
    getSignSessionServerSnapshot,
  );

  const missing = useMemo(() => {
    if (stored === null) return true;
    return !stored.finished || !stored.result;
  }, [stored]);

  if (stored === null && typeof window === "undefined") {
    return (
      <AppShell lang={fallbackLang} nav="none">
        <PageContainer className="py-16 text-center text-muted-foreground" width="shell">
          {t(fallbackLang, "loading")}
        </PageContainer>
      </AppShell>
    );
  }

  if (missing || !stored?.result) {
    return (
      <AppShell
        lang={fallbackLang}
        nav="sign-test"
        showBottomNav
        langBasePath="/sign-test/result"
      >
        <PageContainer withBottomNav className="page-stack text-center" width="shell">
          <p>{t(fallbackLang, "sessionExpired")}</p>
          <LinkButton href={withLang("/sign-test", fallbackLang)} fullWidth>
            {t(fallbackLang, "startSignTest")}
          </LinkButton>
        </PageContainer>
      </AppShell>
    );
  }

  const result = stored.result;
  const lang = result.language;
  const rtl = dirForLanguage(lang) === "rtl";
  const passed = result.status === "PASS";
  const license = LICENSE_LABELS[result.licenseType];
  const needed = Math.ceil((PASS_THRESHOLD / 100) * result.questions.length);

  return (
    <AppShell
      lang={lang}
      rtl={rtl}
      nav="sign-test"
      showBottomNav
      langBasePath="/sign-test/result"
      backHref={withLang("/sign-test", lang)}
    >
      <PageContainer withBottomNav className="page-stack" width="shell">
        <Card
          accent={passed ? "success" : "danger"}
          className="flex flex-col items-center gap-3 py-8 text-center"
        >
          {passed ? (
            <CheckCircle2 className="h-14 w-14 text-success" />
          ) : (
            <XCircle className="h-14 w-14 text-destructive" />
          )}
          <p className="text-sm text-muted-foreground">
            {lang === "ur" ? license.ur : license.en}
          </p>
          <h1 className="text-2xl font-bold text-card-foreground">
            {passed ? t(lang, "passed") : t(lang, "failed")}
          </h1>
          <p className="text-4xl font-bold tabular-nums text-foreground">
            {result.correctCount}/{result.questions.length}
          </p>
          <p className={mutedTextClassName()}>
            {t(lang, "score")}: {Math.round(result.percentage)}%
          </p>
          <p className={mutedTextClassName("max-w-xs text-xs leading-5")}>
            {tf(lang, "passNeed", { needed, total: result.questions.length })}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <p className="text-sm text-muted-foreground">{t(lang, "correct")}</p>
            <p className="text-xl font-bold text-success">{result.correctCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-muted-foreground">{t(lang, "wrong")}</p>
            <p className="text-xl font-bold text-destructive">{result.wrongCount}</p>
          </Card>
        </div>

        <LinkButton href={withLang("/sign-test/review", lang)} fullWidth size="lg">
          {t(lang, "viewReview")}
        </LinkButton>
        <LinkButton
          href={withLang(`/sign-test/quiz?license=${result.licenseType}`, lang)}
          fullWidth
          size="lg"
          variant="secondary"
        >
          {t(lang, "retrySignTest")}
        </LinkButton>
        <Link href={withLang("/", lang)} className="text-center text-sm text-primary underline">
          {t(lang, "navHome")}
        </Link>
      </PageContainer>
    </AppShell>
  );
}

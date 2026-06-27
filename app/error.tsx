"use client";

import { useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LinkButton } from "@/components/ui/Button";
import { withLang } from "@/lib/language";
import { dirForLanguage, t } from "@/lib/translations";
import type { Language } from "@/lib/validations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const lang: Language =
    typeof document !== "undefined" &&
    document.cookie.includes("driveprep-lang=ur")
      ? "ur"
      : "en";
  const rtl = dirForLanguage(lang) === "rtl";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <AppShell lang={lang} rtl={rtl} nav="home" showBottomNav>
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t(lang, "errorTitle")}</h1>
        <p className="mt-3 text-slate-600">{t(lang, "errorHint")}</p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={reset}
            className="min-h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white"
          >
            {t(lang, "tryAgainAction")}
          </button>
          <LinkButton href={withLang("/", lang)} variant="secondary" fullWidth>
            {t(lang, "navHome")}
          </LinkButton>
        </div>
      </main>
    </AppShell>
  );
}

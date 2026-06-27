"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createAttemptFormAction } from "@/lib/quiz";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type StartFormProps = {
  lang: Language;
};

function errorMessage(lang: Language, code?: string): string | null {
  if (!code) return null;
  if (code === "INSUFFICIENT_QUESTIONS") return t(lang, "errorInsufficientQuestions");
  return code;
}

export function StartForm({ lang }: StartFormProps) {
  const [state, formAction, pending] = useActionState(createAttemptFormAction, null);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="language" value={lang} />

      {state?.error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage(lang, state.error)}</span>
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">{t(lang, "name")}</span>
        <input
          name="name"
          required
          minLength={2}
          maxLength={100}
          placeholder={t(lang, "namePlaceholder")}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">{t(lang, "phone")}</span>
        <input
          name="phone"
          required
          minLength={10}
          maxLength={20}
          inputMode="tel"
          placeholder={t(lang, "phonePlaceholder")}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
        />
      </label>

      <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
        {t(lang, "privacyNote")}
      </p>

      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {pending ? t(lang, "submitting") : t(lang, "startTest")}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, labelClassName, mutedTextClassName } from "@/components/ui/Card";
import {
  LICENSE_LABELS,
  LICENSE_TYPES,
  type LicenseType,
} from "@/lib/license-types";
import { withLang } from "@/lib/language";
import { SIGN_QUESTION_COUNT } from "@/lib/sign-quiz";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";

type SignTestStartFormProps = {
  lang: Language;
  initialLicense?: LicenseType;
};

export function SignTestStartForm({ lang, initialLicense = "motorcar" }: SignTestStartFormProps) {
  const router = useRouter();
  const [licenseType, setLicenseType] = useState<LicenseType>(initialLicense);
  const [starting, setStarting] = useState(false);

  function start() {
    setStarting(true);
    router.push(withLang(`/sign-test/quiz?license=${licenseType}`, lang));
  }

  return (
    <div className="section-stack">
      <Card>
        <p className={labelClassName()}>{t(lang, "chooseLicense")}</p>
        <p className={mutedTextClassName("mt-1")}>
          {SIGN_QUESTION_COUNT} {lang === "ur" ? "سائن سوالات" : "sign questions"}
          {lang === "ur"
            ? " — موٹر سائیکل کے لیے کچھ سوالات الگ ہیں۔"
            : " — shared bank; motorcycle excludes a few vehicle-only signs."}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {LICENSE_TYPES.map((type) => {
            const label = LICENSE_LABELS[type];
            const selected = licenseType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setLicenseType(type)}
                className={cn(
                  "min-h-14 rounded-xl border px-3 py-3 text-sm font-semibold transition-colors",
                  selected
                    ? "border-primary bg-accent text-accent-foreground"
                    : "border-border bg-card text-card-foreground hover:border-primary/40",
                )}
              >
                {lang === "ur" ? label.ur : label.en}
              </button>
            );
          })}
        </div>
      </Card>

      <Button type="button" fullWidth size="lg" loading={starting} onClick={start}>
        {t(lang, "startSignTestCta")}
      </Button>
    </div>
  );
}

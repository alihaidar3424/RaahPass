"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, inputClassName, labelClassName, mutedTextClassName } from "@/components/ui/Card";
import {
  FEE_DURATIONS,
  FEE_OFFICIAL_LINKS,
  FEE_PROVINCES,
  FEE_PURPOSES,
  calculateLicenseFee,
  provinceLabel,
  purposeLabel,
  type FeeDuration,
  type FeeProvince,
  type FeePurpose,
} from "@/lib/license-fees";
import { LICENSE_LABELS, LICENSE_TYPES, type LicenseType } from "@/lib/license-types";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type FeeCalculatorProps = {
  lang: Language;
};

export function FeeCalculator({ lang }: FeeCalculatorProps) {
  const [province, setProvince] = useState<FeeProvince>("punjab");
  const [licenseType, setLicenseType] = useState<LicenseType>("motorcar");
  const [purpose, setPurpose] = useState<FeePurpose>("new");
  const [duration, setDuration] = useState<FeeDuration>(5);
  const [lateFee, setLateFee] = useState(false);
  const [show, setShow] = useState(false);

  const result = useMemo(
    () =>
      calculateLicenseFee({
        province,
        licenseType,
        purpose,
        durationYears: duration,
        lateFee,
      }),
    [province, licenseType, purpose, duration, lateFee],
  );

  return (
    <div className="section-stack">
      <Card className="space-y-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-4 md:space-y-0 md:p-6">
        <div>
          <label className={labelClassName()} htmlFor="fee-province">
            {t(lang, "province")}
          </label>
          <select
            id="fee-province"
            className={inputClassName("mt-1")}
            value={province}
            onChange={(e) => setProvince(e.target.value as FeeProvince)}
          >
            {FEE_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {provinceLabel(p, lang)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName()} htmlFor="fee-license">
            {t(lang, "chooseLicense")}
          </label>
          <select
            id="fee-license"
            className={inputClassName("mt-1")}
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value as LicenseType)}
          >
            {LICENSE_TYPES.map((type) => (
              <option key={type} value={type}>
                {lang === "ur" ? LICENSE_LABELS[type].ur : LICENSE_LABELS[type].en}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName()} htmlFor="fee-purpose">
            {t(lang, "purpose")}
          </label>
          <select
            id="fee-purpose"
            className={inputClassName("mt-1")}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value as FeePurpose)}
          >
            {FEE_PURPOSES.map((p) => (
              <option key={p} value={p}>
                {purposeLabel(p, lang)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName()} htmlFor="fee-duration">
            {t(lang, "duration")}
          </label>
          <select
            id="fee-duration"
            className={inputClassName("mt-1")}
            value={duration}
            disabled={purpose === "learner"}
            onChange={(e) => setDuration(Number(e.target.value) as FeeDuration)}
          >
            {FEE_DURATIONS.map((d) => (
              <option key={d} value={d}>
                {d} {t(lang, "years")}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-foreground md:col-span-2">
          <input
            type="checkbox"
            checked={lateFee}
            onChange={(e) => setLateFee(e.target.checked)}
            className="h-4 w-4 rounded border-border"
          />
          {t(lang, "lateFee")}
        </label>

        <div className="md:col-span-2">
          <Button type="button" fullWidth onClick={() => setShow(true)}>
            {t(lang, "calculateFee")}
          </Button>
        </div>
      </Card>

      {show ? (
        <Card accent="primary" className="space-y-2">
          <p className="text-sm text-muted-foreground">{t(lang, "baseFee")}</p>
          <p className="text-lg font-semibold">
            {result.currency} {result.baseFee.toLocaleString()}
            {result.durationMultiplier !== 1
              ? ` × ${result.durationMultiplier}`
              : ""}
          </p>
          {result.lateFee > 0 ? (
            <p className="text-sm text-muted-foreground">
              {t(lang, "lateFeeAmount")}: {result.currency}{" "}
              {result.lateFee.toLocaleString()}
            </p>
          ) : null}
          <p className="pt-2 text-sm font-medium text-foreground">{t(lang, "estimatedTotal")}</p>
          <p className="text-3xl font-bold text-primary">
            {result.currency} {result.total.toLocaleString()}
          </p>
          <p className={mutedTextClassName("pt-2 leading-5")}>
            {lang === "ur" ? result.disclaimer.ur : result.disclaimer.en}
          </p>
        </Card>
      ) : null}

      <Card className="space-y-3">
        <p className="text-sm font-medium text-foreground">{t(lang, "feeOfficialSources")}</p>
        <ul className="space-y-2">
          {FEE_OFFICIAL_LINKS.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {lang === "ur" ? link.labelUr : link.label}
              </a>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  categoryLabel,
  filterSigns,
  getSignCategories,
  signName,
  type SignCategory,
} from "@/lib/traffic-signs";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { inputClassName, mutedTextClassName } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type SignsGalleryProps = {
  lang: Language;
};

export function SignsGallery({ lang }: SignsGalleryProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SignCategory | "all">("all");
  const categories = getSignCategories();

  const signs = useMemo(
    () => filterSigns({ query, category }),
    [query, category],
  );

  return (
    <div className="section-stack">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t(lang, "searchSigns")}
        className={inputClassName()}
        aria-label={t(lang, "searchSigns")}
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={cn(
            "min-h-9 shrink-0 rounded-lg border px-3 text-sm font-medium",
            category === "all"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-foreground",
          )}
        >
          {t(lang, "allCategories")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "min-h-9 shrink-0 rounded-lg border px-3 text-sm font-medium",
              category === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground",
            )}
          >
            {categoryLabel(cat, lang)}
          </button>
        ))}
      </div>

      {signs.length === 0 ? (
        <p className={mutedTextClassName()}>{t(lang, "noSignsFound")}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 md:gap-4">
          {signs.map((sign) => (
            <li key={sign.slug}>
              <Link
                href={withLang(`/signs/${sign.slug}`, lang)}
                className="flex h-full flex-col items-center gap-2 rounded-xl border border-border bg-card p-3 text-center shadow-[var(--shadow-card)] transition-all hover:border-primary hover:shadow-md md:p-4"
              >
                <div className="relative flex h-20 w-full items-center justify-center md:h-24">
                  <Image
                    src={sign.image}
                    alt={signName(sign, lang)}
                    width={96}
                    height={96}
                    className="max-h-20 w-auto object-contain md:max-h-24"
                  />
                </div>
                <span className="text-sm font-medium leading-5 text-card-foreground">
                  {signName(sign, lang)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {categoryLabel(sign.category, lang)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

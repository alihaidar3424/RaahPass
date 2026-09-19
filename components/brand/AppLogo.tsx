import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";
import type { Language } from "@/lib/validations";

type AppLogoProps = {
  lang: Language;
  size?: "sm" | "md" | "lg" | "hero";
  showTagline?: boolean;
  variant?: "default" | "onDark";
  className?: string;
};

const markSizes = {
  sm: 32,
  md: 40,
  lg: 56,
  hero: 88,
} as const;

export function AppLogo({
  lang,
  size = "md",
  showTagline = false,
  variant = "default",
  className,
}: AppLogoProps) {
  const mark = markSizes[size];
  const name = lang === "ur" ? BRAND.nameUr : BRAND.nameEn;
  const tagline = lang === "ur" ? BRAND.taglineUr : BRAND.taglineEn;
  const onDark = variant === "onDark";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/brand/logo-mark.svg"
        alt=""
        width={mark}
        height={mark}
        className="shrink-0"
        priority
        fetchPriority="high"
      />
      <div className="min-w-0 text-start">
        <p
          className={cn(
            "font-black tracking-tight",
            onDark ? "text-white" : "text-foreground",
            size === "hero" && "text-3xl",
            size === "lg" && "text-2xl",
            size === "md" && "text-lg sm:text-xl",
            size === "sm" && "text-base",
            lang === "ur" && "urdu-text leading-snug",
          )}
        >
          {name}
        </p>
        {showTagline ? (
          <p
            className={cn(
              onDark ? "text-emerald-100/90" : "text-muted-foreground",
              size === "hero" ? "mt-1 text-base" : "mt-0.5 text-xs",
              lang === "ur" && "urdu-text",
            )}
          >
            {tagline}
          </p>
        ) : null}
      </div>
    </div>
  );
}

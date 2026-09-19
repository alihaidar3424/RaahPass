import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { OWNER, ownerMapsUrl } from "@/lib/owner";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";

type OwnerCardProps = {
  lang: Language;
  variant?: "full" | "compact";
  className?: string;
};

export function OwnerCard({ lang, variant = "full", className }: OwnerCardProps) {
  const name = lang === "ur" ? OWNER.nameUr : OWNER.nameEn;
  const address = lang === "ur" ? OWNER.addressUr : OWNER.addressEn;
  const tagline = lang === "ur" ? OWNER.taglineUr : OWNER.taglineEn;

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5",
          className,
        )}
      >
        <Image
          src={OWNER.logoSrc}
          alt={OWNER.nameEn}
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-lg object-contain bg-white"
        />
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {t(lang, "ownedBy")}
          </p>
          <p className="truncate text-sm font-semibold text-card-foreground">{name}</p>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn("space-y-4 md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-8 md:space-y-0 md:p-6", className)}>
      <div className="flex items-start gap-4 md:contents">
        <Image
          src={OWNER.logoSrc}
          alt={OWNER.nameEn}
          width={88}
          height={88}
          className="h-[72px] w-[72px] shrink-0 rounded-xl border border-border bg-white object-contain p-1 md:h-[88px] md:w-[88px]"
        />
        <div className="min-w-0 space-y-1 md:pt-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t(lang, "ownedBy")}
          </p>
          <h2 className="text-lg font-bold text-card-foreground md:text-xl">{name}</h2>
          <p className={mutedTextClassName("text-xs md:text-sm")}>{tagline}</p>
          <div className="mt-4 space-y-3 border-t border-border pt-3 text-sm md:mt-5">
            <a
              href={ownerMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 text-foreground transition-colors hover:text-primary"
            >
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span className="leading-6">{address}</span>
            </a>
            <a
              href={`tel:${OWNER.phoneTel}`}
              className="flex items-center gap-3 font-medium text-foreground transition-colors hover:text-primary"
              dir="ltr"
            >
              <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {OWNER.phone}
            </a>
          </div>
        </div>
      </div>
    </Card>
  );
}

type OwnerFooterProps = {
  lang: Language;
  withBottomNav?: boolean;
};

export function OwnerFooter({ lang, withBottomNav = false }: OwnerFooterProps) {
  const name = lang === "ur" ? OWNER.nameUr : OWNER.nameEn;

  return (
    <footer
      className={cn(
        "border-t border-border px-4 py-4 text-center",
        withBottomNav && "pb-[calc(4.5rem+env(safe-area-inset-bottom))]",
      )}
    >
      <div className="mx-auto flex max-w-lg flex-col items-center gap-2">
        <Image
          src={OWNER.logoSrc}
          alt={OWNER.nameEn}
          width={40}
          height={40}
          className="h-10 w-10 rounded-lg bg-white object-contain"
        />
        <p className="text-xs text-muted-foreground">
          {t(lang, "ownedBy")}{" "}
          <span className="font-semibold text-foreground">{name}</span>
        </p>
        <a
          href={`tel:${OWNER.phoneTel}`}
          className="text-xs font-medium text-primary"
          dir="ltr"
        >
          {OWNER.phone}
        </a>
      </div>
    </footer>
  );
}

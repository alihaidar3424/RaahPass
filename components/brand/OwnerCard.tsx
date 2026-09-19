import Image from "next/image";
import { MapPin, Phone } from "lucide-react";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { OWNER, ownerMapsUrl } from "@/lib/owner";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { cn } from "@/lib/utils";

type OwnerCardProps = {
  lang: Language;
  className?: string;
};

export function OwnerCard({ lang, className }: OwnerCardProps) {
  const name = lang === "ur" ? OWNER.nameUr : OWNER.nameEn;
  const address = lang === "ur" ? OWNER.addressUr : OWNER.addressEn;
  const tagline = lang === "ur" ? OWNER.taglineUr : OWNER.taglineEn;

  return (
    <Card
      className={cn(
        "space-y-4 md:grid md:grid-cols-[auto_1fr] md:items-start md:gap-8 md:space-y-0 md:p-6",
        className,
      )}
    >
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

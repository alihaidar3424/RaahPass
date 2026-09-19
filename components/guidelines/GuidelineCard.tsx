import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GuidelineListItem } from "@/lib/guidelines";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { Card, mutedTextClassName } from "@/components/ui/Card";
import { NavLink } from "@/components/ui/NavLink";

type GuidelineCardProps = {
  item: GuidelineListItem;
  lang: Language;
};

export function GuidelineCard({ item, lang }: GuidelineCardProps) {
  const Chevron = lang === "ur" ? ChevronLeft : ChevronRight;

  return (
    <NavLink href={withLang(`/guidelines/${item.slug}`, lang)} fullWidth>
      <Card className="h-full transition-colors hover:border-primary/40">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">{item.category}</p>
        <h2 className="mt-1 text-lg font-semibold text-card-foreground">{item.title}</h2>
        <p className={mutedTextClassName("mt-2 line-clamp-2")}>{item.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
          {t(lang, "readArticle")}
          <Chevron className="h-4 w-4" />
        </span>
      </Card>
    </NavLink>
  );
}

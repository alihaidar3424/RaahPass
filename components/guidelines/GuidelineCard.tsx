import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { GuidelineListItem } from "@/lib/guidelines";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type GuidelineCardProps = {
  item: GuidelineListItem;
  lang: Language;
};

export function GuidelineCard({ item, lang }: GuidelineCardProps) {
  return (
    <Link
      href={withLang(`/guidelines/${item.slug}`, lang)}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">{item.category}</p>
      <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h2>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.excerpt}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
        {t(lang, "readArticle")}
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

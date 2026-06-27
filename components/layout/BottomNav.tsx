import Link from "next/link";
import { BookOpen, Home, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type BottomNavProps = {
  lang: Language;
  active: "home" | "guidelines" | "start";
};

export function BottomNav({ lang, active }: BottomNavProps) {
  const items = [
    { key: "home" as const, href: withLang("/", lang), icon: Home, label: t(lang, "navHome") },
    {
      key: "guidelines" as const,
      href: withLang("/guidelines", lang),
      icon: BookOpen,
      label: t(lang, "readGuidelines"),
    },
    {
      key: "start" as const,
      href: withLang("/start", lang),
      icon: PlayCircle,
      label: t(lang, "startPractice"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex min-h-11 min-w-[72px] flex-col items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors",
                isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900",
              )}
            >
              <Icon className="mb-0.5 h-5 w-5" aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

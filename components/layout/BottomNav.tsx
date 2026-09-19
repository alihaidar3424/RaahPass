"use client";

import { BookOpen, Calculator, CarFront, Home, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { NavLink } from "@/components/ui/NavLink";

export type BottomNavKey = "home" | "signs" | "sign-test" | "learn" | "fees" | "guidelines" | "start";

type BottomNavProps = {
  lang: Language;
  active: BottomNavKey;
};

export function BottomNav({ lang, active }: BottomNavProps) {
  const items = [
    { key: "home" as const, href: withLang("/", lang), icon: Home, label: t(lang, "navHome") },
    {
      key: "signs" as const,
      href: withLang("/signs", lang),
      icon: TrafficCone,
      label: t(lang, "navSigns"),
    },
    {
      key: "sign-test" as const,
      href: withLang("/sign-test", lang),
      icon: CarFront,
      label: t(lang, "navSignTest"),
    },
    {
      key: "fees" as const,
      href: withLang("/fees", lang),
      icon: Calculator,
      label: t(lang, "navFees"),
    },
    {
      key: "learn" as const,
      href: withLang("/guidelines", lang),
      icon: BookOpen,
      label: t(lang, "navLearn"),
    },
  ];

  const normalizedActive =
    active === "guidelines" ? "learn" : active === "start" ? "home" : active;

  return (
    <nav
      className="fixed bottom-0 left-0 z-50 w-full border-t border-border pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
      style={{ backgroundColor: "var(--nav)" }}
      aria-label="Mobile"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = normalizedActive === item.key;
          return (
            <NavLink
              key={item.key}
              href={item.href}
              className={cn(
                "flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1 text-[10px] font-medium transition-colors sm:text-[11px]",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("mb-0.5 h-5 w-5", isActive && "scale-105")} aria-hidden />
              <span className="max-w-full truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

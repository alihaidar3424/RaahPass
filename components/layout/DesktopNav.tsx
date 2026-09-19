"use client";

import { BookOpen, Calculator, CarFront, Home, TrafficCone } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { NavLink } from "@/components/ui/NavLink";
import type { BottomNavKey } from "@/components/layout/BottomNav";

type DesktopNavProps = {
  lang: Language;
  active: BottomNavKey | "none";
};

export function DesktopNav({ lang, active }: DesktopNavProps) {
  const items = [
    { key: "home" as const, href: withLang("/", lang), icon: Home, label: t(lang, "navHome") },
    {
      key: "sign-test" as const,
      href: withLang("/sign-test", lang),
      icon: CarFront,
      label: t(lang, "navSignTest"),
    },
    {
      key: "signs" as const,
      href: withLang("/signs", lang),
      icon: TrafficCone,
      label: t(lang, "navSigns"),
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

  const normalized =
    active === "guidelines" ? "learn" : active === "start" ? "home" : active;

  return (
    <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = normalized === item.key;
        return (
          <NavLink
            key={item.key}
            href={item.href}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

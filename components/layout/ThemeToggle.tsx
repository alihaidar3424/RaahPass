"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useBusyLock } from "@/lib/hooks/useBusyLock";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";

type ThemeToggleProps = {
  lang: Language;
};

const emptySubscribe = () => () => {};

export function ThemeToggle({ lang }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const { busy, run } = useBusyLock(350);

  if (!mounted) {
    return (
      <span
        className="inline-flex h-9 w-9 shrink-0 rounded-full bg-muted"
        aria-hidden
      />
    );
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <button
      type="button"
      disabled={busy}
      onClick={() => {
        run(() => setTheme(isDark ? "light" : "dark"));
      }}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
        "border border-border bg-card text-foreground transition-colors",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:opacity-50",
      )}
      aria-label={isDark ? t(lang, "lightMode") : t(lang, "darkMode")}
      title={isDark ? t(lang, "lightMode") : t(lang, "darkMode")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

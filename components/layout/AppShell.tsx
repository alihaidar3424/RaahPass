import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { AppLogo } from "@/components/brand/AppLogo";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { BottomNav } from "@/components/layout/BottomNav";
import { LanguagePills } from "@/components/layout/LanguagePills";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavLink } from "@/components/ui/NavLink";

type AppShellProps = {
  lang: Language;
  rtl?: boolean;
  nav?: "home" | "guidelines" | "start" | "none";
  showBottomNav?: boolean;
  backHref?: string;
  backLabel?: string;
  langBasePath?: string;
  children: React.ReactNode;
};

export function AppShell({
  lang,
  rtl = false,
  nav = "none",
  showBottomNav = false,
  backHref,
  backLabel,
  langBasePath = "/",
  children,
}: AppShellProps) {
  const BackChevron = rtl ? ChevronRight : ChevronLeft;

  return (
    <div dir={rtl ? "rtl" : "ltr"} className={cn("min-h-dvh bg-background", rtl && "urdu-text")}>
      <InstallPrompt lang={lang} />
      <header
        className="sticky top-0 z-[90] border-b border-border backdrop-blur-md"
        style={{ backgroundColor: "var(--header)" }}
      >
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between gap-2 px-4 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {backHref ? (
              <NavLink
                href={backHref}
                className={cn(
                  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted",
                  rtl && "urdu-text",
                )}
                aria-label={backLabel ?? t(lang, "back")}
              >
                <BackChevron className="h-5 w-5" aria-hidden />
              </NavLink>
            ) : null}
            <NavLink href={withLang("/", lang)} className="min-w-0">
              <AppLogo lang={lang} size="sm" />
            </NavLink>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle lang={lang} />
            <LanguagePills lang={lang} basePath={langBasePath} />
          </div>
        </div>
      </header>
      {children}
      {showBottomNav && nav !== "none" ? <BottomNav lang={lang} active={nav} /> : null}
    </div>
  );
}

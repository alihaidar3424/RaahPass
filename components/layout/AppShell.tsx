import Link from "next/link";
import { cn } from "@/lib/utils";
import { withLang } from "@/lib/language";
import type { Language } from "@/lib/validations";
import { t } from "@/lib/translations";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { BottomNav } from "@/components/layout/BottomNav";

type AppShellProps = {
  lang: Language;
  rtl?: boolean;
  nav?: "home" | "guidelines" | "start" | "none";
  showBottomNav?: boolean;
  backHref?: string;
  langBasePath?: string;
  children: React.ReactNode;
};

export function AppShell({
  lang,
  rtl = false,
  nav = "none",
  showBottomNav = false,
  backHref,
  langBasePath = "/",
  children,
}: AppShellProps) {
  return (
    <div dir={rtl ? "rtl" : "ltr"} className={cn("min-h-dvh bg-slate-50", rtl && "urdu-text")}>
      <InstallPrompt lang={lang} />
      <header className="sticky top-0 z-[90] border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="min-h-11 min-w-11 rounded-full text-sm leading-[44px] text-slate-600 hover:bg-slate-100"
                aria-label={t(lang, "back")}
              >
                ←
              </Link>
            ) : null}
            <Link href={withLang("/", lang)} className="text-xl font-black tracking-tight text-slate-900">
              {t(lang, "appName")}
            </Link>
          </div>
          <LanguagePills lang={lang} basePath={langBasePath} />
        </div>
      </header>
      <div className={cn(showBottomNav && "pb-20")}>{children}</div>
      {showBottomNav && nav !== "none" ? <BottomNav lang={lang} active={nav} /> : null}
    </div>
  );
}

function LanguagePills({ lang, basePath }: { lang: Language; basePath: string }) {
  return (
    <div className="flex rounded-full bg-slate-100 p-1">
      <Link
        href={withLang(basePath, "en")}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
          lang === "en" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600",
        )}
      >
        {t(lang, "english")}
      </Link>
      <Link
        href={withLang(basePath, "ur")}
        className={cn(
          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors urdu-text",
          lang === "ur" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600",
        )}
      >
        {t(lang, "urdu")}
      </Link>
    </div>
  );
}

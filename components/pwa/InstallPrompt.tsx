"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import type { Language } from "@/lib/validations";
import { PWA_DISMISS_KEY } from "@/lib/constants";
import { t } from "@/lib/translations";

type InstallPromptProps = {
  lang: Language;
};

export function InstallPrompt({ lang }: InstallPromptProps) {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(PWA_DISMISS_KEY) === "1") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function dismiss() {
    localStorage.setItem(PWA_DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    setDeferredPrompt(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      className="sticky top-0 z-[100] flex items-center justify-between px-4 py-3 sm:px-5"
      style={{ backgroundColor: "var(--banner)", color: "var(--banner-foreground)" }}
    >
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5 shrink-0" aria-hidden />
        <p className="text-sm font-medium">{t(lang, "installPrompt")}</p>
      </div>
      <div className="flex items-center gap-1">
        {deferredPrompt ? (
          <button
            type="button"
            onClick={install}
            className="min-h-9 rounded-lg px-3 text-sm font-semibold hover:bg-white/10"
          >
            {t(lang, "install")}
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          className="flex min-h-9 min-w-9 items-center justify-center rounded-lg hover:bg-white/10"
          aria-label={t(lang, "close")}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
};

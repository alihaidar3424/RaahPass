"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Language } from "@/lib/validations";
import { PWA_DISMISS_KEY } from "@/lib/constants";
import {
  isAndroid,
  isIos,
  isMobileInstallPlatform,
  isStandaloneDisplay,
  waitForInstallReady,
} from "@/lib/pwa";
import { t } from "@/lib/translations";

type InstallPromptProps = {
  lang: Language;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallPrompt({ lang }: InstallPromptProps) {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installing, setInstalling] = useState(false);
  const [manualOnly, setManualOnly] = useState(false);
  const [installReady, setInstallReady] = useState(false);
  const [installFailed, setInstallFailed] = useState(false);
  const hasNativePrompt = useRef(false);
  const pendingPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const installReadyRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(PWA_DISMISS_KEY) === "1") return;
    if (isStandaloneDisplay()) return;

    let showTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    void waitForInstallReady().then((ready) => {
      if (cancelled) return;
      installReadyRef.current = ready;
      setInstallReady(ready);
      if (ready && pendingPrompt.current) {
        setDeferredPrompt(pendingPrompt.current);
        setManualOnly(false);
        setVisible(true);
      }
    });

    const handler = (event: Event) => {
      event.preventDefault();
      hasNativePrompt.current = true;
      pendingPrompt.current = event as BeforeInstallPromptEvent;
      setInstallFailed(false);
      if (installReadyRef.current) {
        setDeferredPrompt(event as BeforeInstallPromptEvent);
        setManualOnly(false);
        setVisible(true);
      }
    };

    const onInstalled = () => {
      setInstalling(false);
      setVisible(false);
      setInstallFailed(false);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);

    if (isMobileInstallPlatform()) {
      showTimer = setTimeout(() => {
        if (hasNativePrompt.current) return;
        setManualOnly(true);
        setVisible(true);
      }, 2500);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(PWA_DISMISS_KEY, "1");
    setVisible(false);
  }

  async function install() {
    if (!deferredPrompt || installing) return;

    const ready = await waitForInstallReady();
    if (!ready) {
      setInstallFailed(true);
      setManualOnly(true);
      return;
    }

    setInstalling(true);
    setInstallFailed(false);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(resolve, 4000);
          window.addEventListener(
            "appinstalled",
            () => {
              clearTimeout(timeout);
              resolve();
            },
            { once: true },
          );
        });
        if (!isStandaloneDisplay()) {
          setInstallFailed(true);
          setManualOnly(true);
        } else {
          setVisible(false);
        }
      }
    } catch {
      setInstallFailed(true);
      setManualOnly(true);
    } finally {
      setDeferredPrompt(null);
      pendingPrompt.current = null;
      setInstalling(false);
    }
  }

  if (!visible) return null;

  const hint = installFailed
    ? t(lang, "installFailedRetry")
    : isAndroid()
      ? t(lang, "installHintAndroid")
      : isIos()
        ? t(lang, "installHintIos")
        : t(lang, "installHintDesktop");

  const showNativeButton = Boolean(deferredPrompt) && installReady && !installFailed;

  return (
    <section
      className="sticky top-0 z-[100] border-b border-border px-4 py-3 sm:px-5"
      style={{ backgroundColor: "var(--banner)", color: "var(--banner-foreground)" }}
    >
      <div className="mx-auto flex max-w-lg items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <Download className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">{t(lang, "installPrompt")}</p>
            {manualOnly || !showNativeButton ? (
              <p className="text-xs leading-5 opacity-90">{hint}</p>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {showNativeButton ? (
            <Button
              type="button"
              variant="ghost"
              size="md"
              loading={installing}
              disabled={installing}
              onClick={install}
              className="min-h-9 rounded-lg px-3 text-sm font-semibold text-[var(--banner-foreground)] hover:bg-white/10"
            >
              {installing ? t(lang, "installing") : t(lang, "install")}
            </Button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            disabled={installing}
            className="flex min-h-9 min-w-9 items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-50"
            aria-label={t(lang, "close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

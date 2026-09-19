"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Language } from "@/lib/validations";
import { PWA_DISMISS_KEY } from "@/lib/constants";
import {
  isAndroid,
  isIos,
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

type InstallStore = {
  deferred: BeforeInstallPromptEvent | null;
  visible: boolean;
  manualOnly: boolean;
  installFailed: boolean;
  installing: boolean;
};

const listeners = new Set<() => void>();

let store: InstallStore = {
  deferred: null,
  visible: false,
  manualOnly: false,
  installFailed: false,
  installing: false,
};

let bootstrapped = false;

const SERVER_SNAPSHOT: InstallStore = {
  deferred: null,
  visible: false,
  manualOnly: false,
  installFailed: false,
  installing: false,
};

function emit() {
  for (const listener of listeners) listener();
}

function patch(partial: Partial<InstallStore>) {
  store = { ...store, ...partial };
  emit();
}

function isDismissed(): boolean {
  try {
    return localStorage.getItem(PWA_DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): InstallStore {
  return store;
}

function getServerSnapshot(): InstallStore {
  return SERVER_SNAPSHOT;
}

function bootstrapInstallPrompt() {
  if (typeof window === "undefined" || bootstrapped) return;
  bootstrapped = true;

  if (isDismissed() || isStandaloneDisplay()) return;

  const onBeforeInstall = (event: Event) => {
    if (isDismissed() || isStandaloneDisplay()) return;
    // Required so we can show our Install button and call prompt() on click.
    event.preventDefault();
    patch({
      deferred: event as BeforeInstallPromptEvent,
      manualOnly: false,
      installFailed: false,
      visible: true,
    });
  };

  window.addEventListener("beforeinstallprompt", onBeforeInstall);
  window.addEventListener("appinstalled", () => {
    localStorage.setItem(PWA_DISMISS_KEY, "1");
    patch({
      visible: false,
      deferred: null,
      installing: false,
      installFailed: false,
    });
  });

  // Fallback tips if Chrome never fires beforeinstallprompt yet (engagement
  // heuristics / iOS). Upgrades to a real Install button when the event arrives.
  window.setTimeout(() => {
    if (isDismissed() || isStandaloneDisplay() || store.deferred || store.visible) return;
    patch({ manualOnly: true, visible: true });
  }, 2000);
}

export function InstallPrompt({ lang }: InstallPromptProps) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    bootstrapInstallPrompt();
    if (isDismissed() || isStandaloneDisplay()) {
      patch({ visible: false });
    }
  }, []);

  function dismiss() {
    localStorage.setItem(PWA_DISMISS_KEY, "1");
    patch({ visible: false, deferred: null });
  }

  async function install() {
    const deferred = store.deferred;
    if (!deferred || store.installing) return;

    patch({ installing: true, installFailed: false });
    try {
      await waitForInstallReady();
      await deferred.prompt();
      const { outcome } = await deferred.userChoice;
      if (outcome === "accepted") {
        patch({ visible: false, deferred: null });
      } else {
        // Event is spent after prompt(); keep tips visible.
        patch({ deferred: null, manualOnly: true });
      }
    } catch {
      patch({ installFailed: true, manualOnly: true, deferred: null });
    } finally {
      patch({ installing: false });
    }
  }

  if (!state.visible) return null;

  const hint = state.installFailed
    ? t(lang, "installFailedRetry")
    : isAndroid()
      ? t(lang, "installHintAndroid")
      : isIos()
        ? t(lang, "installHintIos")
        : t(lang, "installHintDesktop");

  const showNativeButton = Boolean(state.deferred) && !state.installFailed;

  return (
    <section
      className="sticky top-0 z-[100] border-b border-border px-4 py-3 sm:px-5"
      style={{ backgroundColor: "var(--banner)", color: "var(--banner-foreground)" }}
    >
      <div className="mx-auto flex max-w-lg items-start justify-between gap-3 md:max-w-6xl">
        <div className="flex min-w-0 items-start gap-3">
          <Download className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">{t(lang, "installPrompt")}</p>
            {!showNativeButton || state.manualOnly ? (
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
              loading={state.installing}
              disabled={state.installing}
              onClick={() => void install()}
              className="min-h-9 rounded-lg px-3 text-sm font-semibold text-[var(--banner-foreground)] hover:bg-white/10"
            >
              {state.installing ? t(lang, "installing") : t(lang, "install")}
            </Button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            disabled={state.installing}
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

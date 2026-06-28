export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

export function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isMobileInstallPlatform(): boolean {
  return isAndroid() || isIos();
}

/** Chrome needs an active service worker before WebAPK install can finish. */
export async function waitForInstallReady(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.active) return false;
    // claim() in sw.js should attach on first visit; reload once if still uncontrolled.
    if (!navigator.serviceWorker.controller) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    return Boolean(registration.active);
  } catch {
    return false;
  }
}

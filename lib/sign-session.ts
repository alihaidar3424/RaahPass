import { SIGN_SESSION_KEY, type SignSessionResult, type SignOptionKey, type SignQuizQuestion } from "@/lib/sign-quiz";
import type { LicenseType } from "@/lib/license-types";
import type { Language } from "@/lib/validations";

export type SignSessionPayload = {
  questions: SignQuizQuestion[];
  answers: Record<string, SignOptionKey>;
  index: number;
  startedAt: number;
  language: Language;
  licenseType: LicenseType;
  finished?: boolean;
  result?: SignSessionResult;
};

const EVENT = "raahpass-sign-session";

let cachedRaw: string | null | undefined;
let cachedValue: SignSessionPayload | null = null;

function parse(raw: string | null): SignSessionPayload | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SignSessionPayload;
  } catch {
    return null;
  }
}

/** Stable snapshot for useSyncExternalStore (same reference until storage changes). */
export function getSignSessionSnapshot(): SignSessionPayload | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SIGN_SESSION_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = parse(raw);
  return cachedValue;
}

export function getSignSessionServerSnapshot(): SignSessionPayload | null {
  return null;
}

export function subscribeSignSession(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const onCustom = () => onStoreChange();
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIGN_SESSION_KEY || event.key === null) onStoreChange();
  };

  window.addEventListener(EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}

export function writeSignSession(payload: SignSessionPayload): void {
  const raw = JSON.stringify(payload);
  sessionStorage.setItem(SIGN_SESSION_KEY, raw);
  cachedRaw = raw;
  cachedValue = payload;
  window.dispatchEvent(new Event(EVENT));
}

export function clearSignSession(): void {
  sessionStorage.removeItem(SIGN_SESSION_KEY);
  cachedRaw = null;
  cachedValue = null;
  window.dispatchEvent(new Event(EVENT));
}

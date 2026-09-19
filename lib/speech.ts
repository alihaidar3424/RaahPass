import type { Language } from "@/lib/validations";
import type { SignOptionKey } from "@/lib/sign-quiz";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function canUseSpeechSynthesis(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function canUseSpeechRecognition(): boolean {
  return getRecognitionCtor() !== null;
}

export function speechLocale(language: Language): string {
  return language === "ur" ? "ur-PK" : "en-PK";
}

export function stopSpeaking(): void {
  if (!canUseSpeechSynthesis()) return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, language: Language): void {
  if (!canUseSpeechSynthesis() || !text.trim()) return;
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text.trim());
  utterance.lang = speechLocale(language);
  utterance.rate = language === "ur" ? 0.95 : 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find((v) => v.lang.toLowerCase().startsWith(language === "ur" ? "ur" : "en")) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(language === "ur" ? "hi" : "en"));
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

export function speakQuestion(
  questionText: string,
  options: { key: SignOptionKey; label: string }[],
  language: Language,
): void {
  const optionLine = options
    .map((o) => {
      const letter =
        language === "ur"
          ? ({ A: "الف", B: "بے", C: "سین", D: "ڈی" } as const)[o.key]
          : o.key;
      return `${letter}. ${o.label}`;
    })
    .join(". ");
  speakText(`${questionText}. ${optionLine}`, language);
}

function normalizeTranscript(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Map spoken answer to A/B/C/D when possible. */
export function matchSpokenOption(
  transcript: string,
  options: { key: SignOptionKey; label: string }[],
): SignOptionKey | null {
  const t = normalizeTranscript(transcript);
  if (!t) return null;

  const letterMap: Array<{ key: SignOptionKey; patterns: RegExp[] }> = [
    { key: "A", patterns: [/^a\b/, /\boption a\b/, /\ba\s*$/, /^الف\b/, /\bاے\b/, /^1\b/, /^one\b/] },
    { key: "B", patterns: [/^b\b/, /\boption b\b/, /\bb\s*$/, /^بے\b/, /\bbi\b/, /^2\b/, /^two\b/] },
    { key: "C", patterns: [/^c\b/, /\boption c\b/, /\bc\s*$/, /^سین\b/, /^سی\b/, /^3\b/, /^three\b/] },
    { key: "D", patterns: [/^d\b/, /\boption d\b/, /\bd\s*$/, /^ڈی\b/, /^4\b/, /^four\b/] },
  ];

  for (const entry of letterMap) {
    if (entry.patterns.some((re) => re.test(t))) return entry.key;
  }

  // Exact / contains option label
  let best: { key: SignOptionKey; score: number } | null = null;
  for (const opt of options) {
    const label = normalizeTranscript(opt.label);
    if (!label) continue;
    if (t === label || t.includes(label) || label.includes(t)) {
      const score = Math.min(t.length, label.length);
      if (!best || score > best.score) best = { key: opt.key, score };
    }
  }
  return best?.key ?? null;
}

export type SpeechListener = {
  start: () => void;
  stop: () => void;
};

export function createSpeechListener(opts: {
  language: Language;
  onTranscript: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
}): SpeechListener | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) return null;

  const recognition = new Ctor();
  recognition.lang = speechLocale(opts.language);
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  let intentionalStop = false;

  recognition.onresult = (event) => {
    let transcript = "";
    let isFinal = false;
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const row = event.results[i];
      transcript += row[0].transcript;
      if (row.isFinal) isFinal = true;
    }
    opts.onTranscript(transcript, isFinal);
  };

  recognition.onerror = (event) => {
    if (event.error === "aborted" || event.error === "no-speech") return;
    opts.onError?.(event.error);
  };

  recognition.onend = () => {
    if (!intentionalStop) {
      try {
        recognition.start();
      } catch {
        // already started
      }
    }
  };

  return {
    start() {
      intentionalStop = false;
      try {
        recognition.start();
      } catch {
        // ignore duplicate start
      }
    },
    stop() {
      intentionalStop = true;
      try {
        recognition.stop();
      } catch {
        try {
          recognition.abort();
        } catch {
          // ignore
        }
      }
    },
  };
}

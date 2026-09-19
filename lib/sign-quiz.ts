import bank from "@/data/sign-questions-bilingual.json";
import type { LicenseType } from "@/lib/license-types";
import { calculateScore } from "@/lib/score";
import type { Language } from "@/lib/validations";
import { QUIZ_SIZE } from "@/lib/validations";

export type SignOptionKey = "A" | "B" | "C" | "D";

export type SignQuestionRaw = {
  id: string;
  licenseTypes: LicenseType[];
  image: string;
  signSlug?: string;
  correct: SignOptionKey;
  en: { question: string; A: string; B: string; C: string; D?: string };
  ur: { question: string; A: string; B: string; C: string; D?: string };
};

export type SignQuizQuestion = {
  id: string;
  image: string;
  questionText: string;
  options: { key: SignOptionKey; label: string }[];
  correct: SignOptionKey;
};

function hasUsableImage(image: string): boolean {
  return (
    Boolean(image) &&
    !image.endsWith("/") &&
    image !== "/signs/quiz/" &&
    !image.startsWith("/signs/quiz/")
  );
}

const allQuestions = (bank.questions as SignQuestionRaw[]).filter((q) => hasUsableImage(q.image));

export const SIGN_QUESTION_COUNT = allQuestions.length;

export function getSignQuestionPool(licenseType?: LicenseType): SignQuestionRaw[] {
  if (!licenseType) return allQuestions;
  return allQuestions.filter((q) => q.licenseTypes.includes(licenseType));
}

function localizeQuestion(raw: SignQuestionRaw, lang: Language): SignQuizQuestion {
  const loc = lang === "ur" ? raw.ur : raw.en;
  const options: { key: SignOptionKey; label: string }[] = [
    { key: "A", label: loc.A },
    { key: "B", label: loc.B },
    { key: "C", label: loc.C },
  ];
  if (loc.D) options.push({ key: "D", label: loc.D });

  return {
    id: raw.id,
    image: raw.image,
    questionText: loc.question,
    options,
    correct: raw.correct,
  };
}

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

/** Fisher–Yates sample; prefers questions tagged for fewer license types. */
export function sampleSignQuestions(
  language: Language,
  licenseType: LicenseType,
  size: number = QUIZ_SIZE,
): SignQuizQuestion[] {
  const pool = getSignQuestionPool(licenseType);
  const preferred = shuffleInPlace(pool.filter((q) => q.licenseTypes.length < 4));
  const rest = shuffleInPlace(pool.filter((q) => q.licenseTypes.length >= 4));
  const picked = shuffleInPlace([...preferred, ...rest].slice(0, Math.min(size, pool.length)));
  return picked.map((q) => localizeQuestion(q, language));
}

export function localizeSignQuestionsByIds(ids: string[], language: Language): SignQuizQuestion[] {
  const byId = new Map(allQuestions.map((q) => [q.id, q]));
  const out: SignQuizQuestion[] = [];
  for (const id of ids) {
    const raw = byId.get(id);
    if (!raw) return [];
    out.push(localizeQuestion(raw, language));
  }
  return out;
}

export type SignSessionResult = {
  questions: SignQuizQuestion[];
  answers: Record<string, SignOptionKey | undefined>;
  correctCount: number;
  wrongCount: number;
  percentage: number;
  status: "PASS" | "FAIL";
  language: Language;
  licenseType: LicenseType;
};

export function scoreSignSession(
  questions: SignQuizQuestion[],
  answers: Record<string, SignOptionKey | undefined>,
  language: Language,
  licenseType: LicenseType,
): SignSessionResult {
  let correctCount = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correct) correctCount += 1;
  }
  const scored = calculateScore(correctCount, questions.length);
  return {
    questions,
    answers,
    correctCount: scored.correctAnswers,
    wrongCount: scored.wrongAnswers,
    percentage: scored.percentage,
    status: scored.status,
    language,
    licenseType,
  };
}

export const SIGN_SESSION_KEY = "raahpass-sign-session";

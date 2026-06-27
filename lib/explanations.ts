import type { CorrectOption } from "@prisma/client";
import type { Language } from "@/lib/validations";

const OPTION_KEYS: CorrectOption[] = ["A", "B", "C", "D"];

export function buildExplanation(
  language: Language,
  correctOption: CorrectOption,
  options: { key: CorrectOption; label: string }[],
): string {
  const label = options.find((option) => option.key === correctOption)?.label;
  if (!label) return "";

  if (language === "ur") {
    return `درست جواب ${correctOption} ہے: ${label}۔`;
  }
  return `The correct answer is ${correctOption}: ${label}.`;
}

export function resolveExplanation(
  language: Language,
  stored: string,
  correctOption: CorrectOption,
  options: { key: CorrectOption; label: string }[],
): string {
  const trimmed = stored.trim();
  if (trimmed) return trimmed;
  return buildExplanation(language, correctOption, options);
}

export function buildSeedExplanation(
  language: Language,
  correctOption: CorrectOption,
  options: Record<string, string>,
): string {
  const label = options[correctOption]?.trim();
  if (!label) return "";

  if (language === "ur") {
    return `درست جواب ${correctOption} ہے: ${label}۔`;
  }
  return `The correct answer is ${correctOption}: ${label}.`;
}

export function optionKeysFromRecord(options: Record<string, string>): CorrectOption[] {
  return OPTION_KEYS.filter((key) => options[key]?.trim());
}

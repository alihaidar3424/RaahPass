import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import signBank from "@/data/sign-questions-bilingual.json";
import textBank from "@/data/text-questions-bilingual.json";
import trafficBank from "@/data/traffic-signs.json";
import { QUIZ_SIZE } from "@/lib/validations";
import { LICENSE_TYPES, type LicenseType } from "@/lib/license-types";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
const root = path.resolve(__dirname, "..");

function publicPath(urlPath: string): string {
  return path.join(root, "public", urlPath.replace(/^\//, ""));
}

describe("sign-questions bank integrity", () => {
  const questions = signBank.questions;

  it("has enough questions for a full quiz per license type", () => {
    expect(questions.length).toBeGreaterThanOrEqual(QUIZ_SIZE);
    for (const lt of LICENSE_TYPES) {
      const pool = questions.filter((q) =>
        (q.licenseTypes as LicenseType[]).includes(lt),
      );
      expect(pool.length, lt).toBeGreaterThanOrEqual(QUIZ_SIZE);
    }
  });

  it("has unique ids and valid structure", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const q of questions) {
      expect(q.id).toMatch(/^s-\d+$/);
      expect(OPTION_KEYS).toContain(q.correct);
      expect(q.image).toMatch(/^\/signs\//);
      expect(q.image.endsWith("/")).toBe(false);
      expect(q.en.question.trim().length).toBeGreaterThan(0);
      expect(q.ur.question.trim().length).toBeGreaterThan(0);
      for (const key of ["A", "B", "C"] as const) {
        expect(q.en[key].trim().length).toBeGreaterThan(0);
        expect(q.ur[key].trim().length).toBeGreaterThan(0);
      }
      expect(q.en.question).not.toBe(q.ur.question);
      expect(q.licenseTypes.length).toBeGreaterThan(0);
    }
  });

  it("references image files that exist on disk", () => {
    for (const q of questions) {
      expect(existsSync(publicPath(q.image)), q.image).toBe(true);
    }
  });

  it("correct answer option exists in both languages", () => {
    for (const q of questions) {
      const en = q.en[q.correct as "A" | "B" | "C" | "D"];
      const ur = q.ur[q.correct as "A" | "B" | "C" | "D"];
      expect(en?.trim().length, q.id).toBeGreaterThan(0);
      expect(ur?.trim().length, q.id).toBeGreaterThan(0);
    }
  });
});

describe("traffic-signs bank integrity", () => {
  const signs = trafficBank.signs;

  it("has unique slugs and required bilingual fields", () => {
    const slugs = signs.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const sign of signs) {
      expect(sign.slug.length).toBeGreaterThan(0);
      expect(sign.slug).not.toBe("quiz-");
      expect(sign.nameEn.trim().length).toBeGreaterThan(0);
      expect(sign.nameUr.trim().length).toBeGreaterThan(0);
      expect(sign.image).toMatch(/^\/signs\//);
      expect(sign.image.endsWith("/")).toBe(false);
      expect(trafficBank.categories).toContain(sign.category);
    }
  });

  it("references gallery image files that exist", () => {
    for (const sign of signs) {
      expect(existsSync(publicPath(sign.image)), sign.image).toBe(true);
    }
  });
});

describe("text-questions bank integrity", () => {
  const questions = textBank.questions;

  it("has a full rules bank with unique ids", () => {
    expect(questions.length).toBeGreaterThanOrEqual(QUIZ_SIZE);
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has bilingual options and a valid correct answer", () => {
    for (const q of questions) {
      expect(OPTION_KEYS).toContain(q.correctAnswer);
      expect(q.english.question.trim().length).toBeGreaterThan(0);
      expect(q.urdu.question.trim().length).toBeGreaterThan(0);
      expect(q.english.question).not.toBe(q.urdu.question);

      for (const key of ["A", "B", "C"] as const) {
        expect(q.english.options[key]?.trim().length, `${q.id} en ${key}`).toBeGreaterThan(0);
        expect(q.urdu.options[key]?.trim().length, `${q.id} ur ${key}`).toBeGreaterThan(0);
      }

      const enCorrect = q.english.options[q.correctAnswer as keyof typeof q.english.options];
      const urCorrect = q.urdu.options[q.correctAnswer as keyof typeof q.urdu.options];
      expect(enCorrect?.trim().length, q.id).toBeGreaterThan(0);
      expect(urCorrect?.trim().length, q.id).toBeGreaterThan(0);
    }
  });
});

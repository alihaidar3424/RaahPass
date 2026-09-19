import { describe, expect, it } from "vitest";
import {
  SIGN_QUESTION_COUNT,
  getSignQuestionPool,
  localizeSignQuestionsByIds,
  sampleSignQuestions,
  scoreSignSession,
  type SignQuizQuestion,
} from "@/lib/sign-quiz";
import { QUIZ_SIZE } from "@/lib/validations";

function fakeQuestions(n: number): SignQuizQuestion[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `q-${i}`,
    image: `/signs/r-${i}.png`,
    questionText: `Question ${i}`,
    options: [
      { key: "A" as const, label: "A" },
      { key: "B" as const, label: "B" },
      { key: "C" as const, label: "C" },
    ],
    correct: "B" as const,
  }));
}

describe("sign-quiz", () => {
  it("exposes a usable bank size", () => {
    expect(SIGN_QUESTION_COUNT).toBeGreaterThanOrEqual(QUIZ_SIZE);
  });

  it("filters motorcycle pool smaller than motorcar when exclusions exist", () => {
    const bike = getSignQuestionPool("motorcycle");
    const car = getSignQuestionPool("motorcar");
    expect(bike.length).toBeGreaterThanOrEqual(QUIZ_SIZE);
    expect(car.length).toBeGreaterThanOrEqual(bike.length);
    expect(bike.every((q) => q.licenseTypes.includes("motorcycle"))).toBe(true);
  });

  it("samples QUIZ_SIZE unique localized questions", () => {
    const sample = sampleSignQuestions("en", "motorcar", QUIZ_SIZE);
    expect(sample).toHaveLength(QUIZ_SIZE);
    expect(new Set(sample.map((q) => q.id)).size).toBe(QUIZ_SIZE);
    expect(sample[0]?.questionText.length).toBeGreaterThan(0);
    expect(sample[0]?.options.length).toBeGreaterThanOrEqual(3);
  });

  it("localizes the same ids into Urdu", () => {
    const en = sampleSignQuestions("en", "htv", 5);
    const ur = localizeSignQuestionsByIds(
      en.map((q) => q.id),
      "ur",
    );
    expect(ur).toHaveLength(5);
    expect(ur.map((q) => q.id)).toEqual(en.map((q) => q.id));
    expect(ur[0]?.image).toBe(en[0]?.image);
    expect(ur[0]?.questionText).not.toBe(en[0]?.questionText);
  });

  it("returns empty when any id is missing during localize", () => {
    expect(localizeSignQuestionsByIds(["no-such-id"], "en")).toEqual([]);
  });

  it("scores a perfect session as PASS", () => {
    const questions = fakeQuestions(20);
    const answers = Object.fromEntries(questions.map((q) => [q.id, q.correct]));
    const result = scoreSignSession(questions, answers, "en", "motorcar");
    expect(result.status).toBe("PASS");
    expect(result.correctCount).toBe(20);
    expect(result.wrongCount).toBe(0);
    expect(result.percentage).toBe(100);
  });

  it("scores unanswered items as wrong", () => {
    const questions = fakeQuestions(20);
    const answers = Object.fromEntries(
      questions.slice(0, 14).map((q) => [q.id, q.correct]),
    );
    const result = scoreSignSession(questions, answers, "ur", "ltv");
    expect(result.correctCount).toBe(14);
    expect(result.wrongCount).toBe(6);
    expect(result.status).toBe("PASS");
    expect(result.language).toBe("ur");
    expect(result.licenseType).toBe("ltv");
  });

  it("fails when below 70%", () => {
    const questions = fakeQuestions(20);
    const answers = Object.fromEntries(
      questions.slice(0, 13).map((q) => [q.id, q.correct]),
    );
    const result = scoreSignSession(questions, answers, "en", "motorcycle");
    expect(result.status).toBe("FAIL");
    expect(result.percentage).toBe(65);
  });
});

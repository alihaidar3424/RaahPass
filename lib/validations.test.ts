import { describe, expect, it } from "vitest";
import {
  QUIZ_SIZE,
  createAttemptSchema,
  submitQuizSchema,
} from "@/lib/validations";

describe("createAttemptSchema", () => {
  it("accepts valid input", () => {
    const result = createAttemptSchema.safeParse({
      name: "Ahmed Khan",
      phone: "03001234567",
      language: "en",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = createAttemptSchema.safeParse({
      name: "A",
      phone: "03001234567",
      language: "en",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone characters", () => {
    const result = createAttemptSchema.safeParse({
      name: "Ahmed",
      phone: "abc",
      language: "ur",
    });
    expect(result.success).toBe(false);
  });
});

function answers(allSelected: boolean) {
  return Array.from({ length: QUIZ_SIZE }, (_, i) => ({
    attemptQuestionId: `aq-${i}`,
    ...(allSelected ? { selectedOption: "A" as const } : {}),
  }));
}

describe("submitQuizSchema", () => {
  it("accepts a fully answered quiz", () => {
    const result = submitQuizSchema.safeParse({
      attemptId: "attempt-1",
      answers: answers(true),
    });
    expect(result.success).toBe(true);
  });

  it("rejects incomplete answers unless timed out", () => {
    const incomplete = submitQuizSchema.safeParse({
      attemptId: "attempt-1",
      answers: answers(false),
    });
    expect(incomplete.success).toBe(false);

    const timedOut = submitQuizSchema.safeParse({
      attemptId: "attempt-1",
      timedOut: true,
      answers: answers(false),
    });
    expect(timedOut.success).toBe(true);
  });

  it("rejects wrong answer count", () => {
    const result = submitQuizSchema.safeParse({
      attemptId: "attempt-1",
      answers: answers(true).slice(0, 10),
    });
    expect(result.success).toBe(false);
  });
});

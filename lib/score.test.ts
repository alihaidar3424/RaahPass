import { describe, expect, it } from "vitest";
import { calculateScore } from "@/lib/score";

describe("calculateScore", () => {
  it("passes at exactly 70%", () => {
    const result = calculateScore(14);
    expect(result.percentage).toBe(70);
    expect(result.status).toBe("PASS");
    expect(result.wrongAnswers).toBe(6);
  });

  it("fails below 70%", () => {
    const result = calculateScore(13);
    expect(result.percentage).toBe(65);
    expect(result.status).toBe("FAIL");
  });

  it("passes above 70%", () => {
    const result = calculateScore(18);
    expect(result.status).toBe("PASS");
    expect(result.correctAnswers).toBe(18);
  });

  it("fails at zero correct", () => {
    const result = calculateScore(0);
    expect(result.status).toBe("FAIL");
    expect(result.percentage).toBe(0);
  });
});

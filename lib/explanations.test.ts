import { describe, expect, it } from "vitest";
import { buildExplanation, resolveExplanation } from "@/lib/explanations";

describe("explanations", () => {
  const options = [
    { key: "A" as const, label: "Yes" },
    { key: "B" as const, label: "No" },
    { key: "C" as const, label: "Don't know" },
  ];

  it("builds English explanation", () => {
    expect(buildExplanation("en", "B", options)).toBe("The correct answer is B: No.");
  });

  it("builds Urdu explanation", () => {
    expect(buildExplanation("ur", "B", options)).toContain("B");
    expect(buildExplanation("ur", "B", options)).toContain("No");
  });

  it("uses stored explanation when present", () => {
    expect(resolveExplanation("en", "Custom note.", "B", options)).toBe("Custom note.");
  });

  it("falls back when stored explanation is empty", () => {
    expect(resolveExplanation("en", "", "C", options)).toBe(
      "The correct answer is C: Don't know.",
    );
  });
});

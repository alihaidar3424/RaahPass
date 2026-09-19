import { describe, expect, it } from "vitest";
import { matchSpokenOption, speechLocale } from "@/lib/speech";
import type { SignOptionKey } from "@/lib/sign-quiz";

const options: { key: SignOptionKey; label: string }[] = [
  { key: "A", label: "No right turn" },
  { key: "B", label: "Stop" },
  { key: "C", label: "Give way" },
];

describe("speech", () => {
  it("maps locale by language", () => {
    expect(speechLocale("en")).toBe("en-PK");
    expect(speechLocale("ur")).toBe("ur-PK");
  });

  it("matches letter answers", () => {
    expect(matchSpokenOption("A", options)).toBe("A");
    expect(matchSpokenOption("option b", options)).toBe("B");
    expect(matchSpokenOption("C", options)).toBe("C");
    expect(matchSpokenOption("one", options)).toBe("A");
    expect(matchSpokenOption("two", options)).toBe("B");
  });

  it("matches option labels", () => {
    expect(matchSpokenOption("Give way", options)).toBe("C");
    expect(matchSpokenOption("no right turn", options)).toBe("A");
  });

  it("returns null for empty or unknown speech", () => {
    expect(matchSpokenOption("", options)).toBeNull();
    expect(matchSpokenOption("xyz unknown", options)).toBeNull();
  });
});

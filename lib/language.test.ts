import { describe, expect, it } from "vitest";
import { parseLanguage, withLang } from "@/lib/language";

describe("language", () => {
  it("parses language query values", () => {
    expect(parseLanguage("ur")).toBe("ur");
    expect(parseLanguage("en")).toBe("en");
    expect(parseLanguage("fr")).toBe("en");
    expect(parseLanguage(undefined)).toBe("en");
    expect(parseLanguage(["ur", "en"])).toBe("ur");
  });

  it("appends lang to a plain path", () => {
    expect(withLang("/sign-test", "ur")).toBe("/sign-test?lang=ur");
    expect(withLang("/", "en")).toBe("/?lang=en");
  });

  it("preserves existing query params and replaces lang", () => {
    expect(withLang("/sign-test/quiz?license=htv", "en")).toBe(
      "/sign-test/quiz?license=htv&lang=en",
    );
    expect(withLang("/fees?lang=en&x=1", "ur")).toBe("/fees?lang=ur&x=1");
  });
});

import { describe, expect, it } from "vitest";
import { dirForLanguage, t } from "@/lib/translations";

describe("translations", () => {
  it("returns English and Urdu strings for speech keys", () => {
    expect(t("en", "speechSpeaker")).toMatch(/speaker/i);
    expect(t("ur", "speechSpeaker").length).toBeGreaterThan(0);
    expect(t("en", "speechMic")).toMatch(/mic/i);
    expect(t("ur", "speechMic")).not.toBe(t("en", "speechMic"));
    expect(t("en", "speechListening")).toMatch(/listen/i);
  });

  it("sets document direction by language", () => {
    expect(dirForLanguage("en")).toBe("ltr");
    expect(dirForLanguage("ur")).toBe("rtl");
  });
});

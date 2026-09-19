import { describe, expect, it } from "vitest";
import {
  SIGN_COUNT,
  categoryLabel,
  filterSigns,
  getAllSigns,
  getSignBySlug,
  getSignCategories,
  signName,
} from "@/lib/traffic-signs";

describe("traffic-signs", () => {
  it("loads a non-empty gallery", () => {
    expect(SIGN_COUNT).toBeGreaterThan(50);
    expect(getAllSigns()).toHaveLength(SIGN_COUNT);
  });

  it("looks up signs by slug", () => {
    const first = getAllSigns()[0];
    expect(first).toBeDefined();
    expect(getSignBySlug(first!.slug)).toEqual(first);
    expect(getSignBySlug("does-not-exist")).toBeUndefined();
  });

  it("exposes categories including informatory", () => {
    const cats = getSignCategories();
    expect(cats).toContain("regulatory");
    expect(cats).toContain("warning");
    expect(cats).toContain("informatory");
    expect(categoryLabel("warning", "en")).toBe("Warning");
    expect(categoryLabel("informatory", "ur").length).toBeGreaterThan(0);
  });

  it("filters by category", () => {
    const warning = filterSigns({ category: "warning" });
    expect(warning.length).toBeGreaterThan(0);
    expect(warning.every((s) => s.category === "warning")).toBe(true);
  });

  it("filters by English and Urdu query", () => {
    const stop = filterSigns({ query: "stop" });
    expect(stop.length).toBeGreaterThan(0);

    const any = getAllSigns().find((s) => s.nameUr.length > 1);
    expect(any).toBeDefined();
    const byUr = filterSigns({ query: any!.nameUr.slice(0, 3) });
    expect(byUr.length).toBeGreaterThan(0);
  });

  it("returns localized names", () => {
    const sign = getAllSigns()[0]!;
    expect(signName(sign, "en")).toBe(sign.nameEn);
    expect(signName(sign, "ur")).toBe(sign.nameUr);
  });

  it("has no corrupt quiz- slug or directory image paths", () => {
    for (const sign of getAllSigns()) {
      expect(sign.slug).not.toBe("quiz-");
      expect(sign.image.endsWith("/")).toBe(false);
      expect(sign.image).not.toBe("/signs/quiz/");
    }
  });
});

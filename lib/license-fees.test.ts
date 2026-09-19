import { describe, expect, it } from "vitest";
import {
  calculateLicenseFee,
  FEE_OFFICIAL_LINKS,
  provinceLabel,
  purposeLabel,
} from "@/lib/license-fees";
import { isLicenseType, LICENSE_TYPES } from "@/lib/license-types";

describe("license-fees", () => {
  it("calculates islamabad motorcar new 1-year fee", () => {
    const fee = calculateLicenseFee({
      province: "islamabad",
      licenseType: "motorcar",
      purpose: "new",
      durationYears: 1,
    });
    expect(fee.baseFee).toBe(1500);
    expect(fee.durationMultiplier).toBe(1);
    expect(fee.lateFee).toBe(0);
    expect(fee.total).toBe(1500);
    expect(fee.currency).toBe("PKR");
  });

  it("applies duration multiplier for renewals", () => {
    const fee = calculateLicenseFee({
      province: "punjab",
      licenseType: "htv",
      purpose: "renewal",
      durationYears: 5,
    });
    expect(fee.durationMultiplier).toBe(4);
    expect(fee.total).toBe(Math.round(2500 * 4));
  });

  it("keeps learner duration multiplier at 1", () => {
    const fee = calculateLicenseFee({
      province: "sindh",
      licenseType: "motorcycle",
      purpose: "learner",
      durationYears: 5,
    });
    expect(fee.durationMultiplier).toBe(1);
    expect(fee.total).toBe(140);
  });

  it("adds 15% late fee when requested", () => {
    const fee = calculateLicenseFee({
      province: "punjab",
      licenseType: "motorcar",
      purpose: "new",
      durationYears: 3,
      lateFee: true,
    });
    const subtotal = Math.round(1200 * 2.5);
    expect(fee.lateFee).toBe(Math.round(subtotal * 0.15));
    expect(fee.total).toBe(subtotal + fee.lateFee);
  });

  it("localizes province and purpose labels", () => {
    expect(provinceLabel("islamabad", "en")).toBe("Islamabad");
    expect(provinceLabel("islamabad", "ur")).toContain("اسلام");
    expect(purposeLabel("learner", "en")).toMatch(/Learner/i);
    expect(purposeLabel("new", "ur").length).toBeGreaterThan(0);
  });

  it("exposes official reference links", () => {
    expect(FEE_OFFICIAL_LINKS.length).toBeGreaterThan(0);
    expect(FEE_OFFICIAL_LINKS.every((l) => l.url.startsWith("http"))).toBe(true);
  });
});

describe("license-types", () => {
  it("validates license type strings", () => {
    expect(LICENSE_TYPES).toContain("motorcar");
    expect(isLicenseType("motorcar")).toBe(true);
    expect(isLicenseType("boat")).toBe(false);
  });
});

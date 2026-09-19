import type { LicenseType } from "@/lib/license-types";
import type { Language } from "@/lib/validations";

export type FeeProvince = "punjab" | "islamabad" | "sindh" | "kpk" | "balochistan";
export type FeePurpose = "new" | "renewal" | "learner";
export type FeeDuration = 1 | 3 | 5;

export const FEE_PROVINCES: FeeProvince[] = [
  "punjab",
  "islamabad",
  "sindh",
  "kpk",
  "balochistan",
];

export const FEE_PURPOSES: FeePurpose[] = ["new", "renewal", "learner"];

export const FEE_DURATIONS: FeeDuration[] = [1, 3, 5];

/** Approximate practice fees (PKR). Not official — for learning only. */
const BASE: Record<
  FeeProvince,
  Record<LicenseType, { new: number; renewal: number; learner: number }>
> = {
  punjab: {
    motorcycle: { new: 450, renewal: 300, learner: 150 },
    motorcar: { new: 1200, renewal: 800, learner: 300 },
    ltv: { new: 2000, renewal: 1400, learner: 500 },
    htv: { new: 3500, renewal: 2500, learner: 800 },
  },
  islamabad: {
    motorcycle: { new: 500, renewal: 350, learner: 200 },
    motorcar: { new: 1500, renewal: 1000, learner: 400 },
    ltv: { new: 2200, renewal: 1600, learner: 600 },
    htv: { new: 4000, renewal: 2800, learner: 900 },
  },
  sindh: {
    motorcycle: { new: 400, renewal: 280, learner: 140 },
    motorcar: { new: 1100, renewal: 750, learner: 280 },
    ltv: { new: 1900, renewal: 1300, learner: 450 },
    htv: { new: 3200, renewal: 2300, learner: 750 },
  },
  kpk: {
    motorcycle: { new: 420, renewal: 290, learner: 145 },
    motorcar: { new: 1150, renewal: 780, learner: 290 },
    ltv: { new: 1950, renewal: 1350, learner: 480 },
    htv: { new: 3300, renewal: 2400, learner: 780 },
  },
  balochistan: {
    motorcycle: { new: 380, renewal: 260, learner: 130 },
    motorcar: { new: 1000, renewal: 700, learner: 250 },
    ltv: { new: 1800, renewal: 1200, learner: 400 },
    htv: { new: 3000, renewal: 2100, learner: 700 },
  },
};

const DURATION_MULT: Record<FeeDuration, number> = {
  1: 1,
  3: 2.5,
  5: 4,
};

export type FeeInput = {
  province: FeeProvince;
  licenseType: LicenseType;
  purpose: FeePurpose;
  durationYears: FeeDuration;
  lateFee?: boolean;
};

export type FeeBreakdown = {
  baseFee: number;
  durationMultiplier: number;
  lateFee: number;
  total: number;
  currency: "PKR";
  disclaimer: { en: string; ur: string };
};

export function calculateLicenseFee(input: FeeInput): FeeBreakdown {
  const baseFee = BASE[input.province][input.licenseType][input.purpose];
  const durationMultiplier = input.purpose === "learner" ? 1 : DURATION_MULT[input.durationYears];
  const subtotal = Math.round(baseFee * durationMultiplier);
  const lateFee = input.lateFee ? Math.round(subtotal * 0.15) : 0;
  return {
    baseFee,
    durationMultiplier,
    lateFee,
    total: subtotal + lateFee,
    currency: "PKR",
    disclaimer: {
      en: "Estimates only for practice. Confirm official fees with your local licensing authority.",
      ur: "صرف مشق کے اندازے ہیں۔ سرکاری فیس اپنے مقامی لائسنس دفتر سے تصدیق کریں۔",
    },
  };
}

export function provinceLabel(province: FeeProvince, lang: Language): string {
  const map: Record<FeeProvince, { en: string; ur: string }> = {
    punjab: { en: "Punjab", ur: "پنجاب" },
    islamabad: { en: "Islamabad", ur: "اسلام آباد" },
    sindh: { en: "Sindh", ur: "سندھ" },
    kpk: { en: "Khyber Pakhtunkhwa", ur: "خیبر پختونخوا" },
    balochistan: { en: "Balochistan", ur: "بلوچستان" },
  };
  return lang === "ur" ? map[province].ur : map[province].en;
}

export function purposeLabel(purpose: FeePurpose, lang: Language): string {
  const map: Record<FeePurpose, { en: string; ur: string }> = {
    new: { en: "New license", ur: "نیا لائسنس" },
    renewal: { en: "Renewal", ur: "تجدید" },
    learner: { en: "Learner permit", ur: "لرنر پرمٹ" },
  };
  return lang === "ur" ? map[purpose].ur : map[purpose].en;
}

/** Public reference pages — fees still approximate. */
export const FEE_OFFICIAL_LINKS: { label: string; labelUr: string; url: string }[] = [
  {
    label: "Punjab Excise & Taxation (licenses)",
    labelUr: "پنجاب ایکسائز اینڈ ٹیکسیشن",
    url: "https://excise.punjab.gov.pk/",
  },
  {
    label: "Islamabad Traffic Police",
    labelUr: "اسلام آباد ٹریفک پولیس",
    url: "https://islamabadtrafficpolice.gov.pk/",
  },
  {
    label: "NHMP — National Highways & Motorway Police",
    labelUr: "قومی شاہراہیں و موٹروے پولیس",
    url: "https://nhmp.gov.pk/",
  },
];

export const LICENSE_TYPES = [
  "motorcycle",
  "motorcar",
  "ltv",
  "htv",
] as const;

export type LicenseType = (typeof LICENSE_TYPES)[number];

export const LICENSE_LABELS: Record<
  LicenseType,
  { en: string; ur: string; shortEn: string; shortUr: string }
> = {
  motorcycle: {
    en: "Motorcycle",
    ur: "موٹر سائیکل",
    shortEn: "Bike",
    shortUr: "بائیک",
  },
  motorcar: {
    en: "Motorcar / Jeep",
    ur: "موٹر کار / جیپ",
    shortEn: "Car",
    shortUr: "کار",
  },
  ltv: {
    en: "LTV (Light Transport)",
    ur: "ایل ٹی وی",
    shortEn: "LTV",
    shortUr: "ایل ٹی وی",
  },
  htv: {
    en: "HTV (Heavy Transport)",
    ur: "ایچ ٹی وی",
    shortEn: "HTV",
    shortUr: "ایچ ٹی وی",
  },
};

export function isLicenseType(value: string): value is LicenseType {
  return (LICENSE_TYPES as readonly string[]).includes(value);
}

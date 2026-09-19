/** OK Driving School — product owner of RaahPass. */
export const OWNER = {
  nameEn: "OK Driving School",
  nameUr: "اوکے ڈرائیونگ اسکول",
  taglineEn: "The pride of capital city",
  taglineUr: "دارالحکومت کا فخر",
  logoSrc: "/brand/ok-driving-school-logo.jpg",
  addressEn:
    "Plaza-35, Ground Floor, Street-19, Jinnah Avenue, Sector J, DHA Phase II, Islamabad",
  addressUr:
    "پلازہ 35، گراؤنڈ فلور، سٹریٹ 19، جناح ایونیو، سیکٹر جے، ڈی ایچ اے فیز II، اسلام آباد",
  phone: "0312-0212015",
  phoneTel: "+923120212015",
  mapsQuery:
    "Plaza-35 Street-19 Jinnah Avenue Sector J DHA Phase II Islamabad",
} as const;

export function ownerMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OWNER.mapsQuery)}`;
}

export function ownerWhatsAppUrl(text: string): string {
  const phone = OWNER.phoneTel.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

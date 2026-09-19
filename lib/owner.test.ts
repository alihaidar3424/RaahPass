import { describe, expect, it } from "vitest";
import { OWNER, ownerMapsUrl, ownerWhatsAppUrl } from "@/lib/owner";

describe("owner", () => {
  it("exposes OK Driving School identity", () => {
    expect(OWNER.nameEn).toBe("OK Driving School");
    expect(OWNER.phoneTel).toMatch(/^\+92/);
    expect(OWNER.logoSrc).toMatch(/^\/brand\//);
  });

  it("builds maps and WhatsApp deep links", () => {
    expect(ownerMapsUrl()).toContain("google.com/maps");
    expect(ownerMapsUrl()).toContain(encodeURIComponent("DHA Phase II"));

    const wa = ownerWhatsAppUrl("Hello from OK Driving School");
    expect(wa).toMatch(/^https:\/\/wa\.me\/923120212015\?text=/);
    expect(wa).toContain(encodeURIComponent("Hello from OK Driving School"));
  });
});

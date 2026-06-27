import { describe, expect, it } from "vitest";
import { createAttemptSchema } from "@/lib/validations";

describe("createAttemptSchema", () => {
  it("accepts valid input", () => {
    const result = createAttemptSchema.safeParse({
      name: "Ahmed Khan",
      phone: "03001234567",
      language: "en",
    });
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = createAttemptSchema.safeParse({
      name: "A",
      phone: "03001234567",
      language: "en",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone characters", () => {
    const result = createAttemptSchema.safeParse({
      name: "Ahmed",
      phone: "abc",
      language: "ur",
    });
    expect(result.success).toBe(false);
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const store = new Map<string, string>();

vi.stubGlobal(
  "Event",
  class Event {
    type: string;
    constructor(type: string) {
      this.type = type;
    }
  },
);

vi.stubGlobal("window", {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

vi.stubGlobal("sessionStorage", {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    store.set(key, value);
  },
  removeItem: (key: string) => {
    store.delete(key);
  },
});

import {
  clearSignSession,
  getSignSessionServerSnapshot,
  getSignSessionSnapshot,
  writeSignSession,
  type SignSessionPayload,
} from "@/lib/sign-session";
import { SIGN_SESSION_KEY } from "@/lib/sign-quiz";

function samplePayload(overrides: Partial<SignSessionPayload> = {}): SignSessionPayload {
  return {
    questions: [
      {
        id: "s-001",
        image: "/signs/r-20.png",
        questionText: "What does this sign mean?",
        options: [
          { key: "A", label: "Left" },
          { key: "B", label: "No right turn" },
          { key: "C", label: "Right" },
        ],
        correct: "B",
      },
    ],
    answers: { "s-001": "B" },
    index: 0,
    startedAt: Date.now(),
    language: "en",
    licenseType: "motorcar",
    ...overrides,
  };
}

describe("sign-session", () => {
  beforeEach(() => {
    store.clear();
  });

  it("returns null on the server snapshot", () => {
    expect(getSignSessionServerSnapshot()).toBeNull();
  });

  it("writes and reads a stable session snapshot", () => {
    const payload = samplePayload();
    writeSignSession(payload);
    expect(store.has(SIGN_SESSION_KEY)).toBe(true);

    const first = getSignSessionSnapshot();
    const second = getSignSessionSnapshot();
    expect(first).toEqual(payload);
    expect(first).toBe(second);
  });

  it("clears the session", () => {
    writeSignSession(samplePayload({ finished: true }));
    clearSignSession();
    expect(getSignSessionSnapshot()).toBeNull();
  });

  it("returns null for corrupt JSON", () => {
    store.set(SIGN_SESSION_KEY, "{not-json");
    // bust cache by writing corrupt then reading via getItem path
    // clear module cache fields by writing then overwriting
    clearSignSession();
    store.set(SIGN_SESSION_KEY, "{not-json");
    // force cache miss: clearSignSession set cachedRaw null; next get parses
    expect(getSignSessionSnapshot()).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { buildAccountShareParam, readAccountFromSearch } from "./shareUrl";

describe("shareUrl", () => {
  it("roundtrips account",
    () => {
      const p = buildAccountShareParam("alice.wam");
      expect(readAccountFromSearch(`?${p}`)).toBe("alice.wam");
    });
});

import { describe, expect, it } from "vitest";
import { PERMISSION_MYTHS } from "./myths";

describe("PERMISSION_MYTHS", () => {
  it("covers active vs owner",
    () => {
      expect(PERMISSION_MYTHS.some((m) => m.myth.includes("active"))).toBe(true);
      expect(PERMISSION_MYTHS.length).toBeGreaterThanOrEqual(4);
    });
});

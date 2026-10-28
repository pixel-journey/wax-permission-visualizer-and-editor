import { describe, expect, it } from "vitest";
import { PERMISSION_GLOSSARY } from "./glossary";

describe("PERMISSION_GLOSSARY", () => {
  it("includes owner and linkauth",
    () => {
      const terms = PERMISSION_GLOSSARY.map((g) => g.term);
      expect(terms).toContain("owner");
      expect(terms).toContain("linkauth");
    });
});

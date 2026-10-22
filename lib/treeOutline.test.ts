import { describe, expect, it } from "vitest";
import { mockSafeGraph } from "./fixtures";
import { treeOutline, treeOutlineMarkdown } from "./treeOutline";

describe("treeOutline", () => {
  it("orders owner before active before gameplay", () => {
    const lines = treeOutline(mockSafeGraph());
    const names = lines.map((l) => l.name);
    expect(names.indexOf("owner")).toBeLessThan(names.indexOf("active"));
    expect(names.indexOf("active")).toBeLessThan(names.indexOf("gameplay"));
    expect(lines.find((l) => l.name === "gameplay")?.depth).toBe(2);
  });

  it("markdown is non-empty", () => {
    expect(treeOutlineMarkdown(mockSafeGraph())).toContain("owner");
  });
});

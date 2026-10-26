import { describe, expect, it } from "vitest";
import { DEFAULT_RPC_URL, resolveRpcUrl, RPC_ENDPOINTS } from "./rpcEndpoints";

describe("rpcEndpoints", () => {
  it("has greymass default",
    () => {
      expect(DEFAULT_RPC_URL).toContain("greymass");
      expect(RPC_ENDPOINTS.length).toBeGreaterThanOrEqual(3);
    });

  it("resolves by id",
    () => {
      expect(resolveRpcUrl("eosrio")).toContain("eosrio");
    });
});

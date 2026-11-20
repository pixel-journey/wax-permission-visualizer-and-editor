/** Public WAX RPC endpoints for soft-fail get_account (educational). */

export const RPC_ENDPOINTS: Array<{ id: string; label: string; url: string }> = [
  { id: "greymass", label: "Greymass", url: "https://wax.greymass.com" },
  { id: "eosrio", label: "EOSrio", url: "https://wax.eosrio.io" },
  { id: "eosphere", label: "EOSphere", url: "https://wax.eosphere.io" },
  { id: "pink", label: "Pink.gg", url: "https://wax.pink.gg" },
];

export const DEFAULT_RPC_URL = RPC_ENDPOINTS[0].url;

export function resolveRpcUrl(idOrUrl: string): string {
  const found = RPC_ENDPOINTS.find((e) => e.id === idOrUrl || e.url === idOrUrl);
  return found?.url ?? (idOrUrl.trim() || DEFAULT_RPC_URL);
}

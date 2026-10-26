import type { PermissionGraph, PermissionNode } from "./types";

/** Minimal shape from chain get_account.permissions */
export interface RawPermissionRow {
  perm_name: string;
  parent: string;
  required_auth?: {
    threshold?: number;
    keys?: Array<{ key: string; weight: number }>;
    accounts?: Array<{
      permission?: { actor: string; permission: string };
      weight?: number;
    }>;
  };
}

export type LinkedActionRow = {
  account: string;
  action: string;
  permission: string;
};

export function parsePermissionRows(
  account: string,
  rows: RawPermissionRow[],
  linkedActions?: LinkedActionRow[]
): PermissionGraph {
  const permissions: Record<string, PermissionNode> = {};

  for (const row of rows) {
    const auth = row.required_auth ?? {};
    permissions[row.perm_name] = {
      name: row.perm_name,
      parent: row.parent || undefined,
      threshold: Number(auth.threshold ?? 1),
      keys: (auth.keys ?? []).map((k) => ({
        key: String(k.key),
        weight: Number(k.weight ?? 1),
      })),
      accounts: (auth.accounts ?? []).map((a) => ({
        permission: {
          actor: String(a.permission?.actor ?? ""),
          permission: String(a.permission?.permission ?? ""),
        },
        weight: Number(a.weight ?? 1),
      })),
    };
  }

  for (const node of Object.values(permissions)) {
    if (!node.parent) continue;
    const parent = permissions[node.parent];
    if (!parent) continue;
    parent.children = parent.children ?? [];
    parent.children.push(node);
  }

  return {
    account,
    permissions,
    lastUpdated: new Date().toISOString(),
    linkedActions: linkedActions?.length ? linkedActions : undefined,
  };
}

export interface FetchGraphResult {
  ok: boolean;
  graph?: PermissionGraph;
  reason?: string;
}

const DEFAULT_RPC = "https://wax.greymass.com";

/** Soft-fail live fetch — never throws. */
export async function fetchPermissionGraph(
  account: string,
  rpcUrl: string = DEFAULT_RPC
): Promise<FetchGraphResult> {
  const name = account.trim();
  if (!name) return { ok: false, reason: "empty account" };

  try {
    const res = await fetch(`${rpcUrl.replace(/\/$/, "")}/v1/chain/get_account`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ account_name: name }),
    });
    if (!res.ok) return { ok: false, reason: `HTTP ${res.status}` };
    const data = (await res.json()) as {
      account_name?: string;
      permissions?: RawPermissionRow[];
      /** Present on some node versions / proxies */
      linked_actions?: Array<{
        account?: string;
        action?: string;
        permission?: string;
      }>;
    };
    const rows = data.permissions ?? [];
    const linked: LinkedActionRow[] = (data.linked_actions ?? [])
      .map((l) => ({
        account: String(l.account ?? ""),
        action: String(l.action ?? ""),
        permission: String(l.permission ?? ""),
      }))
      .filter((l) => l.account || l.action || l.permission);

    return {
      ok: true,
      graph: parsePermissionRows(
        data.account_name ?? name,
        rows,
        linked.length ? linked : undefined
      ),
    };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "fetch failed",
    };
  }
}

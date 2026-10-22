import type { PermissionGraph } from "./types";

export const GRAPH_STORAGE_KEY = "pxj.permission-graph.v1";

export interface StorageResult<T> {
  ok: boolean;
  value?: T;
  reason?: string;
}

function store(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function saveGraphDraft(
  graph: PermissionGraph,
  key: string = GRAPH_STORAGE_KEY
): StorageResult<void> {
  const s = store();
  if (!s) return { ok: false, reason: "localStorage unavailable" };
  try {
    s.setItem(key, JSON.stringify({ graph, savedAt: new Date().toISOString() }));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "setItem failed" };
  }
}

export function loadGraphDraft(
  key: string = GRAPH_STORAGE_KEY
): StorageResult<PermissionGraph> {
  const s = store();
  if (!s) return { ok: false, reason: "localStorage unavailable" };
  try {
    const raw = s.getItem(key);
    if (!raw) return { ok: false, reason: "no draft" };
    const parsed = JSON.parse(raw) as { graph?: PermissionGraph };
    if (!parsed.graph?.permissions) return { ok: false, reason: "invalid draft" };
    return { ok: true, value: parsed.graph };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "parse failed" };
  }
}

export function clearGraphDraft(key: string = GRAPH_STORAGE_KEY): StorageResult<void> {
  const s = store();
  if (!s) return { ok: false, reason: "localStorage unavailable" };
  try {
    s.removeItem(key);
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "remove failed" };
  }
}

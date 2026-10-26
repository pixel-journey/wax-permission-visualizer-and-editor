export function buildAccountShareParam(account: string): string {
  const a = account.trim();
  if (!a) return "";
  return `a=${encodeURIComponent(a)}`;
}

export function readAccountFromSearch(search: string): string | null {
  try {
    const q = new URLSearchParams(
      search.startsWith("?") ? search.slice(1) : search
    );
    const a = q.get("a");
    return a?.trim() || null;
  } catch {
    return null;
  }
}

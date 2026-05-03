/* ─────────────────────────────────────────────────────────────
   Backend API client for Sweet Dreams Cakes
   
   Config is resolved in priority order:
     1. Build-time env vars  (VITE_API_URL, VITE_SHOP_ID)
     2. Runtime localStorage (sd_api_url, sd_shop_id)
   
   Admin token comes from localStorage("sd_sync_token")
   which the SyncPanel lets the admin set.
───────────────────────────────────────────────────────────── */

export function getApiBase(): string {
  return (
    (import.meta.env.VITE_API_URL as string | undefined) ||
    localStorage.getItem("sd_api_url") ||
    ""
  );
}

export function getShopId(): string {
  return (
    (import.meta.env.VITE_SHOP_ID as string | undefined) ||
    localStorage.getItem("sd_shop_id") ||
    ""
  );
}

export function getSyncToken(): string {
  return localStorage.getItem("sd_sync_token") || "admin123";
}

export function isBackendConfigured(): boolean {
  return Boolean(getShopId());
}

/* ── Public: fetch shop data ── */
export async function fetchShopData(
  signal?: AbortSignal,
): Promise<Record<string, unknown> | null> {
  const shopId = getShopId();
  const base = getApiBase();

  if (shopId) {
    const url = `${base}/api/sd/${encodeURIComponent(shopId)}`;
    const res = await fetch(url, { signal, cache: "no-cache" });
    if (!res.ok) return null;
    const json = (await res.json()) as { data: Record<string, unknown> };
    return json.data ?? null;
  }

  /* No shopId saved — try the discovery endpoint to find the primary shop.
     This lets every visitor load real content without manual configuration. */
  const url = `${base}/api/sd`;
  const res = await fetch(url, { signal, cache: "no-cache" });
  if (!res.ok) return null;
  const json = (await res.json()) as { shopId?: string; data: Record<string, unknown> };
  /* Cache the discovered shopId so future fetches go directly */
  if (json.shopId) localStorage.setItem("sd_shop_id", json.shopId);
  return json.data ?? null;
}

/* ── Admin: save shop data ── */
export async function saveShopData(
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; created?: boolean; error?: string }> {
  const shopId = getShopId();
  if (!shopId) return { ok: false, error: "Shop ID not configured" };

  const base = getApiBase();
  const url = `${base}/api/sd/${encodeURIComponent(shopId)}`;
  const token = getSyncToken();

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    return { ok: false, error: body.error || `HTTP ${res.status}` };
  }

  const body = (await res.json()) as { ok: boolean; created?: boolean };
  return body;
}

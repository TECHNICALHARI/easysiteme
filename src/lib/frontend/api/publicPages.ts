export async function getBaseOrigin() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  const envBase =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.BASE_URL ||
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "");
  return envBase;
}

export async function fetchPublicPageServer(username: string) {
  const origin = await getBaseOrigin();
  const url = new URL(`/api/pages/${encodeURIComponent(username)}`, origin).toString();
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status, etag: null };
    const json = await res.json().catch(() => null);
    const etag = res.headers.get("etag") ?? res.headers.get("ETag") ?? null;
    return { data: json?.data ?? null, status: res.status, etag };
  } catch (err: any) {
    console.error("fetchPublicPageServer error:", err?.message || err);
    return { data: null, status: 500, etag: null };
  }
}

export async function fetchPublicPostsServer(username: string) {
  const origin = await getBaseOrigin();
  const url = new URL(`/api/pages/${encodeURIComponent(username)}/posts`, origin).toString();
  try {
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    if (!res.ok) return { data: null, status: res.status, etag: null };
    const json = await res.json().catch(() => null);
    const etag = res.headers.get("etag") ?? res.headers.get("ETag") ?? null;
    return { data: json?.data ?? null, status: res.status, etag };
  } catch (err: any) {
    console.error("fetchPublicPostsServer error:", err?.message || err);
    return { data: null, status: 500, etag: null };
  }
}

export async function fetchPublicPageClient(username: string, ifNoneMatch?: string | null) {
  const headers: Record<string, string> = {};
  if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch;
  const res = await fetch(`/api/pages/${encodeURIComponent(username)}`, {
    method: "GET",
    headers,
    credentials: "same-origin",
  });
  if (res.status === 304) return { status: 304, data: null, etag: ifNoneMatch ?? null };
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
  const json = await res.json().catch(() => null);
  const etag = res.headers.get("etag") ?? res.headers.get("ETag") ?? null;
  return { status: res.status, data: json?.data ?? null, etag };
}

export async function fetchPublicPostsClient(username: string, ifNoneMatch?: string | null) {
  const headers: Record<string, string> = {};
  if (ifNoneMatch) headers["If-None-Match"] = ifNoneMatch;
  const res = await fetch(`/api/pages/${encodeURIComponent(username)}/posts`, {
    method: "GET",
    headers,
    credentials: "same-origin",
  });
  if (res.status === 304) return { status: 304, data: null, etag: ifNoneMatch ?? null };
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new Error(json?.message || `HTTP ${res.status}`);
  }
  const json = await res.json().catch(() => null);
  const etag = res.headers.get("etag") ?? res.headers.get("ETag") ?? null;
  return { status: res.status, data: json?.data ?? null, etag };
}

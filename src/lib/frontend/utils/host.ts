export function getCurrentHost() {
  if (typeof window === "undefined") return null;
  try {
    const h = window.location.host || "";
    return h.split(":")[0].toLowerCase();
  } catch {
    return null;
  }
}

export function isPreviewHostForSubdomain(
  host: string | null,
  subdomain?: string | null
) {
  if (!host) return false;
  const normalized = host.replace(/^www\./, "");
  if (subdomain && normalized === `${subdomain}.myeasypage.com`) return true;
  return false;
}

export function isLocalHost(host?: string | null) {
  if (!host) return false;
  const h = host.split(":")[0].toLowerCase();
  return h === "localhost" || h.startsWith("127.") || h === "0.0.0.0";
}

export function formatPhoneToE164(m?: string) {
  if (!m) return undefined;
  const s = String(m)
    .trim()
    .replace(/[^\d+]/g, "");
  if (s === "") return undefined;
  if (s.startsWith("+")) return s;
  return `+${s}`;
}

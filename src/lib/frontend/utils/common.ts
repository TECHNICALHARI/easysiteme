export function formatPhoneToE164(m?: string) {
  if (!m) return undefined;
  const s = String(m)
    .trim()
    .replace(/[^\d+]/g, "");
  if (s === "") return undefined;
  if (s.startsWith("+")) return s;
  return `+${s}`;
}

export const handleViewResume = (resumePreviewUrl: string | null) => {
  if (!resumePreviewUrl) return;
  window.open(resumePreviewUrl, "_blank", "noopener,noreferrer");
};

const downloadViaFetch = async (url: string, filename: string) => {
  const res = await fetch(url, { credentials: "omit", cache: "no-store" });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
export const handleDownloadResume = async (resumeUrl: string, resumePreviewUrl?: string | null) => {
  const src = resumeUrl || "";
  if (!src) return;

  try {
    if (src.startsWith("http")) {
      await downloadViaFetch(src, "resume.pdf");
    } else {
      const href = resumePreviewUrl ?? src;
      const a = document.createElement("a");
      a.href = href;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  } catch {}
};

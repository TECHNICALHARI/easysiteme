import {
  uploadImageToCloudinary,
  isDataUri,
} from "@/lib/backend/config/cloudinary";

type AnyObject = Record<string, any>;

function extractCloudinaryPublicIdFromUrl(
  url: string | undefined | null
): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    const afterUpload = parts.slice(uploadIdx + 1).join("/");
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExt = withoutVersion.replace(/\.[a-zA-Z0-9]+$/, "");
    return withoutExt || null;
  } catch {
    return null;
  }
}

export async function replaceBase64Images<T extends AnyObject>(
  payload: T,
  fields: string[] = []
): Promise<T> {
  const out: AnyObject = { ...(payload || {}) };

  for (const field of fields) {
    const val = payload?.[field];

    if (!val) {
      // do nothing, but ensure public id remains if already present in payload
      if (payload && typeof payload[`${field}PublicId`] === "string") {
        out[`${field}PublicId`] = payload[`${field}PublicId`];
      }
      continue;
    }

    if (typeof val === "string" && isDataUri(val)) {
      try {
        const base64Part = val.split(",")[1] ?? "";
        const buffer = Buffer.from(base64Part, "base64");
        const res = await uploadImageToCloudinary(buffer, {
          folder: undefined,
          resource_type: "image",
        });
        const url = res?.secure_url ?? res?.url ?? "";
        const publicId = res?.public_id ?? res?.publicId ?? "";
        if (url) out[field] = url;
        if (publicId) out[`${field}PublicId`] = publicId;
        else if (payload && typeof payload[`${field}PublicId`] === "string") {
          out[`${field}PublicId`] = payload[`${field}PublicId`];
        }
      } catch (e) {
        out[field] = out[field];
        if (payload && typeof payload[`${field}PublicId`] === "string") {
          out[`${field}PublicId`] = payload[`${field}PublicId`];
        }
      }
      continue;
    }

    if (typeof val === "string" && /^https?:\/\//.test(val)) {
      const extracted = extractCloudinaryPublicIdFromUrl(val);
      if (extracted) {
        out[`${field}PublicId`] = extracted;
        out[field] = val;
      } else {
        out[field] = val;
        if (payload && typeof payload[`${field}PublicId`] === "string") {
          out[`${field}PublicId`] = payload[`${field}PublicId`];
        }
      }
      continue;
    }

    out[field] = val;
    if (payload && typeof payload[`${field}PublicId`] === "string") {
      out[`${field}PublicId`] = payload[`${field}PublicId`];
    }
  }

  return out as T;
}

import {
  isDataUri,
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} from "@/lib/backend/config/cloudinary";

type AnyObj = Record<string, any>;

function extractPublicIdFromUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "upload");
    if (idx === -1) return null;
    const after = parts.slice(idx + 1).join("/");
    const withoutVersion = after.replace(/^v\d+\//, "");
    const withoutExt = withoutVersion.replace(/\.[a-zA-Z0-9]+$/, "");
    return withoutExt || null;
  } catch {
    return null;
  }
}

export async function replaceProfileBase64Images(payload: AnyObj) {
  const out: AnyObj = { ...(payload || {}) };
  const uploadedPublicIds: string[] = [];
  const uploadedByField: Record<string, string> = {};

  const tryUpload = async (
    val: any,
    opts?: {
      resource_type?: "image" | "raw";
      public_id?: string;
      format?: string;
      filename_override?: string;
    }
  ) => {
    if (typeof val === "string" && isDataUri(val)) {
      const base64Part = val.split(",")[1] ?? "";
      const buffer = Buffer.from(base64Part, "base64");
      const res = await uploadImageToCloudinary(buffer, {
        resource_type: opts?.resource_type ?? "image",
        type: "upload",
        access_mode: "public",
        public_id: opts?.public_id,
        overwrite: true,
        format: opts?.format,
        use_filename: true,
        unique_filename: true,
        filename_override: opts?.filename_override,
      });
      const url = res?.secure_url ?? res?.url ?? "";
      const publicId = res?.public_id ?? (res as any)?.publicId ?? "";
      return { url, publicId };
    }
    return null;
  };

  if (out.profile) {
    const p = out.profile;

    if (p.avatar === "" || p.avatar == null) p.avatarPublicId = "";
    if (p.bannerImage === "" || p.bannerImage == null) p.bannerPublicId = "";
    if (p.resumeUrl === "" || p.resumeUrl == null) p.resumePublicId = "";

    if (p.avatar) {
      const uploaded = await tryUpload(p.avatar, { resource_type: "image" });
      if (uploaded) {
        p.avatar = uploaded.url;
        p.avatarPublicId = uploaded.publicId;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedByField["profile.avatarPublicId"] = uploaded.publicId;
      } else if (!p.avatarPublicId) {
        const extracted = extractPublicIdFromUrl(p.avatar);
        if (extracted) p.avatarPublicId = extracted;
      }
    }

    if (p.bannerImage) {
      const uploaded = await tryUpload(p.bannerImage, {
        resource_type: "image",
      });
      if (uploaded) {
        p.bannerImage = uploaded.url;
        p.bannerPublicId = uploaded.publicId;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedByField["profile.bannerPublicId"] = uploaded.publicId;
      } else if (!p.bannerPublicId) {
        const extracted = extractPublicIdFromUrl(p.bannerImage);
        if (extracted) p.bannerPublicId = extracted;
      }
    }

    if (p.resumeUrl) {
      const uploaded = await tryUpload(p.resumeUrl, {
        resource_type: "raw",
        format: "pdf",
        filename_override: `resume_${Date.now()}`,
      });
      if (uploaded) {
        p.resumeUrl = uploaded.url;
        p.resumePublicId = uploaded.publicId;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedByField["profile.resumePublicId"] = uploaded.publicId;
      } else if (!p.resumePublicId) {
        const extracted = extractPublicIdFromUrl(p.resumeUrl);
        if (extracted) p.resumePublicId = extracted;
      }
    }

    if (p.resume && typeof p.resume === "object") {
      const nestedUrl = p.resume.resumeUrl;
      const nestedPid = p.resume.resumePublicId;
      if (!p.resumeUrl && nestedUrl) p.resumeUrl = nestedUrl;
      if (!p.resumePublicId && nestedPid) p.resumePublicId = nestedPid;
      delete p.resume;
    }

    if (Array.isArray(p.links)) {
      for (let i = 0; i < p.links.length; i++) {
        const link = p.links[i];
        if (link?.image === "" || link?.image == null) link.imagePublicId = "";
        if (link?.image) {
          const uploaded = await tryUpload(link.image, {
            resource_type: "image",
          });
          if (uploaded) {
            link.image = uploaded.url;
            link.imagePublicId = uploaded.publicId;
            uploadedPublicIds.push(uploaded.publicId);
            uploadedByField[`profile.links[${i}].imagePublicId`] =
              uploaded.publicId;
          } else if (!link.imagePublicId) {
            const extracted = extractPublicIdFromUrl(link.image);
            if (extracted) link.imagePublicId = extracted;
          }
        }
      }
    }

    if (Array.isArray(p.testimonials)) {
      for (let i = 0; i < p.testimonials.length; i++) {
        const t = p.testimonials[i];
        if (t?.avatar === "" || t?.avatar == null) t.avatarPublicId = "";
        if (t?.avatar) {
          const uploaded = await tryUpload(t.avatar, {
            resource_type: "image",
          });
          if (uploaded) {
            t.avatar = uploaded.url;
            t.avatarPublicId = uploaded.publicId;
            uploadedPublicIds.push(uploaded.publicId);
            uploadedByField[`profile.testimonials[${i}].avatarPublicId`] =
              uploaded.publicId;
          } else if (!t.avatarPublicId) {
            const extracted = extractPublicIdFromUrl(t.avatar);
            if (extracted) t.avatarPublicId = extracted;
          }
        }
      }
    }

    if (Array.isArray(p.services)) {
      for (let i = 0; i < p.services.length; i++) {
        const s = p.services[i];
        if (s?.image === "" || s?.image == null) s.imagePublicId = "";
        if (s?.image) {
          const uploaded = await tryUpload(s.image, { resource_type: "image" });
          if (uploaded) {
            s.image = uploaded.url;
            s.imagePublicId = uploaded.publicId;
            uploadedPublicIds.push(uploaded.publicId);
            uploadedByField[`profile.services[${i}].imagePublicId`] =
              uploaded.publicId;
          } else if (!s.imagePublicId) {
            const extracted = extractPublicIdFromUrl(s.image);
            if (extracted) s.imagePublicId = extracted;
          }
        }
      }
    }

    if (Array.isArray(p.featured)) {
      for (let i = 0; i < p.featured.length; i++) {
        const f = p.featured[i];
        if (!f) continue;
        if (f.url === "" || f.url == null) f.urlPublicId = "";
        if (f.url) {
          const uploaded = await tryUpload(f.url, { resource_type: "image" });
          if (uploaded) {
            f.url = uploaded.url;
            f.urlPublicId = uploaded.publicId;
            uploadedPublicIds.push(uploaded.publicId);
            uploadedByField[`profile.featured[${i}].urlPublicId`] =
              uploaded.publicId;
          } else if (!f.urlPublicId) {
            const extracted = extractPublicIdFromUrl(f.url);
            if (extracted) f.urlPublicId = extracted;
          }
        }
      }
    }
  }

  if (out.settings?.seo) {
    const seo = out.settings.seo;
    if (seo.ogImage === "" || seo.ogImage == null) seo.ogImagePublicId = "";
    if (seo.twitterImage === "" || seo.twitterImage == null)
      seo.twitterImagePublicId = "";

    if (seo.ogImage) {
      const uploaded = await tryUpload(seo.ogImage, { resource_type: "image" });
      if (uploaded) {
        seo.ogImage = uploaded.url;
        seo.ogImagePublicId = uploaded.publicId;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedByField["settings.seo.ogImagePublicId"] = uploaded.publicId;
      } else if (!seo.ogImagePublicId) {
        const extracted = extractPublicIdFromUrl(seo.ogImage);
        if (extracted) seo.ogImagePublicId = extracted;
      }
    }
    if (seo.twitterImage) {
      const uploaded = await tryUpload(seo.twitterImage, {
        resource_type: "image",
      });
      if (uploaded) {
        seo.twitterImage = uploaded.url;
        seo.twitterImagePublicId = uploaded.publicId;
        uploadedPublicIds.push(uploaded.publicId);
        uploadedByField["settings.seo.twitterImagePublicId"] =
          uploaded.publicId;
      } else if (!seo.twitterImagePublicId) {
        const extracted = extractPublicIdFromUrl(seo.twitterImage);
        if (extracted) seo.twitterImagePublicId = extracted;
      }
    }
  }

  return { processed: out, uploadedPublicIds, uploadedByField };
}

export function collectPublicIdsFromDoc(doc: AnyObj): Set<string> {
  const set = new Set<string>();
  function walk(obj: any) {
    if (!obj || typeof obj !== "object") return;
    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === "string" && /publicId$/i.test(k) && v) set.add(v);
      else if (typeof v === "string" && /public_id$/i.test(k) && v) set.add(v);
      else if (typeof v === "object") walk(v);
    }
  }
  walk(doc);
  return set;
}

export async function removeUnusedPublicIds(
  oldSet: Set<string>,
  newSet: Set<string>
) {
  const toDelete: string[] = [];
  for (const id of oldSet) if (!newSet.has(id)) toDelete.push(id);

  const tryDestroy = async (publicId: string) => {
    const types: Array<"image" | "raw" | "video"> = ["raw", "image", "video"];
    for (const rt of types) {
      try {
        const res = await destroyImageFromCloudinary(publicId, rt, "upload");
        if (res?.result === "ok" || res?.result === "not_found") return;
      } catch {}
    }
  };

  for (const id of toDelete) {
    await tryDestroy(id);
  }
}

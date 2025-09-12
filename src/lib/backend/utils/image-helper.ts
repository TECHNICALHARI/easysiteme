import {
  uploadImageToCloudinary,
  isDataUri,
} from "@/lib/backend/config/cloudinary";
import { appConfig } from "@/lib/backend/config";

export async function replaceBase64Images<T extends Record<string, any>>(
  obj: T,
  keys: string[]
): Promise<T> {
  const out: T = { ...obj };
  await Promise.all(
    keys.map(async (key) => {
      try {
        const val = out[key];
        if (val === undefined || val === null) return;
        if (typeof val === "string" && isDataUri(val)) {
          const res = await uploadImageToCloudinary(val, {
            folder: appConfig.CLOUDINARY_UPLOAD_FOLDER,
            public_id: `${key}_${Date.now()}`,
            resource_type: "image",
          });
          (out as any)[key] = res.secure_url ?? res.url ?? "";
          return;
        }
        if (Buffer.isBuffer(val)) {
          const res = await uploadImageToCloudinary(val, {
            folder: appConfig.CLOUDINARY_UPLOAD_FOLDER,
            public_id: `${key}_${Date.now()}`,
            resource_type: "image",
          });
          (out as any)[key] = res.secure_url ?? res.url ?? "";
          return;
        }
        if (typeof val === "object" && val !== null) {
          const maybe =
            (val as any).data ??
            (val as any).base64 ??
            (val as any).buffer ??
            (val as any).file;
          if (typeof maybe === "string" && isDataUri(maybe)) {
            const res = await uploadImageToCloudinary(maybe, {
              folder: appConfig.CLOUDINARY_UPLOAD_FOLDER,
              public_id: `${key}_${Date.now()}`,
              resource_type: "image",
            });
            (out as any)[key] = res.secure_url ?? res.url ?? "";
            return;
          }
          if (Buffer.isBuffer(maybe)) {
            const res = await uploadImageToCloudinary(maybe, {
              folder: appConfig.CLOUDINARY_UPLOAD_FOLDER,
              public_id: `${key}_${Date.now()}`,
              resource_type: "image",
            });
            (out as any)[key] = res.secure_url ?? res.url ?? "";
            return;
          }
        }
      } catch (err) {
        console.error(`replaceBase64Images error key=${key}`, err);
      }
    })
  );
  return out;
}

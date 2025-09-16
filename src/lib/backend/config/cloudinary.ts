// src/lib/backend/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { appConfig } from "@/lib/backend/config";

cloudinary.config({
  cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
  api_key: appConfig.CLOUDINARY_API_KEY,
  api_secret: appConfig.CLOUDINARY_API_SECRET,
});

export function isDataUri(val: unknown): boolean {
  return typeof val === "string" && /^data:[\w/+.-]+;base64,/.test(val);
}

export type UploadOptions = {
  folder?: string;
  public_id?: string;
  resource_type?: "image" | "auto" | "raw" | "video";
  overwrite?: boolean;
  transformation?: any;
};

export async function uploadImageToCloudinary(
  payload: string | Buffer,
  opts: UploadOptions = {}
): Promise<{
  secure_url: string;
  url: string;
  public_id: string;
  [key: string]: any;
}> {
  if (typeof payload === "string" && isDataUri(payload)) {
    return cloudinary.uploader.upload(payload, {
      folder: opts.folder,
      public_id: opts.public_id,
      resource_type: opts.resource_type ?? "image",
      overwrite: opts.overwrite ?? false,
      transformation: opts.transformation,
    });
  }

  if (Buffer.isBuffer(payload)) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: opts.folder,
          public_id: opts.public_id,
          resource_type: opts.resource_type ?? "image",
          overwrite: opts.overwrite ?? false,
          transformation: opts.transformation,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as any);
        }
      );
      streamifier.createReadStream(payload).pipe(uploadStream);
    });
  }

  throw new TypeError("payload must be a data URI string or a Buffer");
}

export async function destroyImageFromCloudinary(
  publicId: string,
  resource_type: "image" | "auto" | "raw" | "video" = "image"
): Promise<any> {
  if (!publicId) return { result: "not_found" };
  return cloudinary.uploader.destroy(publicId, { resource_type });
}

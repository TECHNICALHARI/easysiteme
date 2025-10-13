import { v2 as cloudinary } from "cloudinary";
import { appConfig } from "../config";

cloudinary.config({
  cloud_name: appConfig.CLOUDINARY_CLOUD_NAME,
  api_key: appConfig.CLOUDINARY_API_KEY,
  api_secret: appConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

const FOLDER = appConfig.CLOUDINARY_UPLOAD_FOLDER;

export type UploadResult = {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
};

export async function uploadBuffer(
  buffer: Buffer,
  filename = "file"
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: `${filename}-${Date.now()}`,
        resource_type: "image",
        overwrite: false,
      },
      (err, res) => {
        if (err) return reject(err);
        if (!res) return reject(new Error("No response from cloudinary"));
        resolve({
          publicId: res.public_id,
          url: res.secure_url,
          width: res.width,
          height: res.height,
        });
      }
    );
    stream.end(buffer);
  });
}

export async function deleteResource(publicId: string) {
  return cloudinary.uploader.destroy(publicId);
}

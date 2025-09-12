import { NextRequest } from "next/server";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import {
  uploadImageToCloudinary,
  destroyImageFromCloudinary,
} from "@/lib/backend/config/cloudinary";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { appConfig } from "@/lib/backend/config";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const prevPublicIdRaw = form.get("prevPublicId");
    const prevPublicId =
      typeof prevPublicIdRaw === "string" ? prevPublicIdRaw : undefined;
    if (!file) return errorResponse("file required", 400, req);
    const buffer = Buffer.from(await file.arrayBuffer());
    const res = await uploadImageToCloudinary(buffer, {
      folder: appConfig.CLOUDINARY_UPLOAD_FOLDER,
      public_id: undefined,
      resource_type: "image",
    });
    const url = res.secure_url ?? res.url ?? "";
    const publicId = res.public_id ?? res.publicId ?? "";
    if (prevPublicId && prevPublicId !== publicId) {
      try {
        await destroyImageFromCloudinary(prevPublicId);
      } catch {}
    }
    return successResponse({ url, publicId }, "Uploaded", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Upload failed", 500, req);
  }
}

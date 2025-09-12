import { NextRequest } from "next/server";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { destroyImageFromCloudinary } from "@/lib/backend/config/cloudinary";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const publicId = body?.publicId;
    if (!publicId) return errorResponse("publicId required", 400, req);
    await destroyImageFromCloudinary(publicId);
    return successResponse({}, "Deleted", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Delete failed", 500, req);
  }
}

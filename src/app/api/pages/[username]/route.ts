import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getProfileDesign } from "@/lib/backend/services/profileDesign.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { resolveOwnerFromRequest } from "@/lib/backend/utils/resolveOwnerFromRequest";

export async function GET(req: NextRequest, context: { params?: any }) {
  try {
    await connectDb();
    const params = await (context?.params ?? {});
    const username = params?.username ?? "";
    const resolved = await resolveOwnerFromRequest(req, username);
    if (!resolved.ownerId) return errorResponse("User not found", 404, req);
    const profileDoc = await getProfileDesign(resolved.ownerId);
    if (!profileDoc) return errorResponse("Not found", 404, req);
    const etag = profileDoc.updatedAt ? new Date(profileDoc.updatedAt).toISOString() : null;
    return new Response(JSON.stringify({ success: true, data: profileDoc }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(etag ? { ETag: etag } : {}),
      },
    });
  } catch (err: any) {
    return errorResponse(err?.message || "Internal server error", 500, req);
  }
}

import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const userDoc: any = await getAuthUserFromCookie(req as unknown as Request);
    if (!userDoc) {
      return errorResponse("Unauthorized", 401, req);
    }
    const userPublic = {
      id: String(userDoc._id),
      subdomain: userDoc.subdomain ?? null,
      email: userDoc.email ?? null,
      mobile: userDoc.mobile ?? null,
      countryCode: userDoc.countryCode ?? null,
      emailVerified: Boolean(userDoc.emailVerified),
      mobileVerified: Boolean(userDoc.mobileVerified),
      roles: Array.isArray(userDoc.roles) ? userDoc.roles : [],
      plan: userDoc.plan ?? null,
      createdAt: userDoc.createdAt
        ? new Date(userDoc.createdAt).toISOString()
        : null,
    };
    return successResponse({ user: userPublic }, "OK", 200, req);
  } catch (err: any) {
    console.error("GET /api/user/me error:", err);
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}

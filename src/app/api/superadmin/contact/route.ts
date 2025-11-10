import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { RoleEnum } from "@/lib/backend/constants/enums";
import { ContactService } from "@/lib/backend/services/contact.service";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req as unknown as Request);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const roles = Array.isArray((user as any).roles) ? (user as any).roles : [];
    if (!roles.includes(RoleEnum.SUPERADMIN)) {
      return errorResponse("Forbidden", 403, req);
    }

    const url = req.nextUrl;
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("limit") || "20"))
    );
    const result = await ContactService.list({ page, limit });

    return successResponse(
      {
        contacts: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      "OK",
      200,
      req
    );
  } catch (err: any) {
    console.error("superadmin contact GET err:", err);
    return errorResponse(err?.message || "Internal server error", 500, req);
  }
}

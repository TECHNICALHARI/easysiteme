import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { RoleEnum } from "@/lib/backend/constants/enums";
import SuperadminUserService from "@/lib/backend/services/superadminUser.service";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req as unknown as Request);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const roles = Array.isArray((user as any).roles) ? (user as any).roles : [];
    if (!roles.includes(RoleEnum.SUPERADMIN))
      return errorResponse("Forbidden", 403, req);

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      200,
      Math.max(1, Number(url.searchParams.get("limit") || "20"))
    );
    const q = url.searchParams.get("q") || undefined;
    const plan = url.searchParams.get("plan") || undefined;

    const result = await SuperadminUserService.listUsers({
      page,
      limit,
      q,
      plan,
    });

    return successResponse(
      {
        users: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      "OK",
      200,
      req
    );
  } catch (err: any) {
    console.error("superadmin users GET err:", err);
    return errorResponse(err?.message || "Failed to fetch users", 500, req);
  }
}

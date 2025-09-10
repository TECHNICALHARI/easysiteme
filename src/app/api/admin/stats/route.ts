import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { StatService } from "@/lib/backend/services/stats.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const service = new StatService();
    const stats = await service.getStats(user.id);

    return successResponse({ stats }, "OK", 200, req);
  } catch (err: any) {
    console.error("admin stats error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

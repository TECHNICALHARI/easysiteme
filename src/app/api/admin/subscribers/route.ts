import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { SubscriberService } from "@/lib/backend/services/subscriber.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const service = new SubscriberService();
    const list = await service.listSubscribers(user.id);
    const stats = await service.stats(user.id);

    return successResponse({ list, stats }, "OK", 200, req);
  } catch (err: any) {
    console.error("admin subscribers error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

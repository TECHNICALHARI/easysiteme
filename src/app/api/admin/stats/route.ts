import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { StatsService } from "@/lib/backend/services/stats.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const stats = await StatsService.get(String(user._id));
    return successResponse({ stats }, "OK", 200, req);
  } catch (err: any) {
    console.error("stats GET error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const { key, payload } = body;
    if (!key) return errorResponse("Missing key", 400, req);
    await StatsService.record(String(user._id), key, payload);
    return successResponse({}, "Recorded", 200, req);
  } catch (err: any) {
    console.error("stats POST error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

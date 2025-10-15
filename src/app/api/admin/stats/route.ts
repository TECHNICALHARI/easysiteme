import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { statsService } from "@/lib/backend/services/stats.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { statsSchema } from "@/lib/backend/validators/stats.schema";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const s = await statsService.getByOwner(user.id);
    return successResponse({ stats: s ?? {} }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch stats", 500, req);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const parsed = statsSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({ message: "Validation error", data: parsed.error.format() }, 422, req);
    }
    const updated = await statsService.upsert(user.id, parsed.data);
    return successResponse({ stats: updated }, "Updated", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError) return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to update stats", 500, req);
  }
}

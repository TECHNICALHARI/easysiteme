import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { getProfileDesign, saveProfileDesign } from "@/lib/backend/services/profileDesign.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { ProfileDesignSchema } from "@/lib/backend/validators/profileDesign.schema";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const doc = await getProfileDesign(user.id);
    return successResponse({ profileDesign: doc }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch profile design", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const parsed = ProfileDesignSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse({ message: "Validation error", data: parsed.error.format() }, 422, req);
    }
    const saved = await saveProfileDesign(user.id, parsed.data);
    return successResponse({ profileDesign: saved }, "Saved", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError) return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to save profile design", 500, req);
  }
}

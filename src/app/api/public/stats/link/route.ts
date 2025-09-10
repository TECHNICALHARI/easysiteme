import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { trackLinkSchema } from "@/lib/backend/validators/stats.schema";
import { StatService } from "@/lib/backend/services/stats.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const parsed = trackLinkSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const service = new StatService();
    const doc = await service.trackLink(parsed.data);

    return successResponse(
      { tracked: true, id: doc._id },
      "Link tracked",
      200,
      req
    );
  } catch (err: any) {
    console.error("stats/link error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { trackTrafficSchema } from "@/lib/backend/validators/stats.schema";
import { StatService } from "@/lib/backend/services/stats.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const parsed = trackTrafficSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const service = new StatService();
    const doc = await service.trackTraffic(parsed.data);

    return successResponse(
      { tracked: true, id: doc._id },
      "Traffic tracked",
      200,
      req
    );
  } catch (err: any) {
    console.error("stats/traffic error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

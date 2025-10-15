import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { statsService } from "@/lib/backend/services/stats.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { User } from "@/lib/backend/models/User.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const ownerId = body.ownerId;
    let targetOwnerId = ownerId;
    if (!targetOwnerId && body.ownerSubdomain) {
      const u = await User.findOne({ subdomain: body.ownerSubdomain })
        .select("_id")
        .lean()
        .exec();
      if (u && (u as any)._id) targetOwnerId = String((u as any)._id);
    }
    if (!targetOwnerId)
      return errorResponse("ownerId or ownerSubdomain required", 400, req);
    const source = body.source || body.label || "unknown";
    const value = typeof body.value === "number" ? body.value : 1;
    await statsService.addTrafficSource(
      targetOwnerId,
      String(source),
      Number(value)
    );
    return successResponse({ tracked: true }, "Tracked", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to track traffic", 500, req);
  }
}

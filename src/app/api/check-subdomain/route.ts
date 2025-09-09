import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { User } from "@/lib/backend/models/User.model";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const subdomainRaw = (url.searchParams.get("subdomain") || "").trim();
    const subdomain = subdomainRaw.toLowerCase();

    if (!subdomain)
      return errorResponse("Subdomain query is required", 400, req);

    if (subdomain.length < 3 || subdomain.length > 63) {
      return errorResponse("Subdomain must be 3–63 characters", 400, req);
    }

    if (!/^[a-z0-9](?!.*--)[a-z0-9-]*[a-z0-9]$/.test(subdomain)) {
      return errorResponse(
        "Subdomain may contain lowercase letters, numbers and single hyphens; cannot start/end with hyphen or contain consecutive hyphens",
        400,
        req
      );
    }

    const reserved = new Set([
      "www",
      "admin",
      "api",
      "mail",
      "support",
      "help",
      "dashboard",
    ]);
    if (reserved.has(subdomain)) {
      return successResponse(
        { available: false, reason: "reserved" },
        "Subdomain is reserved",
        200,
        req
      );
    }

    try {
      await connectDb();
    } catch (dbErr: any) {
      console.error("check-subdomain - DB connection error:", dbErr);
      return errorResponse("Database connection error", 500, req);
    }

    const existing = await User.findOne({ subdomain })
      .select("_id")
      .lean()
      .exec();
    const available = !existing;

    return successResponse(
      { available, reason: available ? "available" : "taken" },
      available ? "Subdomain is available" : "Subdomain already taken",
      200,
      req
    );
  } catch (err: any) {
    console.error("check-subdomain error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import featuredMakersService from "@/lib/backend/services/featuredMakers.service";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const url = new URL(req.url);
    const limit = Math.min(
      100,
      parseInt(url.searchParams.get("limit") || "12", 10) || 12
    );
    const skip = Math.max(
      0,
      parseInt(url.searchParams.get("skip") || "0", 10) || 0
    );
    const rows = await featuredMakersService.listPublic(limit, skip);
    return successResponse(rows, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(
      err?.message || "Failed to fetch featured makers",
      500,
      req
    );
  }
}

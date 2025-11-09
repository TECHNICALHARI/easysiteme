import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { listFeaturedMakers } from "@/lib/backend/services/featuredMakers.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "12");
    const skip = Number(searchParams.get("skip") ?? "0");

    const data = await listFeaturedMakers({ limit, skip });

    return successResponse(
      { items: data, page: { limit, skip, count: data.length } },
      "OK",
      200,
      req
    );
  } catch (err: any) {
    return errorResponse(
      err?.message || "Failed to fetch featured makers",
      500,
      req
    );
  }
}

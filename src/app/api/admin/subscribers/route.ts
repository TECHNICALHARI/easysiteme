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
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? 100);
    const skip = Number(url.searchParams.get("skip") ?? 0);
    const res = await SubscriberService.list(String(user._id), limit, skip);
    return successResponse(res, "OK", 200, req);
  } catch (err: any) {
    console.error("subscribers GET error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const added = await SubscriberService.add(String(user._id), body);
    return successResponse({ subscriber: added }, "Added", 201, req);
  } catch (err: any) {
    console.error("subscribers POST error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return errorResponse("Missing id", 400, req);
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    await SubscriberService.remove(String(user._id), id);
    return successResponse({}, "Deleted", 200, req);
  } catch (err: any) {
    console.error("subscribers DELETE error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

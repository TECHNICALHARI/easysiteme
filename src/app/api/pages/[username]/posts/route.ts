import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { resolveOwnerFromRequest } from "@/lib/backend/utils/resolveOwnerFromRequest";
import { Post } from "@/lib/backend/models/Post.model";
import { connectDb } from "@/lib/backend/config/db";

export async function GET(req: NextRequest, context: { params?: any }) {
  try {
    await connectDb();
    const params = await (context?.params ?? {});
    const username = params?.username ?? "";
    const resolved = await resolveOwnerFromRequest(req, username);
    if (!resolved.ownerId) return errorResponse("Owner not found", 404, req);
    const posts = await Post.find({ owner: resolved.ownerId, published: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean()
      .exec();
    return successResponse({ posts: posts ?? [] }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch posts", 500, req);
  }
}

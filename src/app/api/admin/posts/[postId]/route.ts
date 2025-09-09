import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { PostService } from "@/lib/backend/services/post.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const post = await PostService.get(String(user._id), params.postId);
    if (!post) return errorResponse("Post not found", 404, req);
    return successResponse({ post }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await req.json();
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const updated = await PostService.update(
      String(user._id),
      params.postId,
      body
    );
    if (!updated)
      return errorResponse("Post not found or not updated", 404, req);
    return successResponse({ post: updated }, "Updated", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const removed = await PostService.remove(String(user._id), params.postId);
    if (!removed) return errorResponse("Post not found", 404, req);
    return successResponse({ deleted: true }, "Deleted", 200, req);
  } catch (err: any) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}

import { NextRequest } from "next/server";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import {
  listPosts,
  createPost,
  updatePost,
  deletePost,
  togglePublishPost,
} from "@/lib/backend/services/post.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const posts = await listPosts(user.id);
    return successResponse({ posts }, "Fetched posts", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch posts", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const body = await req.json();
    const post = await createPost(user.id, body);
    return successResponse({ post }, "Post created", 201, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to create post", 500, req);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const body = await req.json();
    const postId = body?.postId;
    if (!postId) return errorResponse("postId required", 400, req);

    // Handle toggle publish if payload is just { postId, published }
    if (
      typeof body.published !== "undefined" &&
      Object.keys(body).length === 2
    ) {
      const updated = await togglePublishPost(
        user.id,
        postId,
        Boolean(body.published)
      );
      return successResponse({ post: updated }, "Publish toggled", 200, req);
    }

    const updated = await updatePost(user.id, postId, body);
    return successResponse({ post: updated }, "Post updated", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to update post", 500, req);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");
    if (!postId) return errorResponse("postId required", 400, req);

    await deletePost(user.id, postId);
    return successResponse({}, "Post deleted", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to delete post", 500, req);
  }
}

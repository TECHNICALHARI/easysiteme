import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { PostService } from "@/lib/backend/services/post.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { createPostSchema, updatePostSchema } from "@/lib/backend/validators/post.schema";

const service = new PostService();

export async function GET(req: NextRequest) {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  if (!user) return errorResponse("Unauthorized", 401, req);

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  const slug = searchParams.get("slug");

  if (postId) {
    const post = await service.getById(user.id, postId);
    if (!post) return errorResponse("Post not found", 404, req);
    return successResponse({ post }, "OK", 200, req);
  }

  if (slug) {
    const post = await service.getBySlug(user.id, slug);
    if (!post) return errorResponse("Post not found", 404, req);
    return successResponse({ post }, "OK", 200, req);
  }

  const posts = await service.list(user.id);
  return successResponse({ posts }, "OK", 200, req);
}

export async function POST(req: NextRequest) {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  if (!user) return errorResponse("Unauthorized", 401, req);

  const body = await req.json();
  const parsed = createPostSchema.parse(body);

  const post = await service.create(user.id, parsed);
  return successResponse({ post }, "Created", 201, req);
}

export async function PUT(req: NextRequest) {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  if (!user) return errorResponse("Unauthorized", 401, req);

  const body = await req.json();
  const parsed = updatePostSchema.parse(body);

  if (!parsed.postId) return errorResponse("postId required", 400, req);

  const updated = await service.update(user.id, parsed.postId, parsed);
  if (!updated) return errorResponse("Post not found", 404, req);

  return successResponse({ post: updated }, "Updated", 200, req);
}

export async function DELETE(req: NextRequest) {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  if (!user) return errorResponse("Unauthorized", 401, req);

  const { searchParams } = new URL(req.url);
  const postId = searchParams.get("postId");
  if (!postId) return errorResponse("postId required", 400, req);

  const ok = await service.delete(user.id, postId);
  if (!ok) return errorResponse("Post not found", 404, req);

  return successResponse({}, "Deleted", 200, req);
}

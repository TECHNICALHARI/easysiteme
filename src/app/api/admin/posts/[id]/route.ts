import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { PostService } from "@/lib/backend/services/post.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { updatePostSchema } from "@/lib/backend/validators/post.schema";

const service = new PostService();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const post = await service.getById(user.id, params.id);
    if (!post) return errorResponse("Post not found", 404, req);
    return successResponse({ post }, "OK", 200, req);
  } catch {
    return errorResponse("Internal server error", 500, req);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const merged = { ...body, postId: params.id };
    const parsed = updatePostSchema.safeParse(merged);
    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }
    const updated = await service.update(user.id, params.id, parsed.data);
    if (!updated) return errorResponse("Post not found", 404, req);
    return successResponse({ post: updated }, "Updated", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const ok = await service.delete(user.id, params.id);
    if (!ok) return errorResponse("Post not found", 404, req);
    return successResponse({}, "Deleted", 200, req);
  } catch {
    return errorResponse("Internal server error", 500, req);
  }
}

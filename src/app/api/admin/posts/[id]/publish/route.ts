import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { PostService } from "@/lib/backend/services/post.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

const service = new PostService();

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const publish = Boolean(body?.publish);
    const updated = await service.togglePublish(user.id, params.id, publish);
    if (!updated) return errorResponse("Post not found", 404, req);
    return successResponse(
      { post: updated },
      publish ? "Published" : "Unpublished",
      200,
      req
    );
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

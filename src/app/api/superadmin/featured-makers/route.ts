import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { RoleEnum } from "@/lib/backend/constants/enums";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import featuredMakersService from "@/lib/backend/services/featuredMakers.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req as unknown as Request);
    if (!user) return errorResponse("Unauthorized", 401, req);
    if (!Array.isArray(user.roles) || !user.roles.includes(RoleEnum.SUPERADMIN))
      return errorResponse("Forbidden", 403, req);

    const body = await req.json();
    const subdomain = (body.subdomain || "").toString().trim();
    if (!subdomain) return errorResponse("subdomain is required", 400, req);
    const featured = Boolean(body.featured);
    const rank = body.rank !== undefined ? Number(body.rank) : undefined;
    const headline =
      body.headline !== undefined ? String(body.headline) : undefined;

    const doc = await featuredMakersService.setFeaturedForSubdomain(
      subdomain,
      featured,
      rank,
      headline
    );
    return successResponse({ result: doc }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed", 500, req);
  }
}

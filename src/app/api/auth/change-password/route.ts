import { NextRequest } from "next/server";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { UserService } from "@/lib/backend/services/user.service";
import { hashPassword } from "@/lib/backend/utils/hash";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const limiter = await enforceRateLimit(
      "GLOBAL",
      String((user as any)._id ?? "unknown"),
      req,
      "Too many requests. Try later."
    );
    if (limiter) return limiter;

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return errorResponse(
        "Both current and new password are required",
        400,
        req
      );
    }

    const isValid = await UserService.verifyPassword(
      user as any,
      currentPassword
    );
    if (!isValid) {
      return errorResponse("Current password is incorrect", 400, req);
    }

    const hashedPassword = await hashPassword(newPassword);
    (user as any).passwordHash = hashedPassword;
    await (user as any).save();

    return successResponse({}, "Password updated successfully", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to change password", 500, req);
  }
}

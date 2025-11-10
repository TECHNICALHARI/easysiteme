import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { OtpService } from "@/lib/backend/services/otp.service";
import { UserService } from "@/lib/backend/services/user.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { hashPassword } from "@/lib/backend/utils/hash";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, code, newPassword } = body ?? {};

    if (!identifier || !code || !newPassword)
      return errorResponse(
        "identifier, code and newPassword are required",
        400,
        req
      );

    if (typeof newPassword !== "string" || newPassword.length < 8) {
      return errorResponse("Password must be at least 8 characters", 422, req);
    }

    const ipHeader =
      req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "";
    const ip = ipHeader.split(",")[0].trim() || "unknown";
    const ipLimiter = await enforceRateLimit(
      "GLOBAL",
      ip,
      req,
      "Too many requests from this IP"
    );
    if (ipLimiter) return ipLimiter;

    const otpLimiter = await enforceRateLimit(
      "OTP",
      String(identifier),
      req,
      "Too many OTP verify attempts. Try later."
    );
    if (otpLimiter) return otpLimiter;

    await connectDb();

    const valid = await OtpService.verifyOtp(identifier, code, "reset");
    if (!valid.ok) {
      const reason = valid.reason ?? "invalid_code";
      const map: Record<string, number> = {
        not_found: 404,
        expired: 410,
        invalid_code: 400,
        too_many_attempts: 429,
      };
      const status = map[reason] ?? 400;
      return errorResponse(reason, status, req);
    }

    const user = identifier.includes("@")
      ? await UserService.findByEmail(identifier)
      : await UserService.findByMobile(identifier);

    if (!user) return errorResponse("User not found", 404, req);

    const newHash = await hashPassword(newPassword);
    const updated = await UserService.updateById(String(user._id), {
      passwordHash: newHash,
    });

    if (!updated) {
      return errorResponse("Failed to update password", 500, req);
    }

    return successResponse({ updated: true }, "Password changed", 200, req);
  } catch (err: any) {
    console.error("auth/reset-password error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

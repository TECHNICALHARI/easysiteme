import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { OtpService } from "@/lib/backend/services/otp.service";
import { VerificationModel } from "@/lib/backend/models/Verification.model";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { verifyOtpSchema } from "@/lib/backend/validators/auth.schema";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = verifyOtpSchema.safeParse({
      target: body.identifier ?? body.target,
      code: body.code,
      purpose: body.purpose ?? body.type,
    });

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const { target, code, purpose } = parsed.data;

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
      String(target),
      req,
      "Too many OTP verify attempts. Try later."
    );
    if (otpLimiter) return otpLimiter;

    await connectDb();

    const channel: "email" | "mobile" | "reset" = purpose.includes("phone")
      ? "mobile"
      : purpose.includes("email")
      ? "email"
      : "reset";

    const valid = await OtpService.verifyOtp(target, code, channel);
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

    if (channel !== "reset") {
      await VerificationModel.findOneAndUpdate(
        { identifier: target, channel },
        { verified: true, verifiedAt: new Date() },
        { upsert: true, new: true }
      );
    }

    return successResponse(
      { verified: true, channel },
      "OTP verified",
      200,
      req
    );
  } catch (err: any) {
    console.error("verify-otp error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { OtpService } from "@/lib/backend/services/otp.service";
import { NotifyService } from "@/lib/backend/services/notify.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { sendOtpSchema } from "@/lib/backend/validators/auth.schema";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";
import { limitForOtp } from "@/lib/backend/utils/rateLimiter";
import { UserService } from "@/lib/backend/services/user.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = sendOtpSchema.safeParse({
      target: body.identifier ?? body.target,
      purpose: body.purpose ?? body.channel ?? body.type,
    });

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const { target, purpose } = parsed.data;
    const channel: "email" | "mobile" = purpose.includes("phone")
      ? "mobile"
      : "email";

    await connectDb();

    let userVerified = false;
    try {
      if (channel === "email") {
        const u = await UserService.findByEmail(target);
        if (u && u.emailVerified) userVerified = true;
      } else {
        const u = await UserService.findByMobile(target);
        if (u && u.mobileVerified) userVerified = true;
      }
    } catch (e) {
      userVerified = userVerified || false;
    }

    if (userVerified) {
      const prettyTarget =
        channel === "email" ? "email address" : "phone number";
      return errorResponse(
        {
          message: `This ${prettyTarget} is already verified on an account — no OTP needed.`,
          data: { verified: true, channel, source: "user" },
        },
        409,
        req
      );
    }

    const limiter = await enforceRateLimit(
      "OTP",
      String(target),
      req,
      "Too many OTP requests. Try later."
    );
    if (limiter) return limiter;

    const rate = await limitForOtp(String(target));

    const otpDoc = await OtpService.createOtp(target, channel);

    const delivered = await NotifyService.deliverOtp(
      target,
      otpDoc.code,
      channel
    );

    if (!delivered.ok) {
      return errorResponse(
        {
          message: "Failed to send OTP (provider error)",
          data: {
            provider: delivered.provider ?? "unknown",
            error: delivered.error ?? null,
            raw: delivered.raw ?? null,
            rate,
          },
        },
        502,
        req
      );
    }

    return successResponse(
      { sent: true, ttlSeconds: otpDoc.ttlSeconds, rate },
      "OTP sent",
      200,
      req
    );
  } catch (err: any) {
    console.error("send-otp error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    if (String(err).includes("OTP rate limit exceeded"))
      return errorResponse("Too many OTP requests. Try later.", 429, req);
    return errorResponse("Internal server error", 500, req);
  }
}

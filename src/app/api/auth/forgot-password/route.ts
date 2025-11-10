import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { UserService } from "@/lib/backend/services/user.service";
import { OtpService } from "@/lib/backend/services/otp.service";
import { NotifyService } from "@/lib/backend/services/notify.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, mobile } = body ?? {};
    const identifier = email || mobile;
    if (!identifier) return errorResponse("Email or mobile required", 400, req);

    const limiter = await enforceRateLimit(
      "OTP",
      String(identifier),
      req,
      "Too many OTP requests. Try later."
    );
    if (limiter) return limiter;

    await connectDb();
    const user = email
      ? await UserService.findByEmail(email)
      : await UserService.findByMobile(mobile);

    if (!user) return errorResponse("User not found", 404, req);

    const otpDoc = await OtpService.createOtp(identifier, "reset");

    const channel: "email" | "mobile" = identifier.includes("@")
      ? "email"
      : "mobile";

    const delivered = await NotifyService.deliverOtp(
      identifier,
      otpDoc.code,
      channel
    );
    if (!delivered.ok) {
      return errorResponse(
        {
          message: "Failed to send reset OTP (provider error)",
          data: {
            provider: delivered.provider ?? "unknown",
            error: delivered.error ?? null,
            raw: delivered.raw ?? null,
          },
        },
        502,
        req
      );
    }

    const masked =
      channel === "email"
        ? (() => {
            const parts = identifier.split("@");
            const name = parts[0];
            const domain = parts[1] ?? "";
            const m =
              name.length <= 2
                ? name[0] + "*"
                : name[0] +
                  "*".repeat(Math.min(3, name.length - 1)) +
                  name.slice(-1);
            return `${m}@${domain}`;
          })()
        : (() => {
            const digits = identifier.replace(/\D/g, "");
            const last = digits.slice(-4);
            return `****${last}`;
          })();

    return successResponse({ sent: true, masked }, "Reset OTP sent", 200, req);
  } catch (err: any) {
    console.error("auth/forgot-password error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

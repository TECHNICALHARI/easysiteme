import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { OtpService } from "@/lib/backend/services/otp.service";
import { NotifyService } from "@/lib/backend/services/notify.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { sendOtpSchema } from "@/lib/backend/validators/auth.schema";

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

    const allowed = await OtpService.canSendOtp(target);
    if (!allowed)
      return errorResponse("Too many OTP requests. Try later.", 429, req);

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
          },
        },
        502,
        req
      );
    }

    return successResponse(
      { sent: true, ttlSeconds: otpDoc.ttlSeconds },
      "OTP sent",
      200,
      req
    );
  } catch (err: any) {
    console.error("send-otp error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

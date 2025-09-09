import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { User } from "@/lib/backend/models/User.model";
import { OtpService } from "@/lib/backend/services/otp.service";
import { NotifyService } from "@/lib/backend/services/notify.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, mobile } = body;
    const identifier = email || mobile;
    if (!identifier) return errorResponse("Email or mobile required", 400, req);

    await connectDb();
    const user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (!user) return errorResponse("User not found", 404, req);

    const channel: "email" | "mobile" = email ? "email" : "mobile";
    const otpDoc = await OtpService.createOtp(identifier, channel);
    const delivered = await NotifyService.deliverOtp(
      identifier,
      otpDoc.code,
      channel
    );
    if (!delivered.ok)
      return errorResponse("Failed to send reset OTP", 502, req);

    return successResponse({ sent: true }, "Reset OTP sent", 200, req);
  } catch (err: any) {
    console.error("forgot-password error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

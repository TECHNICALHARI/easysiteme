import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { User } from "@/lib/backend/models/User.model";
import { OtpService } from "@/lib/backend/services/otp.service";
import { hashPassword } from "@/lib/backend/utils/hash";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, mobile, otp, newPassword } = body;
    const identifier = email || mobile;
    if (!identifier || !otp || !newPassword) {
      return errorResponse("Missing fields", 400, req);
    }

    await connectDb();
    const channel: "email" | "mobile" = email ? "email" : "mobile";
    const valid = await OtpService.verifyOtp(identifier, otp, channel);
    if (!valid.ok)
      return errorResponse(valid.reason || "Invalid or expired OTP", 400, req);

    const hash = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { $or: [{ email }, { mobile }] },
      { $set: { passwordHash: hash } },
      { new: true }
    );

    if (!user) return errorResponse("User not found", 404, req);

    return successResponse(
      { reset: true },
      "Password reset successful",
      200,
      req
    );
  } catch (err: any) {
    console.error("reset-password error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

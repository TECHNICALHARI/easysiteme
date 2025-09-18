import { OTP_RATE } from "@/lib/backend/config/rate";
import { OtpModel } from "@/lib/backend/models/Otp.model";
import { Types } from "mongoose";
import { limitForOtp } from "@/lib/backend/utils/rateLimiter";

function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const OtpService = {
  async createOtp(
    identifier: string,
    channel: "email" | "mobile" | "reset"
  ): Promise<{
    id: string;
    code: string;
    channel: "email" | "mobile" | "reset";
    identifier: string;
    expiresAt: Date;
    ttlSeconds: number;
  }> {
    const rate = await limitForOtp(String(identifier));
    if (!rate.allowed) {
      throw new Error("OTP rate limit exceeded");
    }

    const code = genCode();
    const expiresAt = new Date(
      Date.now() + OTP_RATE.OTP_TTL_MINUTES * 60 * 1000
    );

    const otpDoc = await OtpModel.create({
      identifier,
      code,
      channel,
      expiresAt,
      attempts: 0,
      consumed: false,
    });

    const ttlSeconds = Math.max(
      0,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000)
    );

    return {
      id: (otpDoc._id as Types.ObjectId).toString(),
      code: otpDoc.code,
      channel: otpDoc.channel as "email" | "mobile" | "reset",
      identifier: otpDoc.identifier,
      expiresAt: otpDoc.expiresAt,
      ttlSeconds,
    };
  },

  async verifyOtp(
    identifier: string,
    code: string,
    channel: "email" | "mobile" | "reset"
  ): Promise<
    | { ok: true }
    | {
        ok: false;
        reason: "not_found" | "expired" | "too_many_attempts" | "invalid_code";
      }
  > {
    const now = Date.now();
    const otp = await OtpModel.findOne({ identifier, channel, consumed: false })
      .sort({ createdAt: -1 })
      .exec();

    if (!otp) return { ok: false, reason: "not_found" };

    if (otp.expiresAt.getTime() <= now) {
      try {
        await otp.deleteOne();
      } catch {}
      return { ok: false, reason: "expired" };
    }

    if (otp.attempts >= OTP_RATE.MAX_VERIFY_ATTEMPTS) {
      try {
        await otp.deleteOne();
      } catch {}
      return { ok: false, reason: "too_many_attempts" };
    }

    if (otp.code === code) {
      try {
        await otp.deleteOne();
      } catch {
        otp.consumed = true;
        await otp.save().catch(() => {});
      }
      return { ok: true };
    }

    otp.attempts += 1;
    await otp.save();

    if (otp.attempts >= OTP_RATE.MAX_VERIFY_ATTEMPTS) {
      try {
        await otp.deleteOne();
      } catch {}
      return { ok: false, reason: "too_many_attempts" };
    }

    return { ok: false, reason: "invalid_code" };
  },

  async cleanupExpired() {
    await OtpModel.deleteMany({ expiresAt: { $lt: new Date() } });
  },
};

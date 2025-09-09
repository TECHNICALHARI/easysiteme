import mongoose from "mongoose";
import { UserService } from "./user.service";
import { OtpService } from "./otp.service";
import { signJwt } from "../utils/jwt";
import { createAuthCookie } from "../utils/cookie";
import { PlanEnum } from "../constants/enums";

export const AuthService = {
  async signup(
    {
      subdomain,
      email,
      mobile,
      countryCode,
      password,
      emailVerified = false,
      mobileVerified = false,
    }: {
      subdomain: string;
      email?: string;
      mobile?: string;
      countryCode?: string;
      password: string;
      emailVerified?: boolean;
      mobileVerified?: boolean;
    },
    options?: { session?: mongoose.ClientSession }
  ) {
    const s = subdomain.trim().toLowerCase();

    const conflict = await UserService.existsByAny({
      subdomain: s,
      email,
      mobile,
    });
    if (conflict) {
      if (conflict.subdomain === s)
        return { ok: false, status: 409, message: "Subdomain already taken" };
      if (email && conflict.email === email)
        return { ok: false, status: 409, message: "Email already in use" };
      if (mobile && conflict.mobile === mobile)
        return { ok: false, status: 409, message: "Mobile already in use" };
      return { ok: false, status: 409, message: "Conflict" };
    }

    const user = await UserService.create(
      {
        subdomain: s,
        email,
        mobile,
        countryCode,
        password,
        emailVerified,
        mobileVerified,
        plan: PlanEnum.FREE,
      },
      { session: options?.session }
    );

    const token = signJwt({
      sub: user._id.toString(),
      roles: user.roles,
      subdomain: user.subdomain,
    });
    const cookieStr = createAuthCookie(token);

    return { ok: true, user, token, cookieStr };
  },

  async loginWithPassword(identifier: string, password: string) {
    let user = null;
    if (identifier.includes("@"))
      user = await UserService.findByEmail(identifier);
    else user = await UserService.findByMobile(identifier);

    if (!user) return { ok: false, status: 404, message: "User not found" };

    const ok = await UserService.verifyPassword(user as any, password);
    if (!ok) return { ok: false, status: 401, message: "Invalid credentials" };

    const token = signJwt({
      sub: user._id.toString(),
      roles: user.roles,
      subdomain: user.subdomain,
    });
    const cookieStr = createAuthCookie(token);
    return { ok: true, user, token, cookieStr };
  },

  async loginWithOtp(identifier: string, code: string) {
    const channel = identifier.includes("@") ? "email" : "mobile";
    const res = await OtpService.verifyOtp(identifier, code, channel);
    if (!res.ok) {
      return {
        ok: false,
        status: 400,
        message:
          res.reason === "not_found"
            ? "OTP not found or expired"
            : "Invalid OTP",
      };
    }

    const user =
      channel === "email"
        ? await UserService.findByEmail(identifier)
        : await UserService.findByMobile(identifier);
    if (!user) return { ok: false, status: 404, message: "User not found" };

    const token = signJwt({
      sub: user._id.toString(),
      roles: user.roles,
      subdomain: user.subdomain,
    });
    const cookieStr = createAuthCookie(token);
    return { ok: true, user, token, cookieStr };
  },
};

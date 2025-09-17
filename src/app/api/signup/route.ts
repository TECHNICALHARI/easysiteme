import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { AuthService } from "@/lib/backend/services/auth.service";
import { VerificationModel } from "@/lib/backend/models/Verification.model";
import { signupSchema } from "@/lib/backend/validators/auth.schema";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const limiter = await enforceRateLimit(
      "SIGNUP",
      body.email ?? body.mobile ?? "unknown",
      req,
      "Too many signup attempts. Try later."
    );
    if (limiter) return limiter;

    await connectDb();
    const payload = parsed.data;

    const reserved = new Set(["www", "admin", "api", "mail", "support"]);
    if (reserved.has(payload.subdomain.toLowerCase().trim())) {
      return errorResponse("Subdomain reserved", 400, req);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      let emailVerified = false;
      let mobileVerified = false;

      if (payload.email) {
        const emailDoc = await VerificationModel.findOneAndDelete({
          identifier: payload.email,
          channel: "email",
        }).session(session);
        if (emailDoc && emailDoc.verified) emailVerified = true;
      }

      if (payload.mobile) {
        const mobileDoc = await VerificationModel.findOneAndDelete({
          identifier: payload.mobile,
          channel: "mobile",
        }).session(session);
        if (mobileDoc && mobileDoc.verified) mobileVerified = true;
      }

      const result = await AuthService.signup(
        {
          subdomain: payload.subdomain,
          email: payload.email,
          mobile: payload.mobile,
          countryCode: payload.countryCode,
          password: payload.password,
          emailVerified,
          mobileVerified,
        },
        { session }
      );

      if (!result.ok) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(
          result.message || "Signup failed",
          result.status || 400,
          req
        );
      }

      if (!result.user) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse(
          "Signup succeeded but user data missing",
          500,
          req
        );
      }

      await session.commitTransaction();
      session.endSession();

      const u = result.user as any;
      const userPublic = {
        id: String(u._id),
        subdomain: u.subdomain ?? null,
        email: u.email ?? null,
        mobile: u.mobile ?? null,
        countryCode: u.countryCode ?? null,
        emailVerified: Boolean(u.emailVerified),
        mobileVerified: Boolean(u.mobileVerified),
        roles: Array.isArray(u.roles) ? u.roles : [],
        plan: u.plan ?? null,
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      };

      const res = successResponse(
        { user: userPublic },
        "Account created",
        201,
        req
      );
      if (result.cookieStr) res.headers.append("Set-Cookie", result.cookieStr);
      return res;
    } catch (e) {
      await session.abortTransaction();
      session.endSession();
      throw e;
    }
  } catch (err: any) {
    console.error("signup route err:", err);
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
      req
    );
  }
}

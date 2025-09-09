import { NextRequest } from "next/server";
import { AuthService } from "@/lib/backend/services/auth.service";
import { loginSchema } from "@/lib/backend/validators/auth.schema";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { connectDb } from "@/lib/backend/config/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    await connectDb();
    const { email, mobile, password, otp } = parsed.data;

    let result;
    if (otp) {
      const identifier = email || mobile;
      if (!identifier)
        return errorResponse(
          "Email or mobile is required for OTP login",
          400,
          req
        );

      result = await AuthService.loginWithOtp(identifier, otp);
    } else {
      const identifier = email || mobile;
      if (!identifier || !password)
        return errorResponse(
          "Email/mobile and password are required",
          400,
          req
        );

      result = await AuthService.loginWithPassword(identifier, password);
    }

    if (!result.ok) {
      return errorResponse(
        result.message || "Login failed",
        result.status || 400,
        req
      );
    }

    if (!result.user) {
      return errorResponse("Login succeeded but user missing", 500, req);
    }

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
      { user: userPublic, token: result.token },
      "Login successful",
      200,
      req
    );
    if (result.cookieStr) res.headers.append("Set-Cookie", result.cookieStr);
    return res;
  } catch (err: any) {
    console.error("login error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

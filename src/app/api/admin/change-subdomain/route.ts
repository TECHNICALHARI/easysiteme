import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { connectDb } from "@/lib/backend/config/db";
import { UserService } from "@/lib/backend/services/user.service";
import { ProfileDesign } from "@/lib/backend/models/ProfileDesign.model";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { enforceRateLimit } from "@/lib/backend/utils/rateLimitHelper";
import { z } from "zod";

const changeSubdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be at most 63 characters")
    .transform((s) => s.trim().toLowerCase())
    .refine((s) => /^[a-z0-9](?!.*--)[a-z0-9-]*[a-z0-9]$/.test(s), {
      message:
        "Subdomain may contain lowercase letters, numbers and single hyphens; cannot start/end with hyphen or contain consecutive hyphens",
    }),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const limiter = await enforceRateLimit(
      "GLOBAL",
      String((user as any)._id ?? "unknown"),
      req,
      "Too many requests. Try later."
    );
    if (limiter) return limiter;

    const body = await req.json();
    const parsed = changeSubdomainSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }
    const subdomain = parsed.data.subdomain;

    const reserved = new Set([
      "www",
      "admin",
      "api",
      "mail",
      "support",
      "help",
      "dashboard",
      "superadmin",
    ]);
    if (reserved.has(subdomain)) {
      return errorResponse("Subdomain reserved", 400, req);
    }

    await connectDb();

    const conflict = await UserService.existsByAny({ subdomain });
    if (conflict && String(conflict.subdomain) === subdomain) {
      if ((user as any).subdomain === subdomain) {
        const publicUser = {
          id: String((user as any)._id),
          subdomain: (user as any).subdomain ?? null,
          email: (user as any).email ?? null,
          mobile: (user as any).mobile ?? null,
          countryCode: (user as any).countryCode ?? null,
          emailVerified: Boolean((user as any).emailVerified),
          mobileVerified: Boolean((user as any).mobileVerified),
          roles: Array.isArray((user as any).roles) ? (user as any).roles : [],
          plan: (user as any).plan ?? null,
          createdAt: (user as any).createdAt
            ? new Date((user as any).createdAt).toISOString()
            : null,
        };
        return successResponse(
          { user: publicUser, changed: false },
          "Subdomain unchanged",
          200,
          req
        );
      }
      return errorResponse("Subdomain already taken", 409, req);
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updated = await UserService.updateById(
        String((user as any)._id),
        { subdomain },
        { session }
      );
      if (!updated) {
        await session.abortTransaction();
        session.endSession();
        return errorResponse("Failed to update subdomain", 500, req);
      }

      try {
        await ProfileDesign.findOneAndUpdate(
          { owner: (user as any)._id },
          { $set: { "settings.subdomain": subdomain } },
          { session, upsert: false }
        ).exec();
      } catch (e: any) {
        await session.abortTransaction();
        session.endSession();
        const msg = String(e?.message || "");
        if (msg.includes("E11000") || msg.includes("duplicate key")) {
          return errorResponse("Subdomain already taken", 409, req);
        }
        return errorResponse("Failed to update profile design", 500, req);
      }

      await session.commitTransaction();
      session.endSession();

      const u: any = updated;
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

      return successResponse(
        { user: userPublic, changed: true },
        "Subdomain updated",
        200,
        req
      );
    } catch (e: any) {
      await session.abortTransaction();
      session.endSession();
      const msg = String(e?.message || "");
      if (msg.includes("E11000") || msg.includes("duplicate key")) {
        return errorResponse("Subdomain already taken", 409, req);
      }
      throw e;
    }
  } catch (err: any) {
    console.error("admin/change-subdomain error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

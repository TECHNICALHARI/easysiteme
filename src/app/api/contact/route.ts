import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { limitForContact } from "@/lib/backend/utils/rateLimiter";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { RoleEnum } from "@/lib/backend/constants/enums";
import { ContactService } from "@/lib/backend/services/contact.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const name = (body.name || "").toString().trim();
    const email = (body.email || "").toString().trim();
    const message = (body.message || "").toString().trim();
    if (!name || !email || !message) {
      return errorResponse(
        "All fields (name, email, message) are required",
        400,
        req
      );
    }

    const xf = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim();
    const realIp = xf || (req.headers.get("x-real-ip") || "").trim() || "";
    const ip = realIp;
    const identifierKey = ip ? `ip:${ip}` : `email:${email}`;

    const rl = await limitForContact(identifierKey);
    if (!rl.allowed) {
      const res = errorResponse("Too many requests", 429, req);
      res.headers.set(
        "Retry-After",
        String(Math.max(1, rl.reset - Math.floor(Date.now() / 1000)))
      );
      res.headers.set("X-RateLimit-Limit", String(rl.count + rl.remaining));
      res.headers.set("X-RateLimit-Remaining", String(rl.remaining));
      res.headers.set("X-RateLimit-Reset", String(rl.reset));
      return res;
    }

    const entry = await ContactService.create({ name, email, message, ip });
    return successResponse(
      { id: String(entry._id) },
      "Message received successfully",
      201,
      req
    );
  } catch (err: any) {
    return errorResponse("Internal server error", 500, req);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const roles = Array.isArray((user as any).roles) ? (user as any).roles : [];
    if (!roles.includes(RoleEnum.SUPERADMIN)) {
      return errorResponse("Forbidden", 403, req);
    }

    const url = req.nextUrl;
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("limit") || "20"))
    );
    const result = await ContactService.list({ page, limit });
    return successResponse(
      {
        contacts: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
      "OK",
      200,
      req
    );
  } catch (err: any) {
    return errorResponse("Internal server error", 500, req);
  }
}

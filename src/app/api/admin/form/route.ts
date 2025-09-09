import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { SiteService } from "@/lib/backend/services/site.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const site = await SiteService.getByOwner(String(user._id));
    return successResponse({ site: site ?? null }, "OK", 200, req);
  } catch (err: any) {
    console.error("admin form GET error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const topLevel: any = {};
      if (typeof body.subdomain === "string")
        topLevel.subdomain = body.subdomain;
      if (typeof body.plan === "string") topLevel.plan = body.plan;

      const incomingForm: any = { ...body };
      delete incomingForm.subdomain;
      delete incomingForm.plan;

      const site = await SiteService.upsertForm(
        String(user._id),
        incomingForm,
        topLevel,
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      const s = site ? site.toObject() : null;
      return successResponse({ site: s }, "Saved", 200, req);
    } catch (e: any) {
      await session.abortTransaction();
      session.endSession();
      console.error("admin form POST tx error:", e);
      return errorResponse("Failed to save", 500, req);
    }
  } catch (err: any) {
    console.error("admin form POST error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { AdminService } from "@/lib/backend/services/admin.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { formSchema } from "@/lib/backend/validators/admin.schema";

const service = new AdminService();
export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const form = await service.getForm(user.id);
    return successResponse({ form }, "OK", 200, req);
  } catch (err: any) {
    console.error("admin form GET error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

export async function POST(req: NextRequest) {
  let session: mongoose.ClientSession | null = null;
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);

    const body = await req.json();
    const parsed = formSchema.partial().safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error, 422, req);
    }
    session = await mongoose.startSession();
    session.startTransaction();
    try {
      const saved = await service.saveForm(user.id, parsed.data, session);
      await session.commitTransaction();
      session.endSession();
      session = null;
      return successResponse({ form: saved }, "Saved", 200, req);
    } catch (e: any) {
      if (session) {
        await session.abortTransaction();
        session.endSession();
        session = null;
      }
      console.error("admin form POST tx error:", e);
      return errorResponse("Failed to save", 500, req);
    }
  } catch (err: any) {
    if (session) {
      try {
        await session.abortTransaction();
        session.endSession();
      } catch {}
    }
    console.error("admin form POST error:", err);
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse("Internal server error", 500, req);
  }
}

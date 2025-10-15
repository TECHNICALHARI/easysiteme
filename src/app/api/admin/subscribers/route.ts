import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { subscriberService } from "@/lib/backend/services/subscriber.service";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { subscriberSchema, subscriberListSchema, subscriberSettingsSchema } from "@/lib/backend/validators/subscriber.schema";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const doc = await subscriberService.getByOwner(user.id);
    return successResponse({ SubscriberList: doc?.SubscriberList ?? { data: [], total: 0, active: 0, unsubscribed: 0 }, subscriberSettings: doc?.subscriberSettings ?? {} }, "OK", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Failed to fetch subscribers", 500, req);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    if (body.subscriberSettings) {
      const parsed = subscriberSettingsSchema.safeParse(body.subscriberSettings);
      if (!parsed.success) {
        return errorResponse({ message: "Validation error", data: parsed.error.format() }, 422, req);
      }
      const updated = await subscriberService.upsertSettings(user.id, parsed.data);
      return successResponse({ subscriberSettings: updated?.subscriberSettings ?? {} }, "Updated", 200, req);
    }
    if (body.SubscriberList) {
      const parsed = subscriberListSchema.safeParse(body.SubscriberList);
      if (!parsed.success) {
        return errorResponse({ message: "Validation error", data: parsed.error.format() }, 422, req);
      }
      const updated = await subscriberService.upsertList(user.id, parsed.data);
      return successResponse({ SubscriberList: updated?.SubscriberList ?? {} }, "Updated", 200, req);
    }
    return errorResponse("Nothing to update", 400, req);
  } catch (err: any) {
    if (err instanceof SyntaxError) return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to update subscribers", 500, req);
  }
}

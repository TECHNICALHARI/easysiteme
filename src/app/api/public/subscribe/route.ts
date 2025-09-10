import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { subscribeSchema } from "@/lib/backend/validators/subscriber.schema";
import { SubscriberService } from "@/lib/backend/services/subscriber.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const service = new SubscriberService();
    const doc = await service.addSubscriber(parsed.data);

    return successResponse(
      { subscriber: doc.toObject() },
      "Subscribed successfully",
      201,
      req
    );
  } catch (err: any) {
    console.error("subscribe error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

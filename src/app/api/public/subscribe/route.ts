import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { Subscriber } from "@/lib/backend/models/Subscriber.model";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { subscriberRowSchema } from "@/lib/backend/validators/subscriber.schema";
import { User } from "@/lib/backend/models/User.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();

    const parsed = subscriberRowSchema.safeParse({
      email: body.email,
      subscribedOn: body.subscribedOn ?? new Date().toISOString(),
      status: body.status ?? "Active",
    });
    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const email = parsed.data.email;
    const now = parsed.data.subscribedOn;

    let ownerId: string | null = null;
    if (body.ownerId) {
      ownerId = body.ownerId;
    } else if (body.ownerSubdomain) {
      const u = await User.findOne({ subdomain: body.ownerSubdomain })
        .select("_id")
        .lean()
        .exec();
      if (u && (u as any)._id) ownerId = String((u as any)._id);
    }

    if (!ownerId) {
      return errorResponse("ownerId or ownerSubdomain required", 400, req);
    }

    const doc = await Subscriber.findOne({ owner: ownerId }).exec();
    if (!doc) {
      const created = await Subscriber.create({
        owner: ownerId,
        subscriberSettings: {},
        SubscriberList: {
          data: [{ email, subscribedOn: now, status: "Active" }],
          total: 1,
          active: 1,
          unsubscribed: 0,
        },
      });
      return successResponse(
        { SubscriberList: created.SubscriberList },
        "Subscribed",
        201,
        req
      );
    }

    const existingIdx = doc.SubscriberList.data.findIndex(
      (r: any) => r.email.toLowerCase() === email.toLowerCase()
    );
    if (existingIdx !== -1) {
      const row = doc.SubscriberList.data[existingIdx];
      if (row.status === "Unsubscribed") {
        row.status = "Active";
        row.subscribedOn = now;
        doc.SubscriberList.unsubscribed = Math.max(
          0,
          (doc.SubscriberList.unsubscribed || 0) - 1
        );
        doc.SubscriberList.active = (doc.SubscriberList.active || 0) + 1;
      }
    } else {
      doc.SubscriberList.data.push({
        email,
        subscribedOn: now,
        status: "Active",
      });
      doc.SubscriberList.total = (doc.SubscriberList.total || 0) + 1;
      doc.SubscriberList.active = (doc.SubscriberList.active || 0) + 1;
    }

    await doc.save();
    return successResponse(
      { SubscriberList: doc.SubscriberList },
      "Subscribed",
      200,
      req
    );
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to subscribe", 500, req);
  }
}

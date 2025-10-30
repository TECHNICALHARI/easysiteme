import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import crypto from "crypto";
import { appConfig } from "@/lib/backend/config";
import { Payment } from "@/lib/backend/models/Payment.model";
import mongoose from "mongoose";
import { User } from "@/lib/backend/models/User.model";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const raw = await req.text();
    const sig = req.headers.get("x-razorpay-signature") || "";
    const expected = crypto
      .createHmac("sha256", appConfig.RAZORPAY_WEBHOOK_SECRET)
      .update(raw)
      .digest("hex");
    if (!sig || sig !== expected)
      return errorResponse("Invalid webhook signature", 400, req);
    const payload = JSON.parse(raw);
    const ev = payload.event;
    if (ev === "payment.captured" || ev === "payment.authorized") {
      const pr = payload.payload?.payment?.entity;
      if (pr && pr.order_id) {
        const orderId = pr.order_id as string;
        const paymentId = pr.id as string;
        await Payment.updateOne(
          { razorpayOrderId: orderId },
          {
            $set: {
              razorpayPaymentId: paymentId,
              status: "captured",
              meta: payload.payload,
            },
          }
        ).exec();
        const p = await Payment.findOne({ razorpayOrderId: orderId })
          .lean()
          .exec();
        if (p && p.owner) {
          try {
            await User.updateOne(
              { _id: new mongoose.Types.ObjectId(p.owner) },
              { $set: { plan: p.planId, planUpdatedAt: new Date() } }
            ).exec();
          } catch {}
        }
      }
    }
    return successResponse({ ok: true }, "Webhook processed", 200, req);
  } catch (err: any) {
    return errorResponse(err?.message || "Webhook processing failed", 500, req);
  }
}

import Razorpay from "razorpay";
import { appConfig } from "@/lib/backend/config";
import { Payment } from "@/lib/backend/models/Payment.model";
import mongoose from "mongoose";
import crypto from "crypto";

const razor = new Razorpay({
  key_id: appConfig.RAZORPAY_KEY_ID,
  key_secret: appConfig.RAZORPAY_KEY_SECRET,
});

export async function createOrderService(
  ownerId: string,
  planId: string,
  amount: number,
  notes: Record<string, any> = {}
) {
  const receipt = `pay_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const opts = {
    amount: amount,
    currency: "INR",
    receipt,
    payment_capture: 1,
    notes,
  };
  const order = await razor.orders.create(opts);
  const doc = await Payment.create({
    owner: new mongoose.Types.ObjectId(ownerId),
    planId,
    amount: order.amount,
    currency: order.currency || "INR",
    razorpayOrderId: order.id,
    status: "created",
    notes,
    meta: { order },
  });
  return {
    order,
    key_id: appConfig.RAZORPAY_KEY_ID,
    payment: doc.toObject ? doc.toObject() : doc,
  };
}

export function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", appConfig.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest("hex");
  return expected === signature;
}

export async function recordVerification(
  orderId: string,
  paymentId: string,
  signature: string,
  extras: any = {}
) {
  await Payment.updateOne(
    { razorpayOrderId: orderId },
    {
      $set: {
        razorpayPaymentId: paymentId,
        status: "captured",
        meta: { verifiedAt: new Date(), signature, ...extras },
      },
    }
  ).exec();
  const p = await Payment.findOne({ razorpayOrderId: orderId }).lean().exec();
  return p || null;
}

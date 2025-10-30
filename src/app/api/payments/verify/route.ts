import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { VerifyPaymentSchema } from "@/lib/backend/validators/payments.schema";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import mongoose from "mongoose";
import { User } from "@/lib/backend/models/User.model";
import {
  recordVerification,
  verifySignature,
} from "@/lib/backend/services/payments.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const parsed = VerifyPaymentSchema.safeParse(body);
    if (!parsed.success)
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = parsed.data;
    const ok = verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );
    if (!ok) return errorResponse("Invalid signature", 400, req);
    await recordVerification(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      { verifiedBy: "api.verify", owner: user.id, planId }
    );
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(user.id) },
      { $set: { plan: planId, planUpdatedAt: new Date() } }
    ).exec();
    return successResponse({ success: true }, "Payment verified", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Verification failed", 500, req);
  }
}

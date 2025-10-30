import mongoose, { Document, Schema, Types, Model } from "mongoose";

export type PaymentStatus =
  | "created"
  | "pending"
  | "captured"
  | "failed"
  | "cancelled";

export interface IPayment {
  owner: Types.ObjectId;
  planId: string;
  amount: number;
  currency: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status?: PaymentStatus;
  notes?: Record<string, any>;
  meta?: any;
}

export interface IPaymentDoc extends IPayment, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new Schema<IPaymentDoc>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    razorpayOrderId: { type: String, index: true, default: "" },
    razorpayPaymentId: { type: String, index: true, default: "" },
    status: { type: String, default: "created" },
    notes: { type: Schema.Types.Mixed, default: {} },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Payment: Model<IPaymentDoc> =
  (mongoose.models && (mongoose.models.Payment as Model<IPaymentDoc>)) ||
  mongoose.model<IPaymentDoc>("Payment", PaymentSchema);

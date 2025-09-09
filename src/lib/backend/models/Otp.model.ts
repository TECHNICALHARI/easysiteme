import mongoose, { Document, Model, Schema } from "mongoose";

export type OtpChannel = "email" | "mobile" | "reset";

export interface IOtpDoc extends Document {
  identifier: string;
  code: string;
  channel: OtpChannel;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  consumed?: boolean;
}

const OtpSchema = new Schema<IOtpDoc>(
  {
    identifier: { type: String, required: true, index: true },
    code: { type: String, required: true },
    channel: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    consumed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpModel: Model<IOtpDoc> =
  (mongoose.models.Otp as Model<IOtpDoc>) ||
  mongoose.model<IOtpDoc>("Otp", OtpSchema);

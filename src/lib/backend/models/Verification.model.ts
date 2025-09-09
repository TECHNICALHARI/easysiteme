import mongoose, { Document, Model, Schema } from "mongoose";

export type VerificationChannel = "email" | "mobile";

export interface IVerificationDoc extends Document {
  identifier: string;
  channel: VerificationChannel;
  verified: boolean;
  verifiedAt?: Date;
}

const VerificationSchema = new Schema<IVerificationDoc>(
  {
    identifier: { type: String, required: true, index: true },
    channel: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
  },
  { timestamps: true }
);

VerificationSchema.index({ identifier: 1, channel: 1 }, { unique: true });
VerificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 24 * 60 * 60 }
);

export const VerificationModel: Model<IVerificationDoc> =
  (mongoose.models.Verification as Model<IVerificationDoc>) ||
  mongoose.model<IVerificationDoc>("Verification", VerificationSchema);

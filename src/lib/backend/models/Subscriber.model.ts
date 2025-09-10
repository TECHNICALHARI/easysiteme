import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber {
  siteId: mongoose.Types.ObjectId;
  email: string;
  status: "Active" | "Unsubscribed";
  subscribedOn: Date;
  unsubscribedOn?: Date;
}

export interface ISubscriberDoc extends ISubscriber, Document {}

const SubscriberSchema = new Schema<ISubscriberDoc>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      index: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["Active", "Unsubscribed"],
      default: "Active",
    },
    subscribedOn: { type: Date, default: Date.now },
    unsubscribedOn: { type: Date },
  },
  { timestamps: true }
);

SubscriberSchema.index({ siteId: 1, email: 1 }, { unique: true });

export const Subscriber =
  mongoose.models.Subscriber ||
  mongoose.model<ISubscriberDoc>("Subscriber", SubscriberSchema);

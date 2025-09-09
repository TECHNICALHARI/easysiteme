import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ISubscriber {
  email?: string;
  name?: string;
  status?: "active" | "unsubscribed" | "bounced" | "pending";
  subscribedOn?: Date;
  metadata?: Record<string, any>;
}

export interface ISubscriberDoc extends ISubscriber, Document {
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriberSchema = new Schema<ISubscriberDoc>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: { type: String, index: true },
    name: { type: String },
    status: { type: String, default: "active" },
    subscribedOn: { type: Date, default: () => new Date() },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Subscriber: Model<ISubscriberDoc> =
  (mongoose.models.Subscriber as Model<ISubscriberDoc>) ||
  mongoose.model<ISubscriberDoc>("Subscriber", SubscriberSchema);

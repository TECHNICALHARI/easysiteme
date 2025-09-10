import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type Subscriber = {
  site: Types.ObjectId | string;
  email: string;
  name?: string;
  status?: "active" | "unsubscribed";
  subscribedOn?: Date;
  meta?: Record<string, any>;
};

export interface ISubscriberDoc extends Subscriber, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriberSchema = new Schema<ISubscriberDoc>(
  {
    site: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      index: true,
    },
    email: { type: String, required: true, index: true },
    name: String,
    status: { type: String, default: "active" },
    subscribedOn: { type: Date, default: () => new Date() },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Subscriber: Model<ISubscriberDoc> =
  (mongoose.models.Subscriber as Model<ISubscriberDoc>) ||
  mongoose.model<ISubscriberDoc>("Subscriber", SubscriberSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriberRow {
  email: string;
  subscribedOn: string;
  status: "Active" | "Unsubscribed";
}

export interface ISubscriberList {
  data: ISubscriberRow[];
  total: number;
  active: number;
  unsubscribed: number;
}

export interface ISubscriberSettings {
  subject?: string;
  thankYouMessage?: string;
  hideSubscribeButton?: boolean;
}

export interface ISubscriberDoc {
  owner: mongoose.Types.ObjectId;
  subscriberSettings: ISubscriberSettings;
  SubscriberList: ISubscriberList;
}

export type ISubscriberModelDoc = ISubscriberDoc & Document;

const SubscriberRowSchema = new Schema({
  email: { type: String, required: true },
  subscribedOn: { type: String, required: true },
  status: { type: String, enum: ["Active", "Unsubscribed"], required: true },
});

const SubscriberListSchema = new Schema({
  data: { type: [SubscriberRowSchema], default: [] },
  total: { type: Number, default: 0 },
  active: { type: Number, default: 0 },
  unsubscribed: { type: Number, default: 0 },
});

const SubscriberSettingsSchema = new Schema({
  subject: { type: String, default: "" },
  thankYouMessage: { type: String, default: "" },
  hideSubscribeButton: { type: Boolean, default: false },
});

const SubscriberSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    subscriberSettings: { type: SubscriberSettingsSchema, default: {} },
    SubscriberList: { type: SubscriberListSchema, default: {} },
  },
  { timestamps: true }
);

export const Subscriber =
  (mongoose.models && (mongoose.models.Subscriber as mongoose.Model<ISubscriberModelDoc>)) ||
  mongoose.model<ISubscriberModelDoc>("Subscriber", SubscriberSchema);

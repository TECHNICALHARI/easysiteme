import mongoose, { Schema, Document } from "mongoose";

export interface IStat {
  siteId: mongoose.Types.ObjectId;
  type: "view" | "click" | "traffic" | "contact";
  url?: string;
  title?: string;
  source?: string;
  name?: string;
  email?: string;
  message?: string;
  createdAt: Date;
}

export interface IStatDoc extends IStat, Document {}

const StatSchema = new Schema<IStatDoc>(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["view", "click", "traffic", "contact"],
      required: true,
    },
    url: { type: String },
    title: { type: String },
    source: { type: String },
    name: { type: String },
    email: { type: String },
    message: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Stat =
  mongoose.models.Stat || mongoose.model<IStatDoc>("Stat", StatSchema);

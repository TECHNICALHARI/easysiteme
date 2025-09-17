import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IContact {
  name: string;
  email: string;
  message: string;
  ip?: string;
}

export interface IContactDoc extends IContact, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactSchema = new Schema<IContactDoc>(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    message: { type: String, required: true },
    ip: { type: String, index: true },
  },
  { timestamps: true }
);

ContactSchema.index({ email: 1, createdAt: 1 });
ContactSchema.index({ ip: 1, createdAt: 1 });

export const Contact: Model<IContactDoc> =
  (mongoose.models.Contact as Model<IContactDoc>) ||
  mongoose.model<IContactDoc>("Contact", ContactSchema);

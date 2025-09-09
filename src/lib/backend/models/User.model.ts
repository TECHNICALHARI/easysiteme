import mongoose, { Model, Schema, Document, Types } from "mongoose";
import { PlanEnum, RoleEnum } from "../constants/enums";

export interface IUser {
  email?: string;
  mobile?: string;
  countryCode?: string;
  passwordHash?: string;
  roles: RoleEnum[];
  subdomain: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  plan: PlanEnum;
}

export interface IUserDoc extends IUser, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUserDoc>(
  {
    email: { type: String, index: true, sparse: true },
    mobile: { type: String, index: true, sparse: true },
    countryCode: { type: String, index: true, sparse: true },
    passwordHash: { type: String },
    roles: { type: [String], default: [RoleEnum.ADMIN] },
    subdomain: { type: String, required: true, index: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    plan: { type: String, default: PlanEnum.FREE },
  },
  { timestamps: true }
);

export const User: Model<IUserDoc> =
  (mongoose.models.User as Model<IUserDoc>) ||
  mongoose.model<IUserDoc>("User", UserSchema);

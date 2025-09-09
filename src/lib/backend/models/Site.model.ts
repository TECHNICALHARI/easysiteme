import mongoose, { Model, Schema } from "mongoose";
import { PlanEnum } from "../constants/enums";

export interface ISite {
  owner: mongoose.Types.ObjectId;
  username: string;
  published: boolean;
  plan: PlanEnum;
  formData: Record<string, any>;
}

export interface ISiteDoc extends ISite, Document {
  createdAt?: Date;
  updatedAt?: Date;
}

const SiteSchema = new Schema<ISiteDoc>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true, unique: true, index: true },
    published: { type: Boolean, default: false },
    plan: {
      type: String,
      enum: Object.values(PlanEnum),
      default: PlanEnum.FREE,
    },
    formData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Site: Model<ISiteDoc> =
  (mongoose.models.Site as Model<ISiteDoc>) ||
  mongoose.model<ISiteDoc>("Site", SiteSchema);

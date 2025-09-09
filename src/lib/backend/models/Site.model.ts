import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface SiteForm {
  profile?: Record<string, any>;
  design?: Record<string, any>;
  seo?: Record<string, any>;
  settings?: Record<string, any>;
  socials?: Record<string, any>;
  posts?: { posts: any[] };
  subscriberSettings?: Record<string, any>;
  stats?: Record<string, any>;
  meta?: Record<string, any>;
  [k: string]: any;
}

export interface ISiteDoc extends Document {
  owner: Types.ObjectId;
  subdomain?: string;
  plan?: string;
  form: SiteForm;
  createdAt?: Date;
  updatedAt?: Date;
}

const SiteSchema = new Schema<ISiteDoc>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    subdomain: { type: String, index: true },
    plan: { type: String },
    form: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Site: Model<ISiteDoc> =
  (mongoose.models.Site as Model<ISiteDoc>) ||
  mongoose.model<ISiteDoc>("Site", SiteSchema);

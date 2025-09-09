import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface IPost {
  postId: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
  published?: boolean;
  meta?: Record<string, any>;
  [k: string]: any;
}

export interface IPostDoc extends IPost, Document {
  owner: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const PostSchema = new Schema<IPostDoc>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    postId: { type: String, required: true, index: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String },
    content: { type: String },
    thumbnail: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Post: Model<IPostDoc> =
  (mongoose.models.Post as Model<IPostDoc>) ||
  mongoose.model<IPostDoc>("Post", PostSchema);

import mongoose, { Document, Schema } from "mongoose";

export interface IPost {
  postId: string;
  owner: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  published: boolean;
}

export type IPostDoc = IPost & Document;

const PostSchema = new Schema<IPostDoc>(
  {
    postId: { type: String, required: true, index: true, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "Admin", required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Post =
  (mongoose.models && (mongoose.models.Post as mongoose.Model<IPostDoc>)) ||
  mongoose.model<IPostDoc>("Post", PostSchema);

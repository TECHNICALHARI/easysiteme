import mongoose, { Schema, Document, Model } from "mongoose";
import { PostInput } from "../validators/post.schema";

export interface IPostDoc extends Omit<PostInput, "postId">, Document {
  postId: string;
  owner: mongoose.Types.ObjectId;
}

const PostSchema = new Schema<IPostDoc>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PostSchema.index({ owner: 1, slug: 1 }, { unique: true });

export const Post: Model<IPostDoc> =
  mongoose.models.Post || mongoose.model<IPostDoc>("Post", PostSchema);

import mongoose from "mongoose";
import { Post } from "@/lib/backend/models/Post.model";

export const PostService = {
  async list(ownerId: string) {
    return Post.find({ owner: new mongoose.Types.ObjectId(ownerId) })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  },

  async get(ownerId: string, idOrSlug: string) {
    const q: any = { owner: new mongoose.Types.ObjectId(ownerId) };
    const byPostId = await Post.findOne({ ...q, postId: idOrSlug })
      .lean()
      .exec();
    if (byPostId) return byPostId;
    const bySlug = await Post.findOne({ ...q, slug: idOrSlug })
      .lean()
      .exec();
    return bySlug;
  },

  async create(ownerId: string, payload: any) {
    const docPayload: any = {
      owner: new mongoose.Types.ObjectId(ownerId),
      ...payload,
    };
    if (!docPayload.postId) {
      docPayload.postId = `post-${Date.now()}-${Math.floor(
        Math.random() * 10000
      )}`;
    }
    const doc = await Post.create(docPayload);
    return doc;
  },

  async update(ownerId: string, postId: string, payload: any) {
    const doc = await Post.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId), postId },
      { $set: payload },
      { new: true }
    ).exec();
    return doc;
  },

  async remove(ownerId: string, postId: string) {
    return Post.findOneAndDelete({
      owner: new mongoose.Types.ObjectId(ownerId),
      postId,
    }).exec();
  },
};

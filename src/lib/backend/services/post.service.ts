import { Post, IPostDoc } from "../models/Post.model";
import mongoose from "mongoose";
import {
  CreatePostInput,
  UpdatePostInput,
} from "../validators/post.schema";

export class PostService {
  async create(ownerId: string, data: CreatePostInput): Promise<IPostDoc> {
    const doc = await Post.create({
      ...data,
      owner: new mongoose.Types.ObjectId(ownerId),
    });
    return doc;
  }

  async update(
    ownerId: string,
    postId: string,
    data: UpdatePostInput
  ): Promise<IPostDoc | null> {
    const doc = await Post.findOneAndUpdate(
      { owner: ownerId, postId },
      { $set: data },
      { new: true }
    ).exec();
    return doc;
  }

  async delete(ownerId: string, postId: string): Promise<boolean> {
    const res = await Post.findOneAndDelete({ owner: ownerId, postId }).exec();
    return !!res;
  }

  async getById(ownerId: string, postId: string): Promise<IPostDoc | null> {
    return Post.findOne({ owner: ownerId, postId }).lean().exec();
  }

  async getBySlug(ownerId: string, slug: string): Promise<IPostDoc | null> {
    return Post.findOne({ owner: ownerId, slug }).lean().exec();
  }

  async list(ownerId: string): Promise<IPostDoc[]> {
    return Post.find({ owner: ownerId }).sort({ createdAt: -1 }).lean().exec();
  }

  async togglePublish(
    ownerId: string,
    postId: string,
    publish: boolean
  ): Promise<IPostDoc | null> {
    return Post.findOneAndUpdate(
      { owner: ownerId, postId },
      { $set: { published: publish } },
      { new: true }
    ).exec();
  }
}

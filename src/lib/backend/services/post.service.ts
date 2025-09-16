import mongoose, { PipelineStage } from "mongoose";
import { Post } from "../models/Post.model";
import { CreatePostInput, UpdatePostInput } from "../validators/post.schema";
import { replaceBase64Images } from "../utils/image-helper";

function extractCloudinaryPublicIdFromUrl(
  url: string | undefined | null
): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    const afterUpload = parts.slice(uploadIdx + 1).join("/");
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    const withoutExt = withoutVersion.replace(/\.[a-zA-Z0-9]+$/, "");
    return withoutExt || null;
  } catch {
    return null;
  }
}

export class PostService {
  async create(ownerId: string, data: CreatePostInput) {
    const processed = await replaceBase64Images(data as any, ["thumbnail"]);
   console.log(processed, 'processed');
    if (!processed.thumbnailPublicId) {
      const extracted = extractCloudinaryPublicIdFromUrl(processed.thumbnail);
      if (extracted) processed.thumbnailPublicId = extracted;
    }
 
    const doc = await Post.create({
      ...processed,
      owner: new mongoose.Types.ObjectId(ownerId),
    });
    return doc.toObject ? doc.toObject() : doc;
  }

  async update(ownerId: string, postId: string, data: UpdatePostInput) {
    const processed = await replaceBase64Images(data as any, ["thumbnail"]);

    if (!processed.thumbnailPublicId) {
      const extracted = extractCloudinaryPublicIdFromUrl(processed.thumbnail);
      if (extracted) processed.thumbnailPublicId = extracted;
    }

    const doc = await Post.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId), postId },
      { $set: processed },
      { new: true }
    ).exec();
    return doc ? (doc.toObject ? doc.toObject() : doc) : null;
  }

  async delete(ownerId: string, postId: string) {
    const res = await Post.findOneAndDelete({
      owner: new mongoose.Types.ObjectId(ownerId),
      postId,
    }).exec();
    return !!res;
  }

  async togglePublish(ownerId: string, postId: string, publish: boolean) {
    const doc = await Post.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId), postId },
      { $set: { published: publish } },
      { new: true }
    ).exec();
    return doc ? (doc.toObject ? doc.toObject() : doc) : null;
  }

  private async aggregateOne(filter: Record<string, any>) {
    const pipeline: PipelineStage[] = [
      { $match: filter },
      {
        $lookup: {
          from: "admins",
          let: { ownerId: "$owner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$owner", "$$ownerId"] } } },
            {
              $project: {
                _id: 0,
                "form.profile.fullName": 1,
                "form.profile.username": 1,
              },
            },
          ],
          as: "adminDoc",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { ownerId: "$owner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
            { $project: { _id: 0, name: 1 } },
          ],
          as: "userDoc",
        },
      },
      {
        $addFields: {
          ownerName: {
            $ifNull: [
              { $arrayElemAt: ["$adminDoc.form.profile.fullName", 0] },
              { $arrayElemAt: ["$userDoc.name", 0] },
              { $toString: "$owner" },
            ],
          },
          ownerUsername: {
            $ifNull: [
              { $arrayElemAt: ["$adminDoc.form.profile.username", 0] },
              null,
            ],
          },
        },
      },
      { $project: { adminDoc: 0, userDoc: 0, __v: 0 } },
      { $limit: 1 },
    ];
    const res = await Post.aggregate(pipeline).exec();
    return res && res.length ? res[0] : null;
  }

  async getById(ownerId: string, postId: string) {
    const filter = { owner: new mongoose.Types.ObjectId(ownerId), postId };
    return this.aggregateOne(filter);
  }

  async getBySlug(ownerId: string, slug: string) {
    const filter = { owner: new mongoose.Types.ObjectId(ownerId), slug };
    return this.aggregateOne(filter);
  }

  async list(ownerId: string) {
    const pipeline: PipelineStage[] = [
      { $match: { owner: new mongoose.Types.ObjectId(ownerId) } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "admins",
          let: { ownerId: "$owner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$owner", "$$ownerId"] } } },
            {
              $project: {
                _id: 0,
                "form.profile.fullName": 1,
                "form.profile.username": 1,
              },
            },
          ],
          as: "adminDoc",
        },
      },
      {
        $lookup: {
          from: "users",
          let: { ownerId: "$owner" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
            { $project: { _id: 0, name: 1 } },
          ],
          as: "userDoc",
        },
      },
      {
        $addFields: {
          ownerName: {
            $ifNull: [
              { $arrayElemAt: ["$adminDoc.form.profile.fullName", 0] },
              { $arrayElemAt: ["$userDoc.name", 0] },
              { $toString: "$owner" },
            ],
          },
          ownerUsername: {
            $ifNull: [
              { $arrayElemAt: ["$adminDoc.form.profile.username", 0] },
              null,
            ],
          },
        },
      },
      { $project: { adminDoc: 0, userDoc: 0, __v: 0 } },
    ];
    return Post.aggregate(pipeline).exec();
  }
}

const instance = new PostService();

export const createPost = (ownerId: string, data: CreatePostInput) =>
  instance.create(ownerId, data);
export const updatePost = (
  ownerId: string,
  postId: string,
  data: UpdatePostInput
) => instance.update(ownerId, postId, data);
export const deletePost = (ownerId: string, postId: string) =>
  instance.delete(ownerId, postId);
export const togglePublishPost = (
  ownerId: string,
  postId: string,
  publish: boolean
) => instance.togglePublish(ownerId, postId, publish);
export const listPosts = (ownerId: string) => instance.list(ownerId);
export const getPostById = (ownerId: string, postId: string) =>
  instance.getById(ownerId, postId);
export const getPostBySlug = (ownerId: string, slug: string) =>
  instance.getBySlug(ownerId, slug);

export default instance;

import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { FeaturedMaker } from "@/lib/backend/models/FeaturedMaker.model";

export type FeaturedMakerDTO = {
  owner: string;
  fullName: string;
  avatar: string;
  bannerImage: string;
  layoutType: string;
  subdomain: string;
  rank: number;
};

class FeaturedMakersService {
  async list(params?: { limit?: number; skip?: number }) {
    await connectDb();

    const limit = Math.min(Math.max(params?.limit ?? 12, 1), 48);
    const skip = Math.max(params?.skip ?? 0, 0);

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "profiledesigns",
          let: { fmOwner: "$owner" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$owner" }, { $toString: "$$fmOwner" }],
                },
              },
            },
            {
              $project: {
                _id: 0,
                fullName: { $ifNull: ["$profile.fullName", ""] },
                avatar: { $ifNull: ["$profile.avatar", ""] },
                bannerImage: { $ifNull: ["$profile.bannerImage", ""] },
                layoutType: { $ifNull: ["$design.layoutType", "bio"] },
                subdomain: { $ifNull: ["$settings.subdomain", ""] },
              },
            },
          ],
          as: "pd",
        },
      },
      { $unwind: { path: "$pd", preserveNullAndEmptyArrays: false } },
      { $match: { "pd.subdomain": { $nin: [null, ""] } } },
      { $sort: { rank: 1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          owner: { $toString: "$owner" },
          rank: 1,
          fullName: "$pd.fullName",
          avatar: "$pd.avatar",
          bannerImage: "$pd.bannerImage",
          layoutType: "$pd.layoutType",
          subdomain: "$pd.subdomain",
        },
      },
    ];

    const rows = await FeaturedMaker.aggregate(pipeline).exec();

    return rows.map(
      (r: any): FeaturedMakerDTO => ({
        owner: r.owner,
        fullName: r.fullName || "",
        avatar: r.avatar || "",
        bannerImage: r.bannerImage || "",
        layoutType: r.layoutType || "bio",
        subdomain: r.subdomain || "",
        rank: typeof r.rank === "number" ? r.rank : 9999,
      })
    );
  }
}

const instance = new FeaturedMakersService();
export const listFeaturedMakers = (params?: {
  limit?: number;
  skip?: number;
}) => instance.list(params);
export default instance;

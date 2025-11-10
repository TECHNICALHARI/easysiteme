import mongoose from "mongoose";
import { FeaturedMaker } from "@/lib/backend/models/FeaturedMaker.model";
import { ProfileDesign } from "@/lib/backend/models/ProfileDesign.model";
import { User } from "@/lib/backend/models/User.model";
import { connectDb } from "@/lib/backend/config/db";

type PublicFeaturedRow = {
  owner: string;
  subdomain: string;
  fullName?: string;
  avatar?: string;
  bannerImage?: string;
  layoutType?: string;
  headline?: string;
  rank?: number;
};

class FeaturedMakersService {
  async listPublic(limit = 12, skip = 0): Promise<PublicFeaturedRow[]> {
    await connectDb();

    const makers = await FeaturedMaker.find({ isActive: true })
      .sort({ rank: 1, updatedAt: -1 })
      .skip(Math.max(0, skip))
      .limit(Math.max(1, Math.min(100, limit)))
      .populate<{ owner: any }>("owner", "subdomain")
      .lean()
      .exec();

    const ownerIds = (makers || [])
      .map((m: any) =>
        m.owner?._id ? String(m.owner._id) : String(m.owner || "")
      )
      .filter(Boolean);

    const profileDocs = await ProfileDesign.find({ owner: { $in: ownerIds } })
      .lean()
      .exec();

    const profileByOwner: Record<string, any> = {};
    for (const p of profileDocs) profileByOwner[String(p.owner)] = p;

    const rows: PublicFeaturedRow[] = (makers || []).map((m: any) => {
      const ownerId = m.owner?._id
        ? String(m.owner._id)
        : String(m.owner || "");
      const profile = profileByOwner[ownerId] || {};
      const subdomain =
        (profile.settings?.subdomain as string) ||
        (m.owner && (m.owner.subdomain as string)) ||
        "";
      return {
        owner: ownerId,
        subdomain,
        fullName: profile.profile?.fullName || profile.profile?.title || "",
        avatar: profile.profile?.avatar || "",
        bannerImage: profile.profile?.bannerImage || "",
        layoutType: profile.design?.layoutType || "bio",
        headline:
          m.headline || profile.profile?.title || profile.profile?.bio || "",
        rank: typeof m.rank === "number" ? m.rank : 9999,
      } as PublicFeaturedRow;
    });

    return rows;
  }

  async listAllAdmin() {
    await connectDb();
    const docs = await FeaturedMaker.find({})
      .sort({ rank: 1, updatedAt: -1 })
      .populate<{ owner: any }>("owner", "subdomain email roles")
      .lean()
      .exec();
    return docs || [];
  }

  async setFeaturedForSubdomain(
    subdomain: string,
    featured: boolean,
    rank?: number,
    headline?: string
  ) {
    await connectDb();
    const sanitized = String(subdomain || "")
      .toLowerCase()
      .trim();
    if (!sanitized) throw new Error("Invalid subdomain");
    const user = await User.findOne({ subdomain: sanitized }).exec();
    if (!user) throw new Error("User not found");
    const ownerId = new mongoose.Types.ObjectId(user._id);

    if (!featured) {
      await FeaturedMaker.findOneAndUpdate(
        { owner: ownerId },
        { $set: { isActive: false } },
        { new: true }
      ).exec();
      await ProfileDesign.findOneAndUpdate(
        { owner: ownerId },
        { $set: { "settings.featured": false } }
      ).exec();
      return { owner: String(user._id), featured: false };
    }

    const set: any = { isActive: true };
    if (typeof rank === "number" && Number.isFinite(rank))
      set.rank = Math.floor(rank);
    if (headline !== undefined) set.headline = String(headline || "");
    const doc = await FeaturedMaker.findOneAndUpdate(
      { owner: ownerId },
      { $set: set },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    await ProfileDesign.findOneAndUpdate(
      { owner: ownerId },
      { $set: { "settings.featured": true } }
    ).exec();

    return doc ? (doc.toObject ? doc.toObject() : doc) : null;
  }
}

const featuredMakersService = new FeaturedMakersService();
export default featuredMakersService;

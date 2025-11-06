import mongoose from "mongoose";
import { ProfileDesign } from "@/lib/backend/models/ProfileDesign.model";
import {
  replaceProfileBase64Images,
  collectPublicIdsFromDoc,
  removeUnusedPublicIds,
} from "@/lib/backend/utils/profile-image-helper";
import { connectDb } from "@/lib/backend/config/db";
import {
  ProfileDesignInput,
  ProfileDesignSchema,
} from "../validators/profileDesign.schema";

class ProfileDesignService {
  async getByOwner(ownerId: string) {
    await connectDb();
    const doc = await ProfileDesign.findOne({
      owner: new mongoose.Types.ObjectId(ownerId),
    })
      .lean()
      .exec();
    return doc || null;
  }

  async saveForOwner(ownerId: string, input: ProfileDesignInput) {
    await connectDb();
    const parsed = ProfileDesignSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Validation error");
    }

    const existing = await ProfileDesign.findOne({
      owner: new mongoose.Types.ObjectId(ownerId),
    })
      .lean()
      .exec();
    const oldPublicIds = existing
      ? collectPublicIdsFromDoc(existing)
      : new Set<string>();

    const { processed } = await replaceProfileBase64Images(parsed.data);

    const merged = {
      profile: { ...(existing?.profile ?? {}), ...(processed.profile ?? {}) },
      design: { ...(existing?.design ?? {}), ...(processed.design ?? {}) },
      settings: {
        ...(existing?.settings ?? {}),
        ...(processed.settings ?? {}),
      },
    };

    const doc = await ProfileDesign.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId) },
      { $set: merged },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).exec();

    const newPublicSet = collectPublicIdsFromDoc(
      doc?.toObject ? doc.toObject() : (doc as any) || {}
    );
    await removeUnusedPublicIds(oldPublicIds, newPublicSet);

    return doc ? (doc.toObject ? doc.toObject() : (doc as any)) : null;
  }
}

const instance = new ProfileDesignService();
export const getProfileDesign = (ownerId: string) =>
  instance.getByOwner(ownerId);
export const saveProfileDesign = (ownerId: string, input: ProfileDesignInput) =>
  instance.saveForOwner(ownerId, input);
export default instance;

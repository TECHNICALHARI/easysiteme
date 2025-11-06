import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { ProfileDesignDraft } from "@/lib/backend/models/ProfileDesignDraft.model";
import {
  replaceProfileBase64Images,
  collectPublicIdsFromDoc,
  removeUnusedPublicIds,
} from "@/lib/backend/utils/profile-image-helper";
import {
  ProfileDesignInput,
  ProfileDesignSchema,
} from "@/lib/backend/validators/profileDesign.schema";

class ProfileDesignDraftService {
  async getDraftByOwner(ownerId: string) {
    await connectDb();
    const doc = await ProfileDesignDraft.findOne({
      owner: new mongoose.Types.ObjectId(ownerId),
    })
      .lean()
      .exec();
    return doc || null;
  }

  async saveDraftForOwner(ownerId: string, input: ProfileDesignInput) {
    await connectDb();
    const parsed = ProfileDesignSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error("Validation error");
    }

    const existing = await ProfileDesignDraft.findOne({
      owner: new mongoose.Types.ObjectId(ownerId),
    })
      .lean()
      .exec();
    const oldPublicIds = existing
      ? collectPublicIdsFromDoc(existing)
      : new Set<string>();

    const { processed } = await replaceProfileBase64Images(parsed.data);

    const merged = {
      profile: { ...(processed.profile ?? {}) },
      design: { ...(processed.design ?? {}) },
      settings: { ...(processed.settings ?? {}) },
      draftUpdatedAt: new Date(),
    };

    const doc = await ProfileDesignDraft.findOneAndUpdate(
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

const instance = new ProfileDesignDraftService();
export const getProfileDesignDraft = (ownerId: string) =>
  instance.getDraftByOwner(ownerId);
export const saveProfileDesignDraft = (
  ownerId: string,
  input: ProfileDesignInput
) => instance.saveDraftForOwner(ownerId, input);
export default instance;

// src/lib/backend/services/profileDesignDraft.service.ts
import mongoose from "mongoose";
import { connectDb } from "@/lib/backend/config/db";
import { ProfileDesignDraft } from "@/lib/backend/models/ProfileDesignDraft.model";
import { replaceProfileBase64Images } from "@/lib/backend/utils/profile-image-helper";
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
    const incoming = parsed.data;

    const { processed } = await replaceProfileBase64Images(incoming);

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

    return doc ? (doc.toObject ? doc.toObject() : doc) : null;
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

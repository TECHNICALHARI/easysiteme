import { Site } from "@/lib/backend/models/Site.model";

export const StatsService = {
  async get(ownerId: string) {
    const s = await Site.findOne({ owner: ownerId }).lean().exec();
    return s?.form?.stats ?? {};
  },

  async record(ownerId: string, key: string, payload: any) {
    const path = `form.stats.${key}`;
    await Site.findOneAndUpdate(
      { owner: ownerId },
      { $push: { [path]: payload } },
      { upsert: true }
    ).exec();
    return true;
  },

  async set(ownerId: string, statsObj: any) {
    await Site.findOneAndUpdate(
      { owner: ownerId },
      { $set: { "form.stats": statsObj } },
      { upsert: true }
    ).exec();
    return true;
  },
};

import mongoose from "mongoose";
import { Site, ISiteDoc } from "@/lib/backend/models/Site.model";

function isPlainObject(v: any) {
  return v && typeof v === "object" && v.constructor === Object;
}

export function deepMerge(target: any, source: any) {
  if (!isPlainObject(target) || !isPlainObject(source)) return source;
  const out: any = Array.isArray(target) ? [...target] : { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = out[key];
    if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      out[key] = deepMerge(tgtVal, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out;
}

export const SiteService = {
  async getByOwner(ownerId: string) {
    return Site.findOne({ owner: ownerId })
      .lean()
      .exec() as Promise<ISiteDoc | null>;
  },

  async upsertForm(
    ownerId: string,
    incomingForm: any,
    topLevel?: { subdomain?: string; plan?: string },
    options?: { session?: mongoose.ClientSession }
  ) {
    const session = options?.session;
    const existing = await Site.findOne({ owner: ownerId })
      .session(session ?? null)
      .exec();
    const merged =
      existing && existing.form
        ? deepMerge(existing.form, incomingForm)
        : incomingForm ?? {};
    const upsertDoc: any = { owner: ownerId, form: merged };
    if (topLevel?.subdomain) upsertDoc.subdomain = topLevel.subdomain;
    if (topLevel?.plan) upsertDoc.plan = topLevel.plan;
    const site = await Site.findOneAndUpdate(
      { owner: ownerId },
      { $set: upsertDoc },
      { upsert: true, new: true, setDefaultsOnInsert: true, session }
    ).exec();
    return site;
  },
};

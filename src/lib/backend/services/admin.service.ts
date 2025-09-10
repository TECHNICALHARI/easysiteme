import mongoose, { ClientSession } from "mongoose";
import { Admin } from "../models/Admin.model";
import { formSchema, type FormInput } from "../validators/admin.schema";

function isPlainObject(v: any): v is Record<string, unknown> {
  return v && typeof v === "object" && v.constructor === Object;
}

function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return source as unknown as T;
  }
  const out: Record<string, any> = Array.isArray(target)
    ? [...(target as any)]
    : { ...(target as any) };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = (out as any)[key];
    if (isPlainObject(srcVal) && isPlainObject(tgtVal)) {
      out[key] = deepMerge(tgtVal, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out as T;
}

const DEFAULT_FORM = formSchema.parse({});

export class AdminService {
  async getForm(ownerId: string): Promise<FormInput> {
    const doc = await Admin.findOne({ owner: ownerId }).lean().exec();
    if (!doc?.form) return DEFAULT_FORM;
    return doc.form as unknown as FormInput;
  }

  async saveForm(
    ownerId: string,
    data: Partial<FormInput>,
    session?: ClientSession
  ): Promise<FormInput> {
    const existing = await Admin.findOne({ owner: ownerId })
      .session(session ?? null)
      .exec();
    const base = existing?.form
      ? (existing.form as unknown as FormInput)
      : DEFAULT_FORM;
    const merged = deepMerge(base as any, data as any) as FormInput;
    const update: any = {
      owner: new mongoose.Types.ObjectId(ownerId),
      form: merged,
    };
    const doc = await Admin.findOneAndUpdate(
      { owner: ownerId },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true, session }
    ).exec();
    if (!doc) throw new Error("Failed to save admin form");
    return doc.form as unknown as FormInput;
  }

  async upsertTopLevel(
    ownerId: string,
    topLevel: { subdomain?: string; plan?: string },
    data: Partial<FormInput>,
    session?: ClientSession
  ): Promise<FormInput> {
    const existing = await Admin.findOne({ owner: ownerId })
      .session(session ?? null)
      .exec();
    const base = existing?.form
      ? (existing.form as unknown as FormInput)
      : DEFAULT_FORM;
    const merged = deepMerge(base as any, data as any) as FormInput;
    const setObj: any = {
      owner: new mongoose.Types.ObjectId(ownerId),
      form: merged,
    };
    if (topLevel.subdomain) setObj.subdomain = topLevel.subdomain;
    if (topLevel.plan) setObj.plan = topLevel.plan;
    const doc = await Admin.findOneAndUpdate(
      { owner: ownerId },
      { $set: setObj },
      { new: true, upsert: true, setDefaultsOnInsert: true, session }
    ).exec();
    if (!doc) throw new Error("Failed to upsert admin form/toplevel");
    return doc.form as unknown as FormInput;
  }
}

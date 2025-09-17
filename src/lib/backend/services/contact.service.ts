import { Contact, IContactDoc } from "@/lib/backend/models/Contact.model";

export const ContactService = {
  async create(payload: {
    name: string;
    email: string;
    message: string;
    ip?: string;
  }) {
    const doc = await Contact.create({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      ip: payload.ip || "",
    });
    return doc as IContactDoc;
  },

  async list(opts?: { page?: number; limit?: number }) {
    const page = Math.max(1, opts?.page || 1);
    const limit = Math.min(100, Math.max(1, opts?.limit || 20));
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Contact.countDocuments().exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
    };
  },
};

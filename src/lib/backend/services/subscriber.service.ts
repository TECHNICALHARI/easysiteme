import { Subscriber } from "@/lib/backend/models/Subscriber.model";

export const SubscriberService = {
  async list(ownerId: string, limit = 100, skip = 0) {
    const data = await Subscriber.find({ owner: ownerId })
      .sort({ subscribedOn: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    const total = await Subscriber.countDocuments({ owner: ownerId }).exec();
    return { data, total };
  },

  async add(ownerId: string, payload: any) {
    const exists = await Subscriber.findOne({
      owner: ownerId,
      email: payload.email,
    }).exec();
    if (exists) {
      exists.status = payload.status ?? exists.status;
      exists.metadata = { ...exists.metadata, ...(payload.metadata ?? {}) };
      await exists.save();
      return exists;
    }
    const doc = await Subscriber.create({ owner: ownerId, ...payload });
    return doc;
  },

  async remove(ownerId: string, idOrEmail: string) {
    return Subscriber.findOneAndDelete({
      owner: ownerId,
      $or: [{ _id: idOrEmail }, { email: idOrEmail }],
    }).exec();
  },
};

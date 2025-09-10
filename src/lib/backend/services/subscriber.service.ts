import { Subscriber } from "@/lib/backend/models/Subscriber.model";

export const SubscriberService = {
  async listBySite(siteId: string, opts?: { limit?: number; skip?: number }) {
    const q = Subscriber.find({ site: siteId }).sort({ subscribedOn: -1 });
    if (opts?.limit) q.limit(opts.limit);
    if (opts?.skip) q.skip(opts.skip);
    return q.lean().exec();
  },

  async create(siteId: string, payload: any) {
    const doc = await Subscriber.create({ site: siteId, ...payload });
    return doc;
  },

  async update(id: string, data: any) {
    return Subscriber.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).exec();
  },

  async remove(id: string) {
    return Subscriber.findByIdAndDelete(id).exec();
  },
};

import mongoose from "mongoose";
import { Subscriber } from "@/lib/backend/models/Subscriber.model";
import { SubscriberInput } from "@/lib/backend/validators/subscriber.schema";

class SubscriberService {
  async getByOwner(ownerId: string) {
    const doc = await Subscriber.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).lean().exec();
    if (!doc) return null;
    return doc;
  }

  async upsertSettings(ownerId: string, settings: SubscriberInput["subscriberSettings"]) {
    const upd = { subscriberSettings: settings ?? {} };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const doc = await Subscriber.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId) },
      { $set: upd },
      opts
    ).lean().exec();
    return doc;
  }

  async upsertList(ownerId: string, list: SubscriberInput["SubscriberList"]) {
    const upd = { SubscriberList: list ?? { data: [], total: 0, active: 0, unsubscribed: 0 } };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const doc = await Subscriber.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId) },
      { $set: upd },
      opts
    ).lean().exec();
    return doc;
  }

  async addPublicSubscriber(ownerId: string, email: string) {
    const now = new Date().toISOString();
    const doc = await Subscriber.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    if (!doc) {
      const created = await Subscriber.create({
        owner: new mongoose.Types.ObjectId(ownerId),
        subscriberSettings: {},
        SubscriberList: {
          data: [{ email, subscribedOn: now, status: "Active" }],
          total: 1,
          active: 1,
          unsubscribed: 0,
        },
      });
      return created.toObject ? created.toObject() : created;
    }
    const existingIdx = doc.SubscriberList.data.findIndex((r: any) => r.email === email);
    if (existingIdx !== -1) {
      const row = doc.SubscriberList.data[existingIdx];
      if (row.status === "Unsubscribed") {
        row.status = "Active";
        row.subscribedOn = now;
        doc.SubscriberList.unsubscribed = Math.max(0, (doc.SubscriberList.unsubscribed || 0) - 1);
        doc.SubscriberList.active = (doc.SubscriberList.active || 0) + 1;
      }
    } else {
      doc.SubscriberList.data.push({ email, subscribedOn: now, status: "Active" });
      doc.SubscriberList.total = (doc.SubscriberList.total || 0) + 1;
      doc.SubscriberList.active = (doc.SubscriberList.active || 0) + 1;
    }
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }

  async markUnsubscribed(ownerId: string, email: string) {
    const doc = await Subscriber.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    if (!doc) return null;
    const idx = doc.SubscriberList.data.findIndex((r: any) => r.email === email);
    if (idx === -1) return doc.toObject ? doc.toObject() : doc;
    const row = doc.SubscriberList.data[idx];
    if (row.status !== "Unsubscribed") {
      row.status = "Unsubscribed";
      doc.SubscriberList.active = Math.max(0, (doc.SubscriberList.active || 0) - 1);
      doc.SubscriberList.unsubscribed = (doc.SubscriberList.unsubscribed || 0) + 1;
    }
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }
}

export const subscriberService = new SubscriberService();
export default subscriberService;

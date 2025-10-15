import mongoose from "mongoose";
import { Stats } from "@/lib/backend/models/Stats.model";
import { StatsInput } from "@/lib/backend/validators/stats.schema";

class StatsService {
  async getByOwner(ownerId: string) {
    const doc = await Stats.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).lean().exec();
    if (!doc) return null;
    return doc;
  }

  async upsert(ownerId: string, payload: StatsInput) {
    const upd: any = {
      linkClicks: payload.linkClicks ?? [],
      trafficSources: payload.trafficSources ?? [],
      contactSubmissions: payload.contactSubmissions ?? [],
      topLinks: payload.topLinks ?? [],
      lastUpdated: payload.lastUpdated ? new Date(payload.lastUpdated) : new Date(),
    };
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true };
    const doc = await Stats.findOneAndUpdate(
      { owner: new mongoose.Types.ObjectId(ownerId) },
      { $set: upd },
      opts
    ).lean().exec();
    return doc;
  }

  async incrementLinkClick(ownerId: string, label: string, amount = 1) {
    const doc = await Stats.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    if (!doc) {
      const created = await Stats.create({
        owner: new mongoose.Types.ObjectId(ownerId),
        linkClicks: [{ label, value: amount }],
        lastUpdated: new Date(),
      });
      return created.toObject ? created.toObject() : created;
    }
    if (!doc.linkClicks) doc.linkClicks = [];
    const idx = doc.linkClicks.findIndex((l) => l.label === label);
    if (idx === -1) {
      doc.linkClicks.push({ label, value: amount });
    } else {
      doc.linkClicks[idx].value = (doc.linkClicks[idx].value || 0) + amount;
    }
    doc.lastUpdated = new Date();
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }

  async addOrIncrementTopLink(ownerId: string, title: string, url: string, clicks = 1) {
    const doc = await Stats.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    if (!doc) {
      const created = await Stats.create({
        owner: new mongoose.Types.ObjectId(ownerId),
        topLinks: [{ title, url, clicks }],
        lastUpdated: new Date(),
      });
      return created.toObject ? created.toObject() : created;
    }
    if (!doc.topLinks) doc.topLinks = [];
    const idx = doc.topLinks.findIndex((t: any) => t.url === url);
    if (idx === -1) {
      doc.topLinks.push({ title, url, clicks });
    } else {
      doc.topLinks[idx].clicks = (doc.topLinks[idx].clicks || 0) + clicks;
      if (!doc.topLinks[idx].title && title) doc.topLinks[idx].title = title;
    }
    doc.lastUpdated = new Date();
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }

  async addTrafficSource(ownerId: string, label: string, value = 1) {
    const doc = await Stats.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    if (!doc) {
      const created = await Stats.create({
        owner: new mongoose.Types.ObjectId(ownerId),
        trafficSources: [{ label, value }],
        lastUpdated: new Date(),
      });
      return created.toObject ? created.toObject() : created;
    }
    if (!doc.trafficSources) doc.trafficSources = [];
    const idx = doc.trafficSources.findIndex((t: any) => t.label === label);
    if (idx === -1) {
      doc.trafficSources.push({ label, value });
    } else {
      doc.trafficSources[idx].value = (doc.trafficSources[idx].value || 0) + value;
    }
    doc.lastUpdated = new Date();
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }

  async addContactSubmission(ownerId: string, submission: { name: string; email?: string; message: string; submittedOn?: string }) {
    const doc = await Stats.findOne({ owner: new mongoose.Types.ObjectId(ownerId) }).exec();
    const row = {
      name: submission.name,
      email: submission.email ?? "",
      message: submission.message,
      submittedOn: submission.submittedOn ?? new Date().toISOString(),
    };
    if (!doc) {
      const created = await Stats.create({
        owner: new mongoose.Types.ObjectId(ownerId),
        contactSubmissions: [row],
        lastUpdated: new Date(),
      });
      return created.toObject ? created.toObject() : created;
    }
    if (!doc.contactSubmissions) doc.contactSubmissions = [];
    doc.contactSubmissions.push(row);
    doc.lastUpdated = new Date();
    await doc.save();
    return doc.toObject ? doc.toObject() : doc;
  }
}

export const statsService = new StatsService();
export default statsService;

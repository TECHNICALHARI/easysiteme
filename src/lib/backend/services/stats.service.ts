import { Stat, IStatDoc } from "../models/Stats.model";
import mongoose from "mongoose";
import {
  TrackLinkInput,
  TrackTrafficInput,
  ContactSubmitInput,
} from "../validators/stats.schema";

export class StatService {
  async trackLink(data: TrackLinkInput): Promise<IStatDoc> {
    return Stat.create({
      siteId: new mongoose.Types.ObjectId(data.siteId),
      type: "click",
      url: data.url,
      title: data.title,
    });
  }

  async trackTraffic(data: TrackTrafficInput): Promise<IStatDoc> {
    return Stat.create({
      siteId: new mongoose.Types.ObjectId(data.siteId),
      type: "traffic",
      source: data.source,
    });
  }

  async contactSubmit(data: ContactSubmitInput): Promise<IStatDoc> {
    return Stat.create({
      siteId: new mongoose.Types.ObjectId(data.siteId),
      type: "contact",
      name: data.name,
      email: data.email,
      message: data.message,
    });
  }

  async getStats(siteId: string) {
    const totalViews = await Stat.countDocuments({ siteId, type: "traffic" });
    const totalClicks = await Stat.countDocuments({ siteId, type: "click" });

    const trafficSources = await Stat.aggregate([
      {
        $match: {
          siteId: new mongoose.Types.ObjectId(siteId),
          type: "traffic",
        },
      },
      { $group: { _id: "$source", value: { $sum: 1 } } },
    ]);

    const topLinks = await Stat.aggregate([
      {
        $match: { siteId: new mongoose.Types.ObjectId(siteId), type: "click" },
      },
      { $group: { _id: "$url", clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
    ]);

    const contactSubmissions = await Stat.find({ siteId, type: "contact" })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return {
      totalViews,
      totalClicks,
      trafficSources,
      topLinks,
      contactSubmissions,
    };
  }
}

import { Subscriber, ISubscriberDoc } from "../models/Subscriber.model";
import {
  SubscribeInput,
  UpdateSubscriberInput,
} from "../validators/subscriber.schema";
import mongoose from "mongoose";

export class SubscriberService {
  async addSubscriber(data: SubscribeInput): Promise<ISubscriberDoc> {
    const siteId = new mongoose.Types.ObjectId(data.siteId);
    const doc = await Subscriber.findOneAndUpdate(
      { siteId, email: data.email },
      { $setOnInsert: { status: "Active", subscribedOn: new Date() } },
      { new: true, upsert: true }
    ).exec();
    return doc!;
  }

  async updateStatus(
    siteId: string,
    email: string,
    data: UpdateSubscriberInput
  ) {
    const doc = await Subscriber.findOneAndUpdate(
      { siteId: new mongoose.Types.ObjectId(siteId), email },
      {
        $set: {
          status: data.status,
          unsubscribedOn: data.status === "Unsubscribed" ? new Date() : null,
        },
      },
      { new: true }
    ).exec();
    return doc;
  }

  async listSubscribers(siteId: string): Promise<ISubscriberDoc[]> {
    return Subscriber.find({ siteId: new mongoose.Types.ObjectId(siteId) })
      .sort({ subscribedOn: -1 })
      .exec(); // return ISubscriberDoc[]
  }

  async stats(siteId: string) {
    const total = await Subscriber.countDocuments({ siteId });
    const active = await Subscriber.countDocuments({
      siteId,
      status: "Active",
    });
    const unsubscribed = await Subscriber.countDocuments({
      siteId,
      status: "Unsubscribed",
    });
    return { total, active, unsubscribed };
  }
}

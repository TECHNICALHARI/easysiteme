import mongoose, { Document, Schema } from "mongoose";

export interface ILinkClick {
  label: string;
  value: number;
}

export interface ITrafficSource {
  label: string;
  value: number;
}

export interface IContactSubmission {
  name: string;
  email: string;
  message: string;
  submittedOn: string;
}

export interface ITopLink {
  title: string;
  url: string;
  clicks: number;
}

export interface IStats {
  linkClicks?: ILinkClick[];
  trafficSources?: ITrafficSource[];
  contactSubmissions?: IContactSubmission[];
  topLinks?: ITopLink[];
  lastUpdated?: Date;
}

export type IStatsDoc = IStats & Document;

const LinkClickSchema = new Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
});

const TrafficSourceSchema = new Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true, default: 0 },
});

const ContactSubmissionSchema = new Schema({
  name: String,
  email: String,
  message: String,
  submittedOn: String,
});

const TopLinkSchema = new Schema({
  title: String,
  url: String,
  clicks: { type: Number, default: 0 },
});

const StatsSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    linkClicks: { type: [LinkClickSchema], default: [] },
    trafficSources: { type: [TrafficSourceSchema], default: [] },
    contactSubmissions: { type: [ContactSubmissionSchema], default: [] },
    topLinks: { type: [TopLinkSchema], default: [] },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Stats =
  (mongoose.models && (mongoose.models.Stats as mongoose.Model<IStatsDoc>)) ||
  mongoose.model<IStatsDoc>("Stats", StatsSchema);

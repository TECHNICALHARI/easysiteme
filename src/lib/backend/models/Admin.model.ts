import mongoose, { Model, Schema, Document, Types } from "mongoose";

export type Profile = {
  fullName?: string;
  username?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  bannerImage?: string;
  about?: any;
  headers?: any[];
  links?: any[];
  embeds?: any[];
  testimonials?: any[];
  faqs?: any[];
  services?: any[];
  featured?: any[];
  tags?: string[];
  fullAddress?: string;
  latitude?: string;
  longitude?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  showContactForm?: boolean;
  resumeUrl?: string;
  [key: string]: any;
};

export type Design = {
  theme?: string;
  emojiLink?: string;
  brandingOff?: boolean;
  layoutType?: string;
  [key: string]: any;
};

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  [key: string]: any;
};

export type Settings = {
  nsfwWarning?: boolean;
  preferredLink?: string;
  customDomain?: string;
  gaId?: string;
  [key: string]: any;
};

export type Socials = {
  youtube?: string;
  instagram?: string;
  calendly?: string;
  [key: string]: any;
};

export type SubscriberItem = {
  id: string;
  email?: string;
  name?: string;
  subscribedOn?: string;
  status?: string;
  [key: string]: any;
};

export type SubscriberList = {
  data: SubscriberItem[];
  total: number;
  active: number;
  unsubscribed: number;
  [key: string]: any;
};

export type SubscriberSettings = {
  hideSubscribeButton?: boolean;
  subject?: string;
  thankYouMessage?: string;
  [key: string]: any;
};

export type Stats = {
  linkClicks?: any[];
  trafficSources?: any[];
  contactSubmissions?: any[];
  topLinks?: any[];
  [key: string]: any;
};

export type FormData = {
  profile?: Profile;
  design?: Design;
  seo?: Seo;
  settings?: Settings;
  socials?: Socials;
  subscriberSettings?: {
    SubscriberList?: SubscriberList;
    subscriberSettings?: SubscriberSettings;
    [key: string]: any;
  };
  stats?: Stats;
  [key: string]: any;
};

export interface IAdmin {
  owner: Types.ObjectId | string;
  subdomain?: string;
  plan?: string;
  form?: FormData;
  meta?: Record<string, any>;
}

export interface IAdminDoc extends IAdmin, Document {
  _id: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema = new Schema(
  {
    fullName: String,
    username: String,
    title: String,
    bio: String,
    avatar: String,
    bannerImage: String,
    about: Schema.Types.Mixed,
    headers: { type: [Schema.Types.Mixed], default: [] },
    links: { type: [Schema.Types.Mixed], default: [] },
    embeds: { type: [Schema.Types.Mixed], default: [] },
    testimonials: { type: [Schema.Types.Mixed], default: [] },
    faqs: { type: [Schema.Types.Mixed], default: [] },
    services: { type: [Schema.Types.Mixed], default: [] },
    featured: { type: [Schema.Types.Mixed], default: [] },
    tags: { type: [String], default: [] },
    fullAddress: String,
    latitude: String,
    longitude: String,
    email: String,
    phone: String,
    website: String,
    whatsapp: String,
    showContactForm: { type: Boolean, default: false },
    resumeUrl: String,
  },
  { _id: false, strict: false }
);

const DesignSchema = new Schema(
  {
    theme: String,
    emojiLink: String,
    brandingOff: Boolean,
    layoutType: { type: String, default: "bio" },
  },
  { _id: false, strict: false }
);

const SeoSchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    noIndex: Boolean,
    noFollow: Boolean,
  },
  { _id: false, strict: false }
);

const SettingsSchema = new Schema(
  {
    nsfwWarning: Boolean,
    preferredLink: String,
    customDomain: String,
    gaId: String,
  },
  { _id: false, strict: false }
);

const SocialsSchema = new Schema(
  {
    youtube: String,
    instagram: String,
    calendly: String,
  },
  { _id: false, strict: false }
);

const SubscriberItemSchema = new Schema(
  {
    id: { type: String, required: true },
    email: String,
    name: String,
    subscribedOn: String,
    status: String,
  },
  { _id: false, strict: false }
);

const SubscriberListSchema = new Schema(
  {
    data: { type: [SubscriberItemSchema], default: [] },
    total: { type: Number, default: 0 },
    active: { type: Number, default: 0 },
    unsubscribed: { type: Number, default: 0 },
  },
  { _id: false, strict: false }
);

const SubscriberSettingsSchema = new Schema(
  {
    hideSubscribeButton: Boolean,
    subject: String,
    thankYouMessage: String,
  },
  { _id: false, strict: false }
);

const SubscriberSettingsSection = new Schema(
  {
    SubscriberList: SubscriberListSchema,
    subscriberSettings: SubscriberSettingsSchema,
  },
  { _id: false, strict: false }
);

const StatsSchema = new Schema(
  {
    linkClicks: { type: [Schema.Types.Mixed], default: [] },
    trafficSources: { type: [Schema.Types.Mixed], default: [] },
    contactSubmissions: { type: [Schema.Types.Mixed], default: [] },
    topLinks: { type: [Schema.Types.Mixed], default: [] },
  },
  { _id: false, strict: false }
);

const FormSchema = new Schema(
  {
    profile: { type: ProfileSchema, default: {} },
    design: { type: DesignSchema, default: {} },
    seo: { type: SeoSchema, default: {} },
    settings: { type: SettingsSchema, default: {} },
    socials: { type: SocialsSchema, default: {} },
    subscriberSettings: { type: SubscriberSettingsSection, default: {} },
    stats: { type: StatsSchema, default: {} },
    _extra: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, strict: false }
);

const AdminSchema = new Schema<IAdminDoc>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    subdomain: { type: String, index: true },
    plan: String,
    form: { type: FormSchema, default: {} },
    meta: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, strict: false }
);

export const Admin: Model<IAdminDoc> =
  (mongoose.models.Admin as Model<IAdminDoc>) ||
  mongoose.model<IAdminDoc>("Admin", AdminSchema);

import mongoose, { Document, Schema, Types } from "mongoose";

const HeaderSchema = new Schema({ id: String, title: String }, { _id: false });

const LinkSchema = new Schema(
  {
    id: String,
    title: String,
    url: String,
    highlighted: { type: Boolean, default: false },
    image: { type: String, default: "" },
    imagePublicId: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  { _id: false }
);

const EmbedSchema = new Schema(
  { id: String, title: String, url: String },
  { _id: false }
);

const TestimonialSchema = new Schema(
  {
    id: String,
    name: String,
    message: String,
    avatar: String,
    avatarPublicId: String,
  },
  { _id: false }
);

const FAQSchema = new Schema(
  { id: String, question: String, answer: String },
  { _id: false }
);

const ServiceSchema = new Schema(
  {
    id: String,
    title: String,
    description: String,
    amount: String,
    currencyCode: String,
    currencySymbol: String,
    customSymbol: String,
    image: String,
    imagePublicId: String,
    ctaLabel: String,
    ctaLink: String,
  },
  { _id: false }
);

const FeaturedMediaSchema = new Schema(
  {
    id: String,
    title: String,
    url: String,
    urlPublicId: String,
    description: String,
    ctaLabel: String,
    ctaLink: String,
  },
  { _id: false }
);

const SocialsSchema = new Schema(
  {
    youtube: String,
    instagram: String,
    calendly: String,
    facebook: String,
    LinkedIn: String,
  },
  { _id: false }
);

const ProfileSchema = new Schema(
  {
    fullName: String,
    title: String,
    bio: String,
    avatar: String,
    avatarPublicId: String,
    bannerImage: String,
    bannerPublicId: String,
    about: String,
    headers: { type: [HeaderSchema], default: [] },
    links: { type: [LinkSchema], default: [] },
    embeds: { type: [EmbedSchema], default: [] },
    testimonials: { type: [TestimonialSchema], default: [] },
    faqs: { type: [FAQSchema], default: [] },
    services: { type: [ServiceSchema], default: [] },
    featured: { type: [FeaturedMediaSchema], default: [] },
    tags: { type: [String], default: [] },
    fullAddress: String,
    latitude: String,
    longitude: String,
    email: String,
    phone: String,
    website: String,
    whatsapp: String,
    showContactForm: { type: Boolean, default: false },
    socials: { type: SocialsSchema, default: {} },

    resumeUrl: String,
    resumePublicId: String,
  },
  { _id: false }
);

const DesignSchema = new Schema(
  {
    theme: { type: String, default: "brand" },
    emojiLink: String,
    brandingOff: { type: Boolean, default: false },
    layoutType: { type: String, default: "bio" },
  },
  { _id: false }
);

const SESchema = new Schema(
  {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: { type: [String], default: [] },
    canonicalUrl: String,
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    ogImagePublicId: String,
    twitterTitle: String,
    twitterDescription: String,
    twitterImage: String,
    twitterImagePublicId: String,
    noIndex: { type: Boolean, default: false },
    noFollow: { type: Boolean, default: false },
  },
  { _id: false }
);

const SettingsSchema = new Schema(
  {
    nsfwWarning: { type: Boolean, default: false },
    preferredLink: { type: String, default: "primary" },
    customDomain: String,
    gaId: String,
    subdomain: String,
    seo: { type: SESchema, default: {} },
  },
  { _id: false }
);

const ProfileDesignMainSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    profile: { type: ProfileSchema, default: {} },
    design: { type: DesignSchema, default: {} },
    settings: { type: SettingsSchema, default: {} },
  },
  { timestamps: true }
);

export type IProfileDesignDoc = Document & {
  owner: Types.ObjectId;
  profile: any;
  design: any;
  settings: any;
  createdAt?: Date;
  updatedAt?: Date;
};

export const ProfileDesign =
  (mongoose.models &&
    (mongoose.models.ProfileDesign as mongoose.Model<IProfileDesignDoc>)) ||
  mongoose.model<IProfileDesignDoc>("ProfileDesign", ProfileDesignMainSchema);

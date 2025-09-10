import { z } from "zod";

export const profileInfoSchema = z.object({
  fullName: z.string().default(""),
  username: z.string().default(""),
  title: z.string().default(""),
  bio: z.string().default(""),
  avatar: z.string().default(""),
  bannerImage: z.string().optional(),
});

export const headerSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export const linkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  highlighted: z.boolean().default(false),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

export const embedSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
});

export const testimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  message: z.string(),
  avatar: z.string().optional(),
});

export const faqSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
});

export const serviceSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  amount: z.string().optional(),
  currencyCode: z
    .enum(["INR", "USD", "EUR", "GBP", "NONE", "OTHER"])
    .optional(),
  currencySymbol: z.string().optional(),
  customSymbol: z.string().optional(),
  image: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const featuredMediaSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaLink: z.string().optional(),
});

export const contactInfoSchema = z.object({
  fullAddress: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  whatsapp: z.string().optional(),
  showContactForm: z.boolean().optional(),
});

export const resumeSchema = z.object({
  resumeUrl: z.string().optional(),
});

export const profileTabSchema = profileInfoSchema
  .merge(contactInfoSchema)
  .merge(resumeSchema)
  .extend({
    about: z.string().optional(),
    tags: z.array(z.string()).optional(),
    headers: z.array(headerSchema).default([]),
    links: z.array(linkSchema).default([]),
    embeds: z.array(embedSchema).default([]),
    testimonials: z.array(testimonialSchema).default([]),
    faqs: z.array(faqSchema).default([]),
    services: z.array(serviceSchema).default([]),
    featured: z.array(featuredMediaSchema).default([]),
  });

export const seoSchema = z.object({
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  metaKeywords: z.array(z.string()).optional(),
  canonicalUrl: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  twitterTitle: z.string().optional(),
  twitterDescription: z.string().optional(),
  twitterImage: z.string().optional(),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
});

export const designSchema = z.object({
  theme: z.string().default("brand"),
  emojiLink: z.string().optional(),
  brandingOff: z.boolean().optional(),
  layoutType: z.enum(["bio", "website"]).default("bio"),
});

export const settingsSchema = z.object({
  nsfwWarning: z.boolean().default(false),
  preferredLink: z.enum(["primary", "custom"]).default("primary"),
  customDomain: z.string().default(""),
  gaId: z.string().optional(),
});

export const socialsSchema = z.object({
  youtube: z.string().optional(),
  instagram: z.string().optional(),
  calendly: z.string().optional(),
});

export const subscriberSchema = z.object({
  email: z.string().email(),
  subscribedOn: z.string(),
  status: z.enum(["Active", "Unsubscribed"]),
});

export const subscriberListSchema = z.object({
  data: z.array(subscriberSchema).default([]),
  total: z.number().default(0),
  active: z.number().default(0),
  unsubscribed: z.number().default(0),
});

export const subscriberSettingsSchema = z.object({
  subject: z.string().default(""),
  thankYouMessage: z.string().default(""),
  hideSubscribeButton: z.boolean().default(false),
});

export const subscriberDataSchema = z.object({
  subscriberSettings: subscriberSettingsSchema,
  SubscriberList: subscriberListSchema,
});

export const linkClickSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const trafficSourceSchema = z.object({
  label: z.string(),
  value: z.number(),
});

export const contactSubmissionSchema = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
  submittedOn: z.string(),
});

export const topLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
  clicks: z.number(),
});

export const statsSchema = z.object({
  linkClicks: z.array(linkClickSchema).optional(),
  trafficSources: z.array(trafficSourceSchema).optional(),
  contactSubmissions: z.array(contactSubmissionSchema).optional(),
  topLinks: z.array(topLinkSchema).optional(),
});

export const formSchema = z.object({
  profile: profileTabSchema,
  design: designSchema,
  seo: seoSchema,
  settings: settingsSchema,
  socials: socialsSchema,
  subscriberSettings: subscriberDataSchema,
  stats: statsSchema.optional(),
  previewMode: z.boolean().optional(),
});

export type FormInput = z.infer<typeof formSchema>;

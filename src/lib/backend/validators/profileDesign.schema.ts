import { z } from "zod";

const HeaderSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
});

const LinkSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  highlighted: z.boolean().optional().default(false),
  image: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
});

const EmbedSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
});

const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  avatarPublicId: z.string().optional().nullable(),
});

const FAQSchema = z.object({
  id: z.string(),
  question: z.string().optional().nullable(),
  answer: z.string().optional().nullable(),
});

const ServiceSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  currencyCode: z
    .enum(["INR", "USD", "EUR", "GBP", "NONE", "OTHER"])
    .optional(),
  currencySymbol: z.string().optional().nullable(),
  customSymbol: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  imagePublicId: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
});

const FeaturedMediaSchema = z.object({
  id: z.string(),
  title: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
  urlPublicId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  ctaLabel: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
});

const SocialsSchema = z.object({
  youtube: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  calendly: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  LinkedIn: z.string().optional().nullable(),
});

const ContactInfoSchema = z.object({
  fullAddress: z.string().optional().nullable(),
  latitude: z.string().optional().nullable(),
  longitude: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  showContactForm: z.boolean().optional().default(false),
});

const ProfileSchema = z
  .object({
    fullName: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    avatar: z.string().optional().nullable(),
    avatarPublicId: z.string().optional().nullable(),
    bannerImage: z.string().optional().nullable(),
    bannerPublicId: z.string().optional().nullable(),
    about: z.string().optional().nullable(),
    headers: z.array(HeaderSchema).optional().default([]),
    links: z.array(LinkSchema).optional().default([]),
    embeds: z.array(EmbedSchema).optional().default([]),
    testimonials: z.array(TestimonialSchema).optional().default([]),
    faqs: z.array(FAQSchema).optional().default([]),
    services: z.array(ServiceSchema).optional().default([]),
    featured: z.array(FeaturedMediaSchema).optional().default([]),
    tags: z.array(z.string()).optional().default([]),
    resumeUrl: z.string().optional().nullable(),
    resumePublicId: z.string().optional().nullable(),
    socials: SocialsSchema.optional().default({}),
  })
  .merge(ContactInfoSchema)
  .partial();

const DesignSchema = z.object({
  theme: z.string().optional().default("brand"),
  emojiLink: z.string().optional().nullable(),
  brandingOff: z.boolean().optional().default(false),
  layoutType: z.enum(["bio", "website"]).optional().default("bio"),
});

const SEOSchema = z
  .object({
    metaTitle: z.string().optional().nullable(),
    metaDescription: z.string().optional().nullable(),
    metaKeywords: z.array(z.string()).optional().default([]),
    canonicalUrl: z.string().optional().nullable(),
    ogTitle: z.string().optional().nullable(),
    ogDescription: z.string().optional().nullable(),
    ogImage: z.string().optional().nullable(),
    ogImagePublicId: z.string().optional().nullable(),
    twitterTitle: z.string().optional().nullable(),
    twitterDescription: z.string().optional().nullable(),
    twitterImage: z.string().optional().nullable(),
    twitterImagePublicId: z.string().optional().nullable(),
    noIndex: z.boolean().optional().default(false),
    noFollow: z.boolean().optional().default(false),
  })
  .partial();

const SettingsSchema = z
  .object({
    nsfwWarning: z.boolean().optional().default(false),
    preferredLink: z.enum(["primary", "custom"]).optional().default("primary"),
    customDomain: z.string().optional().nullable(),
    gaId: z.string().optional().nullable(),
    subdomain: z.string().optional().nullable(),
    seo: SEOSchema.optional().default({}),
  })
  .partial();

export const ProfileDesignSchema = z
  .object({
    profile: ProfileSchema.default({} as z.infer<typeof ProfileSchema>),
    design: DesignSchema.default({} as z.infer<typeof DesignSchema>),
    settings: SettingsSchema.default({} as z.infer<typeof SettingsSchema>),
  })
  .partial();

export type ProfileDesignInput = z.infer<typeof ProfileDesignSchema>;

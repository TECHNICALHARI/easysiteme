export interface ProfileInfo {
  fullName: string;
  title: string;
  bio: string;
  avatar: string;
  bannerImage?: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  highlighted: boolean;
  image?: File | null;
  icon?: string | null;
}

export interface Header {
  id: string;
  title: string;
}

export interface Embed {
  id: string;
  title: string;
  url: string;
}

export interface Testimonial {
  id: string;
  name: string;
  message: string;
  avatar?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  amount?: string;
  currencyCode?: "INR" | "USD" | "EUR" | "GBP" | "NONE" | "OTHER";
  currencySymbol?: string;
  customSymbol?: string;
  image?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export interface FeaturedMedia {
  id: string;
  title: string;
  url: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
}

export interface ContactInfo {
  fullAddress?: string;
  latitude?: string;
  longitude?: string;
  email?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  showContactForm?: boolean;
}

export interface Resume {
  resumeUrl?: string;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
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
}

export interface Design {
  theme: string;
  emojiLink?: string;
  brandingOff?: boolean;
  layoutType: "bio" | "website";
}

export interface Settings {
  nsfwWarning: boolean;
  preferredLink: "primary" | "custom";
  customDomain: string;
  gaId?: string;
  subdomain?: string;
  seo?: SEO;
}

export interface Socials {
  youtube?: string;
  instagram?: string;
  calendly?: string;
  facebook?: string;
  LinkedIn?: string;
}

export interface ProfileTabData extends ProfileInfo, ContactInfo, Resume {
  about?: string;
  tags?: string[];
  headers: Header[];
  links: Link[];
  embeds: Embed[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  services: Service[];
  featured: FeaturedMedia[];
  socials: Socials;
}

export interface Post {
  id: string;
  postId?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
  thumbnailPublicId?: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  published: boolean;
}

export interface PostsTabData {
  posts: Post[];
}

export interface SubscriberList {
  data: {
    email: string;
    subscribedOn: string;
    status: "Active" | "Unsubscribed";
  }[];
  total: number;
  active: number;
  unsubscribed: number;
}

export interface SubscriberDataTypes {
  subscriberSettings: {
    subject: string;
    thankYouMessage: string;
    hideSubscribeButton: boolean;
  };
  SubscriberList: SubscriberList;
}

export interface LinkClick {
  label: string;
  value: number;
}

export interface TrafficSource {
  label: string;
  value: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  submittedOn: string;
}

export interface TopLink {
  title: string;
  url: string;
  clicks: number;
}

export interface Stats {
  linkClicks?: LinkClick[];
  trafficSources?: TrafficSource[];
  contactSubmissions?: ContactSubmission[];
  topLinks?: TopLink[];
}

export interface FormData {
  profile: ProfileTabData;
  previewMode?: boolean;
  design: Design;
  settings: Settings;
  posts: PostsTabData;
  subscriberSettings: SubscriberDataTypes;
  stats?: Stats;
}

export type ReorderableProfileKeys =
  | "links"
  | "headers"
  | "embeds"
  | "testimonials"
  | "faqs"
  | "services"
  | "featured";

export type ProfileTypeMap = {
  links: Link[];
  headers: Header[];
  embeds: Embed[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  services: Service[];
  featured: FeaturedMedia[];
};

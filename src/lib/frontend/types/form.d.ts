export interface ProfileInfo {
  fullName: string;
  username: string;
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
  price?: string; 
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
}

export interface Resume {
  resumeUrl?: string;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
}

export interface Design {
  theme: string;
  emojiLink?: string;
  brandingOff?: boolean;
  layoutType: 'bio' | 'website';
}

export interface Settings {
  nsfwWarning: boolean;
  preferredLink: 'primary' | 'custom';
  customDomain: string;
  gaId?: string;
}

export interface Socials {
  youtube?: string;
  instagram?: string;
  calendly?: string;
}

export interface ProfileTabData
  extends ProfileInfo,
    ContactInfo,
    Resume {
  about?: string;
  tags?: string[];
  headers: Header[];
  links: Link[];
  embeds: Embed[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  services: Service[];
  featured: FeaturedMedia[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  thumbnail: string;
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
    status: 'Active' | 'Unsubscribed';
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

export interface FormData {
  profile: ProfileTabData;
  design: Design;
  seo: SEO;
  settings: Settings;
  socials: Socials;
  posts: PostsTabData;
  subscriberSettings: SubscriberDataTypes;
  plan: 'free' | 'pro' | 'premium';
}

export type ReorderableProfileKeys =
  | 'links'
  | 'headers'
  | 'embeds'
  | 'testimonials'
  | 'faqs'
  | 'services'
  | 'featured';

export type ProfileTypeMap = {
  links: Link[];
  headers: Header[];
  embeds: Embed[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  services: Service[];
  featured: FeaturedMedia[];
};

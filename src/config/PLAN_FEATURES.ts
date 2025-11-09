export type PlanType = "free" | "pro" | "premium";

export interface PlanFeatureConfig {
  links: number;
  about: boolean;
  bannerImage: boolean;
  contact: boolean;
  embeds: number;
  services: number;
  faqs: number;
  testimonials: number;
  featured: number;
  map: boolean;
  resume: boolean;
  customTheme: boolean;
  headers: number;
  tags: number;
  posts: number;
  brandingOff: boolean;
  layoutType: boolean;
  showSubscribers: boolean;
  customDomain: boolean;
  stats: boolean;
  fullSEO: boolean;
  socials: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatureConfig> = {
  free: {
    links: 3,
    about: true,
    bannerImage: false,
    contact: false,
    embeds: 1,
    services: 0,
    faqs: 0,
    testimonials: 0,
    featured: 0,
    map: false,
    resume: false,
    customTheme: false,
    headers: 2,
    tags: 5,
    posts: 0,
    brandingOff: false,
    layoutType: true,
    showSubscribers: false,
    customDomain: false,
    stats: false,
    fullSEO: false,
    socials: true,
  },
  pro: {
    links: 15,
    about: true,
    bannerImage: true,
    contact: true,
    embeds: 5,
    services: 3,
    faqs: 5,
    testimonials: 5,
    featured: 5,
    map: true,
    resume: true,
    customTheme: true,
    headers: 5,
    tags: 15,
    posts: 5,
    brandingOff: true,
    layoutType: true,
    showSubscribers: true,
    customDomain: true,
    stats: true,
    fullSEO: true,
    socials: true,
  },
  premium: {
    links: 50,
    about: true,
    bannerImage: true,
    contact: true,
    embeds: 10,
    services: 10,
    faqs: 10,
    testimonials: 10,
    featured: 20,
    map: true,
    resume: true,
    customTheme: true,
    headers: 10,
    tags: 30,
    posts: 20,
    brandingOff: true,
    layoutType: true,
    showSubscribers: true,
    customDomain: true,
    stats: true,
    fullSEO: true,
    socials: true,
  },
};

export default PLAN_FEATURES;

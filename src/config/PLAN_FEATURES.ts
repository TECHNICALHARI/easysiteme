export type PlanType = "free" | "pro" | "premium";

export interface PlanFeatureConfig {
  links: number;
  about: boolean;
//   profileImage: boolean;
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
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatureConfig> = {
  free: {
    links: 3,
    about: false,
    bannerImage: false,
    contact: false,
    embeds: 0,
    services: 0,
    faqs: 0,
    testimonials: 0,
    featured: 0,
    map: false,
    resume: false,
    customTheme: false,
    headers: 1,
    tags: 2,
    posts: 10,
  },
  pro: {
    links: 5,
    about: true,
    bannerImage: true,
    contact: false,
    embeds: 1,
    services: 3,
    faqs: 3,
    testimonials: 2,
    featured: 10,
    map: true,
    resume: true,
    customTheme: true,
    headers: 5,
    tags: 10,
    posts: 5,
  },
  premium: {
    links: 50,
    about: true,
    bannerImage: true,
    contact: true,
    embeds: 10,
    services: 10,
    faqs: 10,
    testimonials: 5,
    featured: 20,
    map: true,
    resume: true,
    customTheme: true,
    headers: 10,
    tags: 20,
    posts: 50,
  },
};

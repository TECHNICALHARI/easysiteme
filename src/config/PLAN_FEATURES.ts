export type PlanType = 'free' | 'pro' | 'premium';

export interface PlanFeatureConfig {
  links: number;
  about: boolean;
  profileImage: boolean;
  contact: boolean;
  embeds: number;
  services: number;
  faqs: number;
  testimonials: number;
  featured: boolean;
  map: boolean;
  resume: boolean;
  customTheme: boolean;
}

export const PLAN_FEATURES: Record<PlanType, PlanFeatureConfig> = {
  free: {
    links: 2,
    about: false,
    profileImage: false,
    contact: false,
    embeds: 0,
    services: 0,
    faqs: 0,
    testimonials: 0,
    featured: false,
    map: false,
    resume: false,
    customTheme: false,
  },
  pro: {
    links: 5,
    about: true,
    profileImage: true,
    contact: false,
    embeds: 1,
    services: 0,
    faqs: 0,
    testimonials: 0,
    featured: false,
    map: false,
    resume: true,
    customTheme: true,
  },
  premium: {
    links: 10,
    about: true,
    profileImage: true,
    contact: true,
    embeds: 5,
    services: 10,
    faqs: 10,
    testimonials: 5,
    featured: true,
    map: true,
    resume: true,
    customTheme: true,
  },
};

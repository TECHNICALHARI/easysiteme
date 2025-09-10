import { z } from "zod";

export const trackLinkSchema = z.object({
  siteId: z.string().min(1),
  url: z.string().url("Invalid URL"),
  title: z.string().optional().or(z.literal("")),
});

export const trackTrafficSchema = z.object({
  siteId: z.string().min(1),
  source: z.string().min(1),
  value: z.number().optional().default(1),
});

export const contactSubmitSchema = z.object({
  siteId: z.string().min(1),
  name: z.string().optional(),
  email: z.string().optional(),
  message: z.string().min(1),
});

export type TrackLinkInput = z.infer<typeof trackLinkSchema>;
export type TrackTrafficInput = z.infer<typeof trackTrafficSchema>;
export type ContactSubmitInput = z.infer<typeof contactSubmitSchema>;

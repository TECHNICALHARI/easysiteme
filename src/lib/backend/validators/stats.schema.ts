import { z } from "zod";

export const linkClickSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
});

export const trafficSourceSchema = z.object({
  label: z.string(),
  value: z.number().nonnegative(),
});

export const contactSubmissionSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  message: z.string(),
  submittedOn: z.string(),
});

export const topLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
  clicks: z.number().nonnegative(),
});

export const statsSchema = z.object({
  linkClicks: z.array(linkClickSchema).optional(),
  trafficSources: z.array(trafficSourceSchema).optional(),
  contactSubmissions: z.array(contactSubmissionSchema).optional(),
  topLinks: z.array(topLinkSchema).optional(),
  lastUpdated: z.string().optional(),
});

export type StatsInput = z.infer<typeof statsSchema>;

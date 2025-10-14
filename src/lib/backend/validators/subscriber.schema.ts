import { z } from "zod";

export const subscriberRowSchema = z.object({
  email: z.string().email(),
  subscribedOn: z.string(),
  status: z.enum(["Active", "Unsubscribed"]),
});

export const subscriberListSchema = z.object({
  data: z.array(subscriberRowSchema).default([]),
  total: z.number().default(0),
  active: z.number().default(0),
  unsubscribed: z.number().default(0),
}).default({
  data: [],
  total: 0,
  active: 0,
  unsubscribed: 0,
});

export const subscriberSettingsSchema = z.object({
  subject: z.string().optional().default(""),
  thankYouMessage: z.string().optional().default(""),
  hideSubscribeButton: z.boolean().optional().default(false),
}).default({
  subject: "",
  thankYouMessage: "",
  hideSubscribeButton: false,
});

export const subscriberSchema = z.object({
  subscriberSettings: subscriberSettingsSchema.optional().default({
    subject: "",
    thankYouMessage: "",
    hideSubscribeButton: false,
  }),
  SubscriberList: subscriberListSchema.optional().default({
    data: [],
    total: 0,
    active: 0,
    unsubscribed: 0,
  }),
});

export type SubscriberInput = z.infer<typeof subscriberSchema>;

import { z } from "zod";

export const subscribeSchema = z.object({
  siteId: z.string().min(1),
  email: z.string().email("Invalid email"),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

export const updateSubscriberSchema = z.object({
  status: z.enum(["Active", "Unsubscribed"]),
});

export type UpdateSubscriberInput = z.infer<typeof updateSubscriberSchema>;

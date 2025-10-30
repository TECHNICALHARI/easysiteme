import { z } from "zod";

export const CreateOrderSchema = z.object({
  planId: z.string().min(1),
  amount: z.number().int().positive(),
  currency: z.string().optional().default("INR"),
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
  planId: z.string().min(1),
});

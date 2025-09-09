import { z } from "zod";

export const signupSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(63, "Subdomain must be at most 63 characters")
    .transform((s) => s.trim().toLowerCase())
    .refine((s) => /^[a-z0-9](?!.*--)[a-z0-9-]*[a-z0-9]$/.test(s), {
      message:
        "Subdomain may contain lowercase letters, numbers and single hyphens; cannot start/end with hyphen or contain consecutive hyphens",
    }),
  email: z.string().trim().email("Invalid email address").optional(),
  mobile: z
    .string()
    .regex(/^\+?[1-9]\d{7,14}$/, "Invalid phone number")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  sendEmailOtp: z.boolean().optional().default(true),
  sendPhoneOtp: z.boolean().optional().default(false),
  countryCode: z.string().min(2).max(5).optional(),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const sendOtpSchema = z.object({
  target: z.string().min(1),
  purpose: z.enum([
    "signup_email",
    "signup_phone",
    "verify_email",
    "verify_phone",
    "reset",
  ]),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  target: z.string().min(1),
  code: z.string().min(4).max(10),
  purpose: z.enum([
    "signup_email",
    "signup_phone",
    "verify_email",
    "verify_phone",
    "reset",
  ]),
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email().optional(),
  mobile: z
    .string()
    .optional()
    .transform((v) => (v ? v.replace(/[^\d+]/g, "") : v))
    .refine((v) => v === undefined || /^\+?[0-9]{8,15}$/.test(v), {
      message: "Mobile must be 8–15 digits, optionally with leading +",
    }),
  password: z.string().optional(),
  otp: z.string().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({
  identifier: z
    .string()
    .min(3, "Identifier is required")
    .transform((s) => s.trim()),
});
export type ForgotInput = z.infer<typeof forgotSchema>;

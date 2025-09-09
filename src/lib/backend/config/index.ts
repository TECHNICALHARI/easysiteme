import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  MONGODB_URI: process.env.MONGODB_URI || "",
  NODE_ENV:
    (process.env.NODE_ENV as "development" | "production") || "development",
  BASE_URL: process.env.BASE_URL || "",
  FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL || "",

  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  COOKIE_NAME: process.env.COOKIE_NAME || "myeasypage_auth",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  CLOUDINARY_UPLOAD_FOLDER:
    process.env.CLOUDINARY_UPLOAD_FOLDER || "myeasypage",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",

  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || "",
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || "",
  TWILIO_FROM: process.env.TWILIO_FROM || process.env.TWILIO_PHONE_NUMBER || "",
  TWILIO_SMS_SERVICE_SID: process.env.TWILIO_SMS_SERVICE_SID || "",
  TWILIO_ENABLED:
    (process.env.TWILIO_ENABLED || "").toLowerCase() === "true" ||
    Boolean(
      process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        (process.env.TWILIO_FROM || process.env.TWILIO_PHONE_NUMBER)
    ),

  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "",

  REDIS_URL: process.env.REDIS_URL || "",
};

export type AppConfig = typeof appConfig;

export const OTP_RATE = {
  WINDOW_MINUTES: 60,
  MAX_PER_WINDOW: 5,
  OTP_TTL_MINUTES: 10,
  MAX_VERIFY_ATTEMPTS: 5,
};

export const RATE_CONFIG = {
  GLOBAL: { LIMIT: 300, WINDOW_SECONDS: 60 }, // 300 req/min per IP by default
  CONTACT: { LIMIT: 2, WINDOW_SECONDS: 60 * 60 }, // 2 contact msgs per hour
  OTP: { LIMIT: 5, WINDOW_SECONDS: 60 * 60 }, // 5 OTP per hour per identifier
  SIGNUP: { LIMIT: 10, WINDOW_SECONDS: 60 * 60 },
};

export type RateConfigKey = keyof typeof RATE_CONFIG;

import nodemailer from "nodemailer";
import { Twilio } from "twilio";
import { appConfig } from "@/lib/backend/config";

type SendResultOk = { ok: true };
type SendResultErr = {
  ok: false;
  provider: "twilio" | "smtp" | "none";
  error: string;
  raw?: any;
};
export type SendResult = SendResultOk | SendResultErr;

let twilioClient: Twilio | null = null;
if (
  appConfig.TWILIO_ENABLED &&
  appConfig.TWILIO_ACCOUNT_SID &&
  appConfig.TWILIO_AUTH_TOKEN
) {
  try {
    twilioClient = new Twilio(
      appConfig.TWILIO_ACCOUNT_SID,
      appConfig.TWILIO_AUTH_TOKEN
    );
  } catch (e) {
    twilioClient = null;
  }
}

let mailTransport: ReturnType<typeof nodemailer.createTransport> | null = null;
if (appConfig.SMTP_HOST && appConfig.SMTP_USER && appConfig.SMTP_PASS) {
  try {
    mailTransport = nodemailer.createTransport({
      host: appConfig.SMTP_HOST,
      port: Number(appConfig.SMTP_PORT || 587),
      secure: Number(appConfig.SMTP_PORT || 587) === 465,
      auth: {
        user: appConfig.SMTP_USER,
        pass: appConfig.SMTP_PASS,
      },
    });
  } catch (e) {
    mailTransport = null;
  }
}

function normalizePhone(p: string) {
  if (!p) return p;
  return String(p).replace(/[\s()-]/g, "");
}

export const NotifyService = {
  async sendSms(toRaw: string, text: string): Promise<SendResult> {
    const to = normalizePhone(String(toRaw));
    if (!twilioClient)
      return { ok: false, provider: "none", error: "Twilio not configured" };
    const fromEnv = (
      process.env.TWILIO_PHONE_NUMBER ||
      appConfig.TWILIO_FROM ||
      ""
    ).trim();
    if (!fromEnv)
      return {
        ok: false,
        provider: "none",
        error: "Twilio from number not configured",
      };
    try {
      const payload: any = { body: text, to };
      if (appConfig.TWILIO_SMS_SERVICE_SID)
        payload.messagingServiceSid = appConfig.TWILIO_SMS_SERVICE_SID;
      else payload.from = fromEnv;
      const msg = await twilioClient.messages.create(payload);
      return { ok: true };
    } catch (err: any) {
      const message = err?.message ?? String(err);
      return { ok: false, provider: "twilio", error: message, raw: err };
    }
  },

  async sendEmail(
    to: string,
    subject: string,
    htmlOrText: string
  ): Promise<SendResult> {
    if (!mailTransport)
      return { ok: false, provider: "none", error: "SMTP not configured" };
    try {
      const from =
        appConfig.EMAIL_FROM ||
        appConfig.SMTP_USER ||
        "no-reply@myeasypage.com";
      const info = await mailTransport.sendMail({
        from,
        to,
        subject,
        html: htmlOrText,
      } as any);
      return { ok: true };
    } catch (err: any) {
      const message = err?.message ?? String(err);
      return { ok: false, provider: "smtp", error: message, raw: err };
    }
  },

  async deliverOtp(
    identifier: string,
    code: string,
    channel: "email" | "mobile"
  ): Promise<SendResult> {
    const text = `Your myeasypage verification code is ${code}. It expires shortly.`;
    if (channel === "mobile") return this.sendSms(identifier, text);
    const subject = "myeasypage verification code";
    const html = `<p>Your verification code is <strong>${code}</strong>. It expires in 10 minutes.</p>`;
    return this.sendEmail(identifier, subject, html);
  },
};

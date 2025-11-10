import { Twilio } from "twilio";
import { appConfig } from "@/lib/backend/config";

type SendResultOk = { ok: true };
type SendResultErr = {
  ok: false;
  provider: "twilio" | "resend" | "none";
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
  } catch {
    twilioClient = null;
  }
}

function renderOtpEmailHtml({
  code,
  ttlMinutes = 10,
  appName = "myeasypage",
  logoUrl = "https://res.cloudinary.com/dlzhyrofc/image/upload/v1762794751/logo_eed2sk.png",
  supportUrl = "https://myeasypage.com/#contact",
}: {
  code: string;
  ttlMinutes?: number;
  appName?: string;
  logoUrl?: string;
  supportUrl?: string;
}): string {
  const prettyApp = escapeHtml(appName);
  const prettyYear = new Date().getFullYear();
  const codeEsc = escapeHtml(code);
  const expiresText = `${ttlMinutes} minute${ttlMinutes === 1 ? "" : "s"}`;
  const logoHtml = `<img
    src="${escapeHtml(logoUrl)}"
    alt="${prettyApp} logo"
    width="120"
    style="display:block; width:120px; max-width:45%; height:auto; object-fit:contain; border:0; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic;"
    />`;

  const logoFallback = `<div style="font-size:0;line-height:0;color:transparent;visibility:hidden;height:0;overflow:hidden;">${prettyApp}</div>`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table width="100%" style="max-width:520px;background:#ffffff;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.06);padding:32px;">
            
           <tr>
              <td align="center" style="padding-bottom:20px;line-height:0;">
                ${logoHtml}
                ${logoFallback}
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:18px;font-weight:600;color:#111827;padding-bottom:16px;">
                ${prettyApp} Verification Code
              </td>
            </tr>

            <tr>
              <td align="center" style="padding:16px;">
                <div style="display:inline-block;padding:18px 28px;border:2px dashed #e5e7eb;border-radius:10px;background:#f9fafb;">
                  <span style="font-family:monospace;font-size:28px;font-weight:700;letter-spacing:6px;color:#111827;">
                    ${codeEsc}
                  </span>
                </div>
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:14px;color:#6b7280;padding-top:16px;">
                This code will expire in <strong style="color:#111827;">${escapeHtml(
                  expiresText
                )}</strong>.
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:13px;color:#9ca3af;padding-top:24px;">
                If you didn’t request this code, please ignore this email.
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:13px;color:#6b7280;padding-top:24px;">
                Need help? <a href="${escapeHtml(
                  supportUrl
                )}" style="color:#4f46e5;font-weight:500;text-decoration:none">Contact support</a>
              </td>
            </tr>

            <tr>
              <td align="center" style="font-size:12px;color:#d1d5db;padding-top:28px;">
                © ${prettyYear} ${prettyApp}
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(str: string) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizePhone(p: string) {
  if (!p) return p;
  return String(p).replace(/[\s()-]/g, "");
}

async function sendViaResend(
  from: string,
  to: string,
  subject: string,
  html: string
): Promise<SendResult> {
  const apiKey = appConfig.RESEND_API_KEY || process.env.RESEND_API_KEY || "";
  if (!apiKey) {
    return {
      ok: false,
      provider: "none",
      error: "Resend API key not configured",
    };
  }
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    });
    if (!resp.ok) {
      const raw = await resp.text().catch(() => null);
      return {
        ok: false,
        provider: "resend",
        error: `Resend responded ${resp.status}`,
        raw,
      };
    }
    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      provider: "resend",
      error: err?.message ?? String(err),
      raw: err,
    };
  }
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
      await twilioClient.messages.create(payload);
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
    const fromDefault = appConfig.EMAIL_FROM || `no-reply@mail.myeasypage.com`;
    return sendViaResend(fromDefault, to, subject, htmlOrText);
  },

  async deliverOtp(
    identifier: string,
    code: string,
    channel: "email" | "mobile"
  ): Promise<SendResult> {
    const ttlMinutes = Number(process.env.OTP_TTL_MINUTES || 10);
    const text = `Your myeasypage verification code is ${code}. It expires in ${ttlMinutes} minutes.`;
    if (channel === "mobile") return this.sendSms(identifier, text);
    const subject = "myeasypage verification code";
    const html = renderOtpEmailHtml({
      code,
      ttlMinutes,
      appName: "myeasypage",
    });
    return this.sendEmail(identifier, subject, html);
  },
};

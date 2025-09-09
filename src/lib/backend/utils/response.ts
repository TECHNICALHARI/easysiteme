import { getCorsHeaders } from "./cors";
import { ZodError } from "zod";

type MaybeRequest = Request | undefined;

function buildHeaders(req?: MaybeRequest) {
  return {
    "Content-Type": "application/json",
    ...getCorsHeaders(req?.headers.get("origin") || undefined),
  } as Record<string, string>;
}

export function successResponse(
  data: any = null,
  message = "OK",
  status = 200,
  req?: MaybeRequest
) {
  const headers = buildHeaders(req);
  const body = {
    success: true,
    message,
    data,
  };
  return new Response(JSON.stringify(body), { status, headers });
}

export function errorResponse(
  errOrMessage: unknown = "Error",
  status = 400,
  req?: MaybeRequest
) {
  const headers = buildHeaders(req);

  if (errOrMessage instanceof ZodError) {
    const z = errOrMessage as ZodError;
    const flattened = z.flatten();
    const errors = {
      fieldErrors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
      issues: z.issues,
    };
    const body = {
      success: false,
      message: "Validation error",
      data: { errors },
    };
    return new Response(JSON.stringify(body), {
      status: Math.max(status, 422),
      headers,
    });
  }

  if (errOrMessage instanceof Error) {
    const body = {
      success: false,
      message: errOrMessage.message || "Error",
      data: null,
    };
    return new Response(JSON.stringify(body), { status, headers });
  }

  if (
    typeof errOrMessage === "object" &&
    errOrMessage !== null &&
    "message" in errOrMessage
  ) {
    const msg = (errOrMessage as any).message;
    const data = (errOrMessage as any).errors ?? null;
    const body = {
      success: false,
      message: typeof msg === "string" ? msg : "Error",
      data,
    };
    return new Response(JSON.stringify(body), { status, headers });
  }

  const message = typeof errOrMessage === "string" ? errOrMessage : "Error";
  const body = {
    success: false,
    message,
    data: null,
  };
  return new Response(JSON.stringify(body), { status, headers });
}

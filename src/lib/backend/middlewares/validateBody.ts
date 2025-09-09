// src/backend/middlewares/validateBody.ts
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/errors";

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: Request) => {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json"))
      throw new ApiError("Expected application/json", 415);

    // NOTE: we read the raw JSON once
    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      // Use ZodError.issues (ZodIssue[])
      const first = parsed.error.issues[0];
      // ZodIssue has .message and .code
      throw new ApiError(first.message, 400, first.code);
    }

    return parsed.data as T;
  };
}

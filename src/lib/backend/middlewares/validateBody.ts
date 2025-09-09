import type { ZodSchema } from "zod";
import { ApiError } from "../utils/errors";

export function validateBody<T>(schema: ZodSchema<T>) {
  return async (req: Request) => {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json"))
      throw new ApiError("Expected application/json", 415);

    const body = await req.json();

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      throw new ApiError(first.message, 400, first.code);
    }

    return parsed.data as T;
  };
}

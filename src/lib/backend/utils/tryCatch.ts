import { errorResponse } from "./response";
import { ApiError } from "./errors";

export function wrapHandler(
  handler: (req: Request, ctx?: any) => Promise<any>
) {
  return async function (req: Request) {
    try {
      const result = await handler(req);
      if (result && typeof (result as any).json === "function") return result;
      return result;
    } catch (err: any) {
      if (err instanceof ApiError)
        return errorResponse(err.message, err.status, { code: err.code });
      console.error("Unhandled error:", err);
      return errorResponse(err?.message || "Internal server error", 500);
    }
  };
}

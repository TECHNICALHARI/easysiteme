import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { contactSubmitSchema } from "@/lib/backend/validators/stats.schema";
import { StatService } from "@/lib/backend/services/stats.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const body = await req.json();
    const parsed = contactSubmitSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    }

    const service = new StatService();
    const doc = await service.contactSubmit(parsed.data);

    return successResponse(
      { submitted: true, id: doc._id },
      "Contact submitted",
      201,
      req
    );
  } catch (err: any) {
    console.error("stats/contact error:", err);
    return errorResponse("Internal server error", 500, req);
  }
}

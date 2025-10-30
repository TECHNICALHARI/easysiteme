import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { successResponse, errorResponse } from "@/lib/backend/utils/response";
import { CreateOrderSchema } from "@/lib/backend/validators/payments.schema";
import { createOrderService } from "@/lib/backend/services/payments.service";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const user = await getAuthUserFromCookie(req);
    if (!user) return errorResponse("Unauthorized", 401, req);
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success)
      return errorResponse(
        { message: "Validation error", data: parsed.error.format() },
        422,
        req
      );
    const { planId, amount } = parsed.data;
    const notes = {
      ownerId: user.id,
      email: user.email || null,
      mobile: user.mobile || null,
      subdomain: user.subdomain || null,
      planBefore: user.plan || null,
    };
    const payload = await createOrderService(user.id, planId, amount, notes);
    return successResponse(payload, "Order created", 200, req);
  } catch (err: any) {
    if (err instanceof SyntaxError)
      return errorResponse("Invalid JSON body", 400, req);
    return errorResponse(err?.message || "Failed to create order", 500, req);
  }
}

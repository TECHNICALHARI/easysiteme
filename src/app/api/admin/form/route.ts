import { connectDb } from "@/lib/backend/config/db";
import { getAuthUserFromCookie } from "@/lib/backend/middlewares/requireAuth";
import { Site } from "@/lib/backend/models/Site.model";
import { wrapHandler } from "@/lib/backend/utils/tryCatch";
import { NextResponse } from "next/server";

export const GET = wrapHandler(async (req: Request) => {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  const site = await Site.findOne({ owner: user._id }).lean();
  if (!site)
    return NextResponse.json(
      { success: false, message: "Site not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: site.formData });
});

export const POST = wrapHandler(async (req: Request) => {
  await connectDb();
  const user = await getAuthUserFromCookie(req);
  const body = await req.json();
  const updated = await Site.findOneAndUpdate(
    { owner: user._id },
    { $set: { formData: body } },
    { new: true, upsert: true }
  );
  return NextResponse.json({ success: true, data: updated?.formData });
});

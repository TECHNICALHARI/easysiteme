import { NextRequest } from "next/server";
import { connectDb } from "@/lib/backend/config/db";
import { User } from "@/lib/backend/models/User.model";
import { ProfileDesign } from "@/lib/backend/models/ProfileDesign.model";
import { appConfig } from "@/lib/backend/config";

function normalizeHost(host?: string | null) {
  if (!host) return "";
  const h = host.split(":")[0].toLowerCase();
  if (h.startsWith("www.")) return h.replace(/^www\./, "");
  return h;
}

function isLocalHost(host?: string | null) {
  if (!host) return true;
  const h = host.split(":")[0].toLowerCase();
  if (h === "localhost") return true;
  if (h.startsWith("127.") || h.startsWith("0.0.0.0")) return true;
  return false;
}

export async function resolveOwnerFromRequest(
  req: NextRequest,
  pathUsername?: string
) {
  await connectDb();
  const hostRaw = req.headers.get("host") ?? "";
  const host = normalizeHost(hostRaw);
  let ownerId: string | null = null;
  let userDoc: any = null;
  let profileDesignDoc: any = null;
  const productionLike =
    appConfig.NODE_ENV === "production" || (host !== "" && !isLocalHost(host));
  if (productionLike) {
    if (host) {
      profileDesignDoc = await ProfileDesign.findOne({
        "settings.customDomain": host,
      })
        .select("owner settings")
        .lean()
        .exec();
      if (profileDesignDoc && profileDesignDoc.owner) {
        ownerId = String(profileDesignDoc.owner);
        userDoc = await User.findById(ownerId)
          .select("_id subdomain plan email mobile countryCode")
          .lean()
          .exec();
        return { ownerId, userDoc, profileDesignDoc };
      }
      if (host.endsWith(".myeasypage.com")) {
        const sub = host.split(".")[0];
        userDoc = await User.findOne({ subdomain: sub })
          .select("_id subdomain plan email mobile countryCode")
          .lean()
          .exec();
        if (userDoc && (userDoc as any)._id) {
          ownerId = String((userDoc as any)._id);
          profileDesignDoc = await ProfileDesign.findOne({ owner: ownerId })
            .lean()
            .exec();
          return { ownerId, userDoc, profileDesignDoc };
        }
      }
    }
  }
  if (pathUsername) {
    userDoc = await User.findOne({ subdomain: pathUsername })
      .select("_id subdomain plan email mobile countryCode")
      .lean()
      .exec();
    if (userDoc && (userDoc as any)._id) {
      ownerId = String((userDoc as any)._id);
      profileDesignDoc = await ProfileDesign.findOne({ owner: ownerId })
        .lean()
        .exec();
      return { ownerId, userDoc, profileDesignDoc };
    }
    profileDesignDoc = await ProfileDesign.findOne({
      "settings.customDomain": pathUsername,
    })
      .select("owner settings")
      .lean()
      .exec();
    if (profileDesignDoc && (profileDesignDoc as any).owner) {
      ownerId = String((profileDesignDoc as any).owner);
      userDoc = await User.findById(ownerId)
        .select("_id subdomain plan email mobile countryCode")
        .lean()
        .exec();
      return { ownerId, userDoc, profileDesignDoc };
    }
  }
  return { ownerId: null, userDoc: null, profileDesignDoc: null };
}

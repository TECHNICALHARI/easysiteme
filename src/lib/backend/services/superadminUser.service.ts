import { User } from "@/lib/backend/models/User.model";
import { connectDb } from "@/lib/backend/config/db";
import { RoleEnum } from "@/lib/backend/constants/enums";

export type SuperAdminUserRow = {
  _id: string;
  email?: string;
  subdomain?: string;
  plan?: string;
  createdAt?: Date | string;
  roles?: string[];
};

class SuperadminUserServiceClass {
  async listUsers(opts?: {
    page?: number;
    limit?: number;
    q?: string;
    plan?: string;
  }): Promise<{
    data: SuperAdminUserRow[];
    total: number;
    page: number;
    limit: number;
  }> {
    await connectDb();
    const page = Math.max(1, Number(opts?.page || 1));
    const limit = Math.min(200, Math.max(1, Number(opts?.limit || 20)));
    const skip = (page - 1) * limit;
    const q = (opts?.q || "").trim();
    const plan = (opts?.plan || "").trim();

    const match: any = { roles: RoleEnum.ADMIN };
    if (plan) match.plan = plan;
    if (q) {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      match.$or = [{ email: regex }, { subdomain: regex }];
    }

    const [data, total] = await Promise.all([
      User.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      User.countDocuments(match).exec(),
    ]);

    const rows: SuperAdminUserRow[] = data.map((u: any) => ({
      _id: String(u._id),
      email: u.email,
      subdomain: u.subdomain,
      plan: u.plan,
      createdAt: u.createdAt,
      roles: Array.isArray(u.roles) ? u.roles : [],
    }));

    return { data: rows, total, page, limit };
  }
}

export const SuperadminUserService = new SuperadminUserServiceClass();
export default SuperadminUserService;

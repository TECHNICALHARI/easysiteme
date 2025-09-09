import mongoose from "mongoose";
import { PlanEnum, RoleEnum } from "../constants/enums";
import { IUserDoc, User } from "../models/User.model";
import { comparePassword, hashPassword } from "../utils/hash";

export type CreateUserInput = {
  subdomain: string;
  email?: string;
  mobile?: string;
  countryCode?: string;
  password: string;
  emailVerified?: boolean;
  mobileVerified?: boolean;
  plan?: PlanEnum;
};

export const UserService = {
  async findBySubdomain(subdomain: string): Promise<IUserDoc | null> {
    return User.findOne({ subdomain })
      .lean()
      .exec() as Promise<IUserDoc | null>;
  },

  async findByEmail(email: string): Promise<IUserDoc | null> {
    return User.findOne({ email }).exec();
  },

  async findByMobile(mobile: string): Promise<IUserDoc | null> {
    return User.findOne({ mobile }).exec();
  },

  async existsByAny({
    subdomain,
    email,
    mobile,
  }: {
    subdomain?: string;
    email?: string;
    mobile?: string;
  }): Promise<{ subdomain?: string; email?: string; mobile?: string } | null> {
    const q: any[] = [];
    if (subdomain) q.push({ subdomain });
    if (email) q.push({ email });
    if (mobile) q.push({ mobile });
    if (q.length === 0) return null;
    const found = await User.findOne({ $or: q }).lean().exec();
    if (!found) return null;
    return {
      subdomain: found.subdomain,
      email: found.email,
      mobile: found.mobile,
    };
  },

  async create(
    input: CreateUserInput,
    options?: { session?: mongoose.ClientSession }
  ): Promise<IUserDoc> {
    const passwordHash = await hashPassword(input.password);
    const rawCountry = input.countryCode ?? undefined;
    const countryCode =
      typeof rawCountry === "string" && rawCountry.trim() !== ""
        ? rawCountry.trim().startsWith("+")
          ? rawCountry.trim()
          : `+${rawCountry.trim()}`
        : undefined;
    const docObj: any = {
      email: input.email ?? undefined,
      mobile: input.mobile ?? undefined,
      countryCode: countryCode ?? undefined,
      passwordHash,
      roles: [RoleEnum.ADMIN],
      subdomain: input.subdomain,
      emailVerified: input.emailVerified ?? false,
      mobileVerified: input.mobileVerified ?? false,
      plan: input.plan ?? PlanEnum.FREE,
    };

    if (options?.session) {
      const doc = await new User(docObj).save({ session: options.session });
      return doc;
    } else {
      const doc = await User.create(docObj);
      return doc;
    }
  },

  async verifyPassword(user: IUserDoc, password: string): Promise<boolean> {
    if (!user?.passwordHash) return false;
    return comparePassword(password, user.passwordHash);
  },

  publicProfile(
    user:
      | Partial<IUserDoc>
      | {
          _id?: any;
          subdomain?: string;
          email?: string;
          mobile?: string;
          countryCode?: string;
          roles?: any;
          plan?: string;
        }
  ) {
    return {
      id: user._id,
      email: user.email ?? null,
      mobile: user.mobile ?? null,
      countryCode: (user as any).countryCode ?? null,
      subdomain: user.subdomain ?? null,
      roles: user.roles ?? [],
      plan: user.plan ?? null,
    };
  },
};

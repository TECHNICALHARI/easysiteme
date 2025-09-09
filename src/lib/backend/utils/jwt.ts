import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { appConfig } from "../config";

if (!appConfig.JWT_SECRET) throw new Error("JWT_SECRET not set");

const secret: Secret = appConfig.JWT_SECRET as Secret;

export function signJwt(payload: object): string {
  const options: SignOptions = {
    expiresIn: appConfig.JWT_EXPIRES_IN as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload as string | object | Buffer, secret, options);
}

export function verifyJwt<T = any>(token: string): T {
  return jwt.verify(token, secret) as T;
}

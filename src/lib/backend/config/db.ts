// backend/config/db.ts
import mongoose from "mongoose";
import { appConfig } from "./index";

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = {
  conn: null,
  promise: null,
};

export async function connectDb() {
  if (cached.conn) return cached.conn;

  if (!appConfig.MONGODB_URI) {
    throw new Error("MONGODB_URI not defined in environment");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(appConfig.MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

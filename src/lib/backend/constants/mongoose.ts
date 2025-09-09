import { Document } from "mongoose";

export interface IWithTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export type MongooseDoc<T> = T & Document & IWithTimestamps;

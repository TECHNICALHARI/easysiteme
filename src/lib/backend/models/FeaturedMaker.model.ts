import mongoose, { Document, Schema, Types } from "mongoose";

const FeaturedMakerSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rank: { type: Number, default: 9999 },
    headline: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type IFeaturedMakerDoc = Document & {
  owner: Types.ObjectId;
  rank: number;
  headline?: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export const FeaturedMaker =
  (mongoose.models.FeaturedMaker as mongoose.Model<IFeaturedMakerDoc>) ||
  mongoose.model<IFeaturedMakerDoc>("FeaturedMaker", FeaturedMakerSchema);

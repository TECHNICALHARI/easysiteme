import { z } from "zod";

const DATA_URI_REGEX = /^data:(image\/[a-zA-Z+-.]+);base64,[A-Za-z0-9+/=\s]+$/;

function isHttpUrl(v: unknown) {
  if (typeof v !== "string") return false;
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function isDataUri(v: unknown) {
  return typeof v === "string" && DATA_URI_REGEX.test(v);
}

export const basePostSchema = z.object({
  postId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z
    .union([z.string(), z.undefined(), z.null()])
    .optional()
    .refine(
      (v) =>
        v === undefined ||
        v === null ||
        v === "" ||
        isHttpUrl(v) ||
        isDataUri(v),
      {
        message: "Thumbnail must be a valid URL, data URI, or empty",
      }
    ),
  seoTitle: z.string().max(60).optional().default(""),
  seoDescription: z.string().max(160).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  thumbnailPublicId: z.string().optional(),
});

export const createPostSchema = basePostSchema.extend({
  postId: z.string().uuid().optional(),
});

export const updatePostSchema = basePostSchema.partial().extend({
  postId: z.string().uuid(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostInput = z.infer<typeof basePostSchema>;

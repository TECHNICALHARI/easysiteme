import { z } from "zod";

export const basePostSchema = z.object({
  postId: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  thumbnail: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) =>
        v === "" ||
        v === undefined ||
        (() => {
          try {
            if (!v) return true;
            new URL(v);
            return true;
          } catch {
            return false;
          }
        })(),
      { message: "Thumbnail must be a valid URL or empty" }
    ),
  seoTitle: z.string().max(60).optional().default(""),
  seoDescription: z.string().max(160).optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().default(false),
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

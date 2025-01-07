import { z } from "zod";

export const BlogEntrySchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  createdAt: z.string(),
  headerImageUrl: z.string(),
});

export type BlogEntry = z.infer<typeof BlogEntrySchema>;
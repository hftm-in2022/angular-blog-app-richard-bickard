import { z } from "zod";

// Define LocalDateTime schema
const LocalDateTime = z.string();

// Comment schema
const CommentSchema = z.object({
  id: z.number().int(),
  content: z.string(),
  author: z.string(),
  updatedAt: LocalDateTime.optional(),
  createdAt: LocalDateTime.optional(),
});
export type Comment = z.infer<typeof CommentSchema>;

// Entry schema
export const EntrySchema = z.object({
  id: z.number().int().optional(),
  updatedAt: LocalDateTime.optional(),
  createdAt: LocalDateTime.optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  comments: z.array(CommentSchema).optional(),
  author: z.string().optional(),
  likes: z.number().int().optional(),
  likedByMe: z.boolean().optional(),
  createdByMe: z.boolean().optional(),
  headerImageUrl: z.string().optional(),
});
export type Entry = z.infer<typeof EntrySchema>;

// EntryOverview schema
export const EntryOverviewSchema = z.object({
  id: z.number().int().optional(),
  updatedAt: LocalDateTime.optional(),
  createdAt: LocalDateTime.optional(),
  title: z.string().optional(),
  contentPreview: z.string().optional(),
  author: z.string().optional(),
  likes: z.number().int().optional(),
  comments: z.number().int().optional(),
  likedByMe: z.boolean().optional(),
  createdByMe: z.boolean().optional(),
  headerImageUrl: z.string().optional(),
});
export type EntryOverview = z.infer<typeof EntryOverviewSchema>;

// LikeInfo schema
export const LikeInfoSchema = z.object({
  likedByMe: z.boolean().optional(),
});
export type LikeInfo = z.infer<typeof LikeInfoSchema>;

// NewComment schema
export const NewCommentSchema = z.object({
  content: z.string().optional(),
});
export type NewComment = z.infer<typeof NewCommentSchema>;

// NewEntry schema
export const NewEntrySchema = z.object({
  title: z.string().min(3),
  content: z.string().min(3),
  headerImageUrl: z.string().optional(),
});
export type NewEntry = z.infer<typeof NewEntrySchema>;

// PagedData schema
export const PagedDataSchema = <T>(dataSchema: z.ZodType<T>) =>
  z.object({
    data: z.array(dataSchema),
    pageIndex: z.number().int().optional(),
    pageSize: z.number().int().optional(),
    totalCount: z.number().int().optional(),
    maxPageSize: z.number().int().optional(),
  });

export type PagedData<T> = z.infer<ReturnType<typeof PagedDataSchema<T>>>;

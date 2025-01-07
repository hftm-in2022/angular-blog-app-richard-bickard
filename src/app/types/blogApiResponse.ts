import { z } from "zod";

export const BlogApiResponseSchema = <T>(itemSchema: z.ZodType<T>) => z.object({
  data: z.array(itemSchema),
  maxPageSize: z.number(),
  pageIndex: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
});

export type BlogApiResponse<T> = z.infer<ReturnType<typeof BlogApiResponseSchema<T>>>;
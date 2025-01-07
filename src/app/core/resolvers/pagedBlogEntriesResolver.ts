import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { BlogService } from "../services/blog.service";
import { lastValueFrom } from "rxjs";
import { EntryOverview, PagedData } from "../../types";
export const pagedBlogEntriesResolver: ResolveFn<
  PagedData<EntryOverview>
> = async () => {
  const blogService = inject(BlogService);
  return await lastValueFrom(blogService.getBlogs());
};

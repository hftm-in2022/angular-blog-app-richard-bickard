import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { BlogService } from "../services/blog.service";
import { lastValueFrom } from "rxjs";
import { Entry } from "../../types";
export const blogEntryResolver: ResolveFn<Entry> = async (route) => {
  const blogService = inject(BlogService);
  const id = route.paramMap.get("id");
  if (!id) throw new Error("No id provided");
  return await lastValueFrom(blogService.getBlog(id));
};

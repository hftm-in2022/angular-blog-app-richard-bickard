import { Routes } from "@angular/router";
import { pagedBlogEntriesResolver } from "./core/resolvers/pagedBlogEntriesResolver";
import { isAuthenticatedGuard } from "./auth/authenticated.guard";

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./features/blog-overview-page/blog-overview-page.routes"),
    resolve: { model: pagedBlogEntriesResolver },
  },
  {
    path: "blogs",
    loadChildren: () =>
      import("./features/blog-detail-page/blog-detail-page.routes"),
  },
  {
    path: "add",
    loadChildren: () => import("./features/blog-add-page/blog-add-page.routes"),
    canActivate: [isAuthenticatedGuard],
  },
  {
    path: "error",
    loadChildren: () => import("./features/error-page/error-page.routes"),
  },
];

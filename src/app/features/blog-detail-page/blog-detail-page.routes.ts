import { Routes } from "@angular/router";
import { BlogDetailPageComponent } from "./blog-detail-page.component";
import { blogEntryResolver } from "../../core/resolvers/blogEntryResolver";
const routes: Routes = [
  {
    path: ":id",
    component: BlogDetailPageComponent,
    resolve: { blog: blogEntryResolver },
  },
];
export default routes;

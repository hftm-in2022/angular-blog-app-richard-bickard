import { Component, inject } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BlogService } from "./core/services/blog.service";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [MatProgressSpinnerModule, SidebarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent {
  title = "angular-blog-app-richard-bickard";
  blogService = inject(BlogService);
}
